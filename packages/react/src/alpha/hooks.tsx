import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
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
import {
  DrawHandlerCallback,
  PathObject,
  PointObject,
} from '@svg-drawing/core/lib/types'
import { DrawingOptions, UseDrawing } from './types'

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
  }, [])

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
