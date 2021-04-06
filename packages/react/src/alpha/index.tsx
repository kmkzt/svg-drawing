import React, {
  useState,
  useRef,
  RefObject,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  MutableRefObject,
  MouseEventHandler,
  MouseEvent,
} from 'react'
import { Svg, Path, Command } from '@svg-drawing/core/lib/svg'
import {
  DrawHandler,
  PencilHandler,
  ResizeHandler,
} from '@svg-drawing/core/lib/handler'
import { BezierCurve, CommandsConverter } from '@svg-drawing/core/lib/convert'
import { throttle } from '@svg-drawing/core/lib/throttle'
import { isAlmostSameNumber } from '@svg-drawing/core/lib/utils'
import type {
  DrawHandlerCallback,
  PathObject,
  PointObject,
  SvgObject,
} from '@svg-drawing/core/lib/types'

type UseDrawing<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseDrawingMethods
]

// eslint-disable-next-line @typescript-eslint/ban-types
type UseDrawingMethods = {
  svg: MutableRefObject<Svg>
  drawHandler: MutableRefObject<DrawHandler | null>
  resizeHandler: MutableRefObject<ResizeHandler | null>
  on: () => void
  off: () => void
  update: () => void
  clear: () => void
  undo: () => void
  setDrawHandler: (handler: typeof DrawHandler) => void
}

const RENDER_INTERVAL = 0
const DRAW_DELAY = 20
const defaultPathOptions: PathObject = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}
type DrawingOptions = {
  pathOptions: PathObject
  commandsConverter?: CommandsConverter
  drawHandler?: typeof DrawHandler
}
export const useDrawing = <T extends HTMLElement>({
  pathOptions,
  commandsConverter,
  drawHandler: CustomDrawHandler,
}: DrawingOptions): UseDrawing<T> => {
  const drawElRef = useRef<T>(null)
  const svgRef = useRef(new Svg({ width: 0, height: 0 }))
  const drawPathRef = useRef<Path | null>(null)
  const drawPointsRef = useRef<PointObject[]>([])
  const converter = useMemo<CommandsConverter>(
    () => commandsConverter ?? new BezierCurve().convert,
    [commandsConverter]
  )

  const [svgObj, setSvgObj] = useState(svgRef.current.toJson())

  /**
   * A variable called shouldUpdateRef manages whether to update to reduce the number of times setState is executed.
   */
  const shouldUpdateRef = useRef<boolean>(false)
  const update = useCallback(() => {
    shouldUpdateRef.current = true
  }, [])
  useLayoutEffect(() => {
    const stopId = setInterval(() => {
      if (!shouldUpdateRef.current) return
      shouldUpdateRef.current = false
      setSvgObj(svgRef.current.toJson())
    }, RENDER_INTERVAL)
    return () => clearInterval(stopId)
  }, [])

  /**
   * Draw methods
   */
  const createDrawPath = useCallback((): Path => {
    drawPointsRef.current = []
    return new Path({
      ...defaultPathOptions,
      ...pathOptions,
    })
  }, [pathOptions])

  const updateCommands = useCallback(() => {
    if (!drawPathRef.current) return
    drawPathRef.current.commands = converter(drawPointsRef.current)
    update()
  }, [converter, update])

  const handleDrawStart = useCallback<DrawHandlerCallback['start']>(() => {
    if (drawPathRef.current) return
    drawPathRef.current = createDrawPath()
    svgRef.current.addPath(drawPathRef.current)
  }, [createDrawPath])

  const handleDrawMove = useMemo<DrawHandlerCallback['move']>(() => {
    const move: DrawHandlerCallback['move'] = (po) => {
      if (!drawPathRef.current) return
      drawPointsRef.current = [...drawPointsRef.current, po]
      updateCommands()
    }
    return throttle(move, DRAW_DELAY)
  }, [updateCommands])

  const handleDrawEnd = useCallback<DrawHandlerCallback['end']>(() => {
    drawPathRef.current = null
  }, [])

  /**
   * Setup DrawHandler
   */
  const drawHandlerRef = useRef<DrawHandler | null>(null)

  useEffect(() => {
    if (!drawHandlerRef.current) return
    drawHandlerRef.current.start = handleDrawStart
    drawHandlerRef.current.move = handleDrawMove
    drawHandlerRef.current.end = handleDrawEnd
  }, [handleDrawStart, handleDrawMove, handleDrawEnd])

  const setDrawHandler = useCallback(
    (Handler: typeof DrawHandler) => {
      if (!drawElRef.current) return
      const drawEl = drawElRef.current
      const { width, height } = drawEl.getBoundingClientRect()
      svgRef.current.resize({ width, height })
      drawHandlerRef.current = new Handler(drawElRef.current, {
        start: handleDrawStart,
        move: handleDrawMove,
        end: handleDrawEnd,
      })
      drawHandlerRef.current.on()
    },
    [handleDrawEnd, handleDrawMove, handleDrawStart]
  )

  useEffect(() => {
    if (drawHandlerRef.current) drawHandlerRef.current.off()
    setDrawHandler(CustomDrawHandler ?? PencilHandler)
  }, [CustomDrawHandler, setDrawHandler])

  /**
   * Setup ResizeHandler
   */
  const resizeHandlerRef = useRef<ResizeHandler | null>(null)
  useEffect(() => {
    if (!drawElRef.current) return
    if (resizeHandlerRef.current) return
    const drawEl = drawElRef.current
    const svg = svgRef.current
    const resizeHandler = new ResizeHandler(drawEl, {
      resize: ({ width, height }) => {
        if (isAlmostSameNumber(svg.width, width)) return
        svg.resize({ width, height })
        shouldUpdateRef.current = true
      },
    })
    resizeHandlerRef.current = resizeHandler
    resizeHandler.on()
    return () => resizeHandler.off()
  })

  /**
   * Methods
   */
  const on = useCallback(() => {
    if (resizeHandlerRef.current) resizeHandlerRef.current.on()
    if (drawHandlerRef.current) drawHandlerRef.current.on()
  }, [])

  const off = useCallback(() => {
    if (resizeHandlerRef.current) resizeHandlerRef.current.off()
    if (drawHandlerRef.current) drawHandlerRef.current.off()
  }, [])

  const clear = useCallback(() => {
    svgRef.current.paths = []
    update()
  }, [update])

  const undo = useCallback(() => {
    svgRef.current.paths.pop()
    update()
  }, [update])

  return [
    drawElRef,
    svgObj,
    {
      svg: svgRef,
      resizeHandler: resizeHandlerRef,
      drawHandler: drawHandlerRef,
      update,
      undo,
      clear,
      on,
      off,
      setDrawHandler,
    },
  ]
}

