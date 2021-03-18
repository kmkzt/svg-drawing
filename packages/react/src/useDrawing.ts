import React, {
  useRef,
  useEffect,
  useCallback,
  MutableRefObject,
  RefObject,
} from 'react'
import type { DrawingOption } from '@svg-drawing/core/lib/types'
import {
  SvgDrawing,
  download as svgDownload,
  svgObjectToElement,
} from '@svg-drawing/core'

interface UseSvgDrawing {
  instance: RefObject<SvgDrawing | null>
  clear: () => void
  undo: () => void
  changePenColor: (penColor: DrawingOption['penColor']) => void
  changePenWidth: (penwidth: DrawingOption['penWidth']) => void
  changeFill: (penColor: DrawingOption['fill']) => void
  changeClose: (penwidth: DrawingOption['close']) => void
  changeDelay: (penColor: DrawingOption['delay']) => void
  changeCurve: (penwidth: DrawingOption['curve']) => void
  getSvgXML: () => string | null
  download: (ext: 'svg' | 'png' | 'jpg') => void
}
export const useSvgDrawing = (
  option?: Partial<DrawingOption>
): [MutableRefObject<HTMLDivElement | null>, UseSvgDrawing] => {
  const renderRef = useRef<HTMLDivElement | null>(null)
  const drawingRef = useRef<SvgDrawing | null>(null)
  const getSvgXML = useCallback(() => {
    if (!drawingRef.current) return null
    return svgObjectToElement(drawingRef.current.svg.toJson()).outerHTML
  }, [])
  const download = useCallback((opt: Parameters<typeof svgDownload>[1]) => {
    if (!drawingRef.current) return
    svgDownload(drawingRef.current.svg, opt)
  }, [])
  const changePenColor = useCallback((param: DrawingOption['penColor']) => {
    if (!drawingRef.current || !param) return
    drawingRef.current.penColor = param
  }, [])
  const changeFill = useCallback((param: DrawingOption['fill']) => {
    if (!drawingRef.current || !param) return
    drawingRef.current.fill = param
  }, [])
  const changeDelay = useCallback((param: DrawingOption['delay']) => {
    if (!drawingRef.current || !param) return
    drawingRef.current.changeDelay(param)
  }, [])
  const changePenWidth = useCallback((param: DrawingOption['penWidth']) => {
    if (!drawingRef.current) return
    drawingRef.current.penWidth = Number(param)
  }, [])
  const changeClose = useCallback((param: DrawingOption['close']) => {
    if (!drawingRef.current) return
    drawingRef.current.close = param ?? false
  }, [])
  const changeCurve = useCallback((param: DrawingOption['curve']) => {
    if (!drawingRef.current) return
    drawingRef.current.curve = param ?? true
  }, [])
  const clear = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.clear()
  }, [])
  const undo = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.undo()
  }, [])
  useEffect(() => {
    if (drawingRef.current) return
    if (!renderRef.current) return
    drawingRef.current = new SvgDrawing(renderRef.current, {
      ...option,
    })
  })

  return [
    renderRef,
    {
      instance: drawingRef,
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
    },
  ]
}
