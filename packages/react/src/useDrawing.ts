import React, { useRef, useEffect, useCallback, MutableRefObject } from 'react'
import type { DrawingOption } from '@ranklab/svg-drawing-core/lib/types'
import { svgObjectToElement } from '@ranklab/svg-drawing-core/lib/renderer'
import { SvgDrawing } from '@ranklab/svg-drawing-core/lib/drawing'
import { UseSvgDrawing } from './types'

export const useSvgDrawing = (
  option?: Partial<DrawingOption>
): [MutableRefObject<HTMLDivElement | null>, UseSvgDrawing] => {
  const renderRef = useRef<HTMLDivElement | null>(null)
  const drawingRef = useRef<SvgDrawing | null>(null)
  const getSvgXML = useCallback(() => {
    if (!drawingRef.current) return null
    return svgObjectToElement(drawingRef.current.svg.toJson()).outerHTML
  }, [])
  const download = useCallback<UseSvgDrawing['download']>((opt) => {
    if (!drawingRef.current) return
    drawingRef.current.download(opt)
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
    },
  ]
}
