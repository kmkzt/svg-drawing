import React, {
  useState,
  useRef,
  RefObject,
  useEffect,
  useCallback,
  useMemo,
  MutableRefObject,
  MouseEventHandler,
} from 'react'
import { Svg, Path, Command, COMMAND_TYPE } from '@svg-drawing/core/lib/svg'
import { DrawHandler, ResizeHandler } from '@svg-drawing/core/lib/handler'
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
  ref: MutableRefObject<Svg>
  on: () => void
  off: () => void
  update: () => void
  clear: () => void
  undo: () => void
}

const RENDER_INTERVAL = 0
const DRAW_DELAY = 20
const defaultPathOptions: PathObject = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const useDrawing = <T extends HTMLElement>({
  pathOptions,
  commandsConverter,
}: {
  pathOptions: PathObject
  commandsConverter?: CommandsConverter
}): UseDrawing<T> => {
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
  useEffect(() => {
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

  useEffect(() => {
    if (!drawElRef.current) return
    if (drawHandlerRef.current) return
    const { width, height } = drawElRef.current.getBoundingClientRect()
    svgRef.current.resize({ width, height })
    drawHandlerRef.current = new DrawHandler(drawElRef.current, {
      start: handleDrawStart,
      move: handleDrawMove,
      end: handleDrawEnd,
    })
    drawHandlerRef.current.on()
  })

  /**
   * Setup ResizeHandler
   */
  const resizeHandlerRef = useRef<ResizeHandler | null>(null)
  useEffect(() => {
    if (!drawElRef.current) return
    if (resizeHandlerRef.current) return
    resizeHandlerRef.current = new ResizeHandler(drawElRef.current, {
      resize: ({ width, height }) => {
        if (isAlmostSameNumber(svgRef.current.width, width)) return
        svgRef.current.resize({ width, height })
        shouldUpdateRef.current = true
      },
    })
    resizeHandlerRef.current.on()
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
      ref: svgRef,
      update,
      undo,
      clear,
      on,
      off,
    },
  ]
}

export const RenderSvg = ({
  background,
  paths,
  onSelectPath: handleSelectPath,
  editPathIndex,
  ...size
}: SvgObject & {
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
          <g key={i}>
            <EditPath {...pathAttr} />
          </g>
        )
      )}
    </svg>
  )
}

const EDIT_COLOR = '#09f';
const EDIT_PATH_CONFIG = {
  strokeWidth: 1,
  stroke: EDIT_COLOR,
  fill: 'none',
} as const

const EDIT_POINT_CONFIG = {
  r: 5,
  style: {
    fill: EDIT_COLOR
  }
} as const

export const EditPath = ({ d, ...attrs }: PathObject) => {
  const points: PointObject[] = useMemo(() => {
    if (!d) return []
    const path = new Path()
    path.parseCommandString(d)
    return path.commands.reduce(
      (re, com) => (com.point ? [...re, com.point.toJson()] : re),
      []
    )
  }, [d])
  return (
    <>
      <path d={d} {...attrs} />
      <path d={d} {...EDIT_PATH_CONFIG} />
      {points.map(({ x, y }, i) => (
        <circle key={i} cx={x} cy={y} {...EDIT_POINT_CONFIG} />
      ))}
    </>
  )
}