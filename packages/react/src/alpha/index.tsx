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
import { Svg, Path } from '@svg-drawing/core/lib/svg'
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
type EditEventHandler = {
  onChangePath?: (arg: any) => void
  onChangePoint?: (arg: any) => void
}

export const RenderSvg = ({
  background,
  paths,
  onSelectPath: handleSelectPath,
  onChangePath: handleChangePath,
  onChangePoint: handleChangePoint,
  editPathIndex,
  ...size
}: SvgObject &
  EditEventHandler & {
    editPathIndex?: number
    onSelectPath: (i: number) => void
  }) => {
  const handleClick = useCallback(
    (i): MouseEventHandler => (ev) => {
      ev.preventDefault()
      handleSelectPath(i)
    },
    [handleSelectPath]
  )
  return (
    <svg {...size}>
      {background && <rect {...size} fill={background} />}
      {paths.map((pathAttr, i) =>
        i !== editPathIndex ? (
          <path key={i} {...pathAttr} onClick={handleClick(i)} />
        ) : (
          <EditPath
            key={i}
            {...pathAttr}
            onChangePath={handleChangePath}
            onChangePoint={handleChangePoint}
          />
        )
      )}
    </svg>
  )
}

const EDIT_CONFIG = {
  line: 1,
  point: 5,
  color: {
    main: '#09f',
    sub: '#f90',
  },
  fill: 'none'
} as const

export const EditPath = ({
  d,
  onChangePath,
  onChangePoint,
  ...attrs
}: PathObject & EditEventHandler) => {
  const [selected, setSelected] = useState(0)
  const pointsList: PointObject[][] = useMemo(() => {

    if (!d) return []
    const path = new Path()
    path.parseCommandString(d)
    return path.commands.reduce((re, com) => {
      if (!com.point) return re
      const po = [
        com.cl?.toJson(),
        com.point?.toJson(),
        com.cr?.toJson(),
      ].filter(Boolean) as PointObject[]
      if (!po.length) return re
      return [...re, po]
    }, [] as PointObject[][])
  }, [d])
  const handleChangePath = useCallback(
    (ev: MouseEvent<HTMLOrSVGElement>) => {
      onChangePath('path', { ...ev })
    },
    [onChangePath]
  )

  const handleChangePoint = useCallback(
    (i: number) => (ev: MouseEvent<HTMLOrSVGElement>) => {
      setSelected(i)
      console.log(pointsList[i])
      onChangePoint('point', i, { ...ev })
    },
    [onChangePoint, pointsList]
  )

  const genOutline = useCallback(
    (points: PointObject[]) =>
      points.reduce(
        (str, po, i) =>
          i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`,
        ''
      ),
    []
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
      {pointsList.map((points, i) =>
        points.length === 1 ? (
          <circle
            key={i}
            cx={points[0].x}
            cy={points[0].y}
            onMouseMove={handleChangePoint(i)}
            r={EDIT_CONFIG.point}
            style={{
              fill: selected === i ? '#f00' : EDIT_CONFIG.color.main,
            }}
          />
        ) : (
          <g key={i}>
            <path
              d={genOutline(points)}
              strokeWidth={EDIT_CONFIG.line}
              stroke={EDIT_CONFIG.color.main}
              fill={EDIT_CONFIG.fill}
            />
            {points.map(({ x, y }, k) => (
              <circle
                key={k}
                cx={x}
                cy={y}
                onMouseMove={k === 1 ? handleChangePoint(i) : undefined}
                r={EDIT_CONFIG.point}
                style={{
                  fill:
                    i !== selected
                      ? EDIT_CONFIG.color.sub
                      : k === 0
                      ? '#0F0'
                      : k === 1
                      ? '#F00'
                      : '#00F',
                }}
              />
            ))}
          </g>
        )
      )}
    </>
  )
}
