import React, {
  useState,
  useRef,
  RefObject,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { Svg, Path, Command, COMMAND_TYPE } from '@svg-drawing/core/lib/svg'
import { DrawHandler, ResizeHandler } from '@svg-drawing/core/lib/handler'
import { Convert } from '@svg-drawing/core/lib/convert'
import { throttle } from '@svg-drawing/core/lib/throttle'
import { isAlmostSameNumber } from '@svg-drawing/core/lib/utils'
import type {
  DrawHandlerCallback,
  DrawingOption,
  PointObject,
  ResizeHandlerCallback,
  SvgObject,
  SvgOption,
} from '@svg-drawing/core/lib/types'

type UseDrawingUnstable<T extends HTMLElement = any> = [
  RefObject<T | null>,
  SvgObject | null,
  DrawingMethods
]

// eslint-disable-next-line @typescript-eslint/ban-types
type DrawingMethods = {}

const RENDER_INTERVAL = 0

export const useDrawingUnstable = <T extends HTMLElement>({
  penColor,
  penWidth,
  close,
  curve,
  delay,
  fill,
  background,
}: DrawingOption & Pick<SvgOption, 'background'>): UseDrawingUnstable<T> => {
  const drawElRef = useRef<T>(null)
  const svgRef = useRef(new Svg({ width: 0, height: 0 }))
  const drawPathRef = useRef<Path | null>(null)
  const drawPointsRef = useRef<PointObject[]>([])
  const convert = useMemo(() => new Convert(), [])

  const shouldUpdateRef = useRef<boolean>(false)
  const [svgObj, setSvgObj] = useState(svgRef.current.toJson())

  const createDrawPath = useCallback((): Path => {
    drawPointsRef.current = []
    return new Path({
      stroke: penColor,
      strokeWidth: String(penWidth),
      fill: fill,
      strokeLinecap: curve ? 'round' : 'mitter',
      strokeLinejoin: curve ? 'round' : 'square',
    })
  }, [penColor, penWidth, fill, curve])

  const updateSvg = useCallback(() => {
    if (!drawPathRef.current) return
    if (curve) {
      drawPathRef.current.commands = convert.bezierCurveCommands(
        drawPointsRef.current
      )
    } else {
      drawPathRef.current.commands = convert.lineCommands(drawPointsRef.current)
    }
    if (close) {
      drawPathRef.current.commands.push(new Command(COMMAND_TYPE.CLOSE))
    }

    shouldUpdateRef.current = true
  }, [curve, close, convert])
  const handleDrawStart = useCallback<DrawHandlerCallback['start']>(() => {
    if (drawPathRef.current) return
    drawPathRef.current = createDrawPath()
    svgRef.current.addPath(drawPathRef.current)
  }, [createDrawPath])

  const handleDrawMove = useMemo<DrawHandlerCallback['move']>(() => {
    const move: DrawHandlerCallback['move'] = (po) => {
      if (!drawPathRef.current) return
      drawPointsRef.current = [...drawPointsRef.current, po]
      updateSvg()
    }
    return throttle(move, delay ?? 0)
  }, [delay, updateSvg])

  const handleDrawEnd = useCallback<DrawHandlerCallback['end']>(() => {
    drawPathRef.current = null
  }, [])

  // FIX: Create path while drawing
  // useEffect(() => {
  //   if (!drawPathRef.current) return
  //   if (
  //     drawPathRef.current.attrs.strokeWidth &&
  //     +drawPathRef.current.attrs.strokeWidth === penWidth &&
  //     drawPathRef.current.attrs.stroke === penColor
  //   )
  //     return

  //   const po = drawPointsRef.current[drawPointsRef.current.length - 1]
  //   if (!po) return
  //   drawPathRef.current = createDrawPath()
  //   drawPointsRef.current = [po]
  //   svgRef.current.addPath(drawPathRef.current)
  //   updateSvg()
  // }, [updateSvg, penWidth, penColor, createDrawPath])

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
   * A variable called shouldUpdateRef manages whether to update to reduce the number of times setState is executed.
   */
  useEffect(() => {
    const stopId = setInterval(() => {
      if (!shouldUpdateRef.current) return
      shouldUpdateRef.current = false
      setSvgObj(svgRef.current.toJson())
    }, RENDER_INTERVAL)
    return () => clearInterval(stopId)
  }, [])

  return [drawElRef, svgObj, {}]
}

export const RenderSvg = ({ background, paths, ...size }: SvgObject) => (
  <svg {...size}>
    {background && <rect {...size} fill={background} />}
    {paths.map((pathAttr, i) => (
      <path key={i} {...pathAttr} />
    ))}
  </svg>
)
