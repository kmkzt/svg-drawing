import {
  useRef,
  useEffect,
  useCallback,
  MutableRefObject,
  useMemo,
} from 'react'
import {
  SvgDrawing,
  ResizeHandler,
  svgObjectToElement,
} from '@svg-drawing/core/'
import { UseSvgDrawing, SvgDrawingObject } from './types'
import type { DrawingOption } from '@svg-drawing/core'

export const useSvgDrawing = (
  option?: Partial<DrawingOption>
): [MutableRefObject<HTMLDivElement | null>, UseSvgDrawing] => {
  const renderRef = useRef<HTMLDivElement | null>(null)
  const drawingRef = useRef<SvgDrawingObject | null>(null)

  const getSvgXML = useCallback(() => {
    if (!drawingRef.current) return null

    return svgObjectToElement(drawingRef.current.svg.toJson()).outerHTML
  }, [])

  const download = useCallback<UseSvgDrawing['download']>((opt) => {
    if (!drawingRef.current) return
    drawingRef.current.download(opt)
  }, [])

  const changePenColor = useCallback((penColor: DrawingOption['penColor']) => {
    if (!drawingRef.current || !penColor) return

    drawingRef.current.pathFactory.updatePathAttributes({
      stroke: penColor,
    })
  }, [])

  const changeFill = useCallback((fill: DrawingOption['fill']) => {
    if (!drawingRef.current || !fill) return

    drawingRef.current.pathFactory.updatePathAttributes({
      fill,
    })
  }, [])

  const changeDelay = useCallback((param: DrawingOption['delay']) => {
    if (!drawingRef.current || !param) return

    drawingRef.current.handler.changeDelay(param)
  }, [])

  const changePenWidth = useCallback((param: DrawingOption['penWidth']) => {
    if (!drawingRef.current) return

    drawingRef.current.pathFactory.updatePathAttributes({
      strokeWidth: String(param),
    })
  }, [])

  const changeClose = useCallback((param: DrawingOption['close']) => {
    if (!drawingRef.current) return

    drawingRef.current.pathFactory.changeClose(param ?? false)
  }, [])

  const changeCurve = useCallback((param: DrawingOption['curve']) => {
    if (!drawingRef.current) return

    drawingRef.current.pathFactory.changeCurve(param ?? true)
  }, [])

  const clear = useCallback(() => {
    if (!drawingRef.current) return

    drawingRef.current.clear()
  }, [])

  const undo = useCallback(() => {
    if (!drawingRef.current) return

    drawingRef.current.undo()
  }, [])

  const resizeHandler = useMemo(() => new ResizeHandler(renderRef.current), [])

  useEffect(() => {
    if (drawingRef.current) return
    if (!renderRef.current) return

    drawingRef.current = SvgDrawing.init(renderRef.current, {
      ...option,
    })

    resizeHandler.setElement(renderRef.current)
    resizeHandler.setHandler(drawingRef.current.resize)
    resizeHandler.on()
  })

  return [
    renderRef,
    {
      ref: drawingRef,
      changePenWidth,
      changePenColor,
      changeFill,
      changeDelay,
      changeClose,
      changeCurve,
      clear,
      undo,
      getSvgXML,
      download,
      resizeHandler,
    },
  ]
}