type EditPathIndex = {
  path?: number
  command?: number
  point?: number
}

type EditSvgEventHandler = {
  editing?: EditPathIndex
  onSelectPath: (arg: EditPathIndex) => void
  onUpdatePath: (arg: { index: EditPathIndex; point: PointObject }) => void
}

export const RenderSvg = ({
  background,
  paths,
  editing,
  onSelectPath: handleSelectPath,
  onUpdatePath: handleUpdatePath,
  ...size
}: SvgObject & EditSvgEventHandler) => {
  const handleClick = useCallback(
    (pathIndex: number): MouseEventHandler => (ev) => {
      ev.preventDefault()
      handleSelectPath({
        path: pathIndex,
      })
    },
    [handleSelectPath]
  )

  const handleUpdateCommand = useCallback(
    (pathIndex: number) => ({ index, point }: ArgUpdateCommand) => {
      handleUpdatePath({
        index: {
          path: pathIndex,
          ...index,
        },
        point,
      })
    },
    [handleUpdatePath]
  )
  return (
    <svg {...size}>
      {background && <rect {...size} fill={background} />}
      {paths.map((pathAttr, i) =>
        i === editing?.path ? (
          <EditPath
            key={i}
            {...pathAttr}
            onUpdateCommand={handleUpdateCommand(i)}
            onSelectCommand={handleSelectCommand(i)}
          />
        ) : (
          <path key={i} {...pathAttr} onClick={handleClick(i)} />
        )
      )}
    </svg>
  )
}

const EDIT_CONFIG = {
  line: 1,
  point: 3,
  color: {
    main: '#09f',
    sub: '#f90',
  },
  fill: 'none',
} as const

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

type ControlPoint = {
  point?: PointObject
  prev?: PointObject
  next?: PointObject
  d: string
}

type EditCommandIndex = {
  command: number
  point: number
}
type ArgUpdateCommand = {
  index: EditCommandIndex
  point: PointObject
}
type EditPathEventHandler = {
  editing?: EditCommandIndex
  onSelectCommand: (arg: EditCommandIndex) => void
  onUpdateCommand: (arg: ArgUpdateCommand) => void
}
export const EditPath = ({
  d,
  onEditPath,
  onSelectPath,
  ...attrs
}: PathObject & EditPathEventHandler) => {
  const commands: Command[] = useMemo(() => {
    if (!d) return []
    const path = new Path()
    path.parseCommandString(d)
    return path.commands
  }, [d])

  const controlPoint: ControlPoint[] = useMemo(() => {
    const result: ControlPoint[] = []
    for (let i = 0; i < commands.length; i += 1) {
      const curr = commands[i]
      const next = commands[i + 1]
      const outlinePoints = [
        curr.cr?.toJson(),
        curr.point?.toJson(),
        next?.cl?.toJson(),
      ].filter(Boolean) as PointObject[]
      result.push({
        point: curr.point?.toJson(),
        prev: curr.cl?.toJson(),
        next: curr.cr?.toJson(),
        d: genOutline(outlinePoints),
      })
    }
    return result
  }, [commands])
  const handleChangePath = useCallback(
    (ev: MouseEvent<HTMLOrSVGElement>) => {
      onChangePath('path', { ...ev })
    },
    [onChangePath]
  )

  const handleChangePoint = useCallback(
    ({index, valueIndex}: {index: number, valIndex: number}) => (ev: MouseEvent<HTMLOrSVGElement>) => {
      onEdit({
        index,
        valueIndex,
        point: {
          x: ev.clientX,
          y: ev.clientY,
        },
      })
    },
    [onChangePoint]
  )

  return (
    <>
      <path d={d} {...attrs} />
      <path
        d={d}
        onMouseMove={handleChangePath}
        strokeWidth={EDIT_CONFIG.line}
        stroke={EDIT_CONFIG.color.main}
        fill={EDIT_CONFIG.fill}
      />
      {controlPoint.map(({ point, prev, next, d }: ControlPoint, i) => (
        <g key={i}>
          <path
            d={d}
            strokeWidth={EDIT_CONFIG.line}
            stroke={selected === i ? '#f00' : EDIT_CONFIG.color.main}
            fill={EDIT_CONFIG.fill}
          />
          {[prev, next, point].map(
            (po: PointObject | undefined, k) =>
              po && (
                <circle
                  cx={po.x}
                  cy={po.y}
                  onMouseMove={handleChangePoint(i, k)}
                  r={EDIT_CONFIG.point}
                  style={{
                    fill: EDIT_CONFIG.color.sub,
                  }}
                />
              )
          )}
        </g>
      ))}
    </>
  )
}
