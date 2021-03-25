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
import type {
  DrawHandlerCallback,
  DrawingOption,
  PointObject,
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
  const drawHandlerRef = useRef<DrawHandler | null>(null)
  const resizeHandlerRef = useRef<ResizeHandler | null>(null)
  const drawPathRef = useRef<Path | null>(null)
  const drawPointsRef = useRef<PointObject[]>([])

  const svg = useMemo(() => new Svg({ width: 0, height: 0 }), [])
  const convert = useMemo(() => new Convert(), [])
  const [svgObj, setSvgObj] = useState(svg.toJson())
  const [paths, setPaths] = useState<SvgObject['paths'][]>([])

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

  const handleDrawStart = useCallback<DrawHandlerCallback['start']>(() => {
    // console.log('start')
    if (drawPathRef.current) return
    drawPathRef.current = createDrawPath()
    svg.addPath(drawPathRef.current)
  }, [svg, createDrawPath])

  const handleDrawMove = useCallback<DrawHandlerCallback['move']>((po) => {
    drawPointsRef.current = [...drawPointsRef.current, po]
    update()
  }, [])
  const handleDrawEnd = useCallback<DrawHandlerCallback['end']>(() => {
    // console.log('end')
    drawPathRef.current = null
  }, [])
  const handleThrottleDrawMove = useMemo(
    () => throttle(handleDrawMove, delay ?? 0),
    [delay]
  )
  const update = useCallback(() => {
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

    setSvgObj(svg.toJson())
  }, [curve, close, svg, convert])

  // useEffect(() => {
  //   if (!drawPathRef.current) return
  //   if (curve) {
  //     drawPathRef.current.commands = convert.bezierCurveCommands(
  //       drawPointsRef.current
  //     )
  //   } else {
  //     drawPathRef.current.commands = convert.lineCommands(drawPointsRef.current)
  //   }

  //   if (close) {
  //     drawPathRef.current.commands.push(new Command(COMMAND_TYPE.CLOSE))
  //   }

  //   setSvgObj(svg.toJson())
  // }, [curve, close, convert])

  useEffect(() => {
    if (!drawHandlerRef.current) return
    drawHandlerRef.current.start = handleDrawStart
  }, [handleDrawStart])
  useEffect(() => {
    if (!drawElRef.current) return
    if (!drawHandlerRef.current) {
      const { width, height } = drawElRef.current.getBoundingClientRect()
      svg.resize({ width, height })
      drawHandlerRef.current = new DrawHandler(drawElRef.current, {
        start: handleDrawStart,
        move: handleThrottleDrawMove,
        end: handleDrawEnd,
      })
      drawHandlerRef.current.on()
    }
    // return () => {
    //   if (drawHandlerRef.current) drawHandlerRef.current.off()
    // }
  })
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
