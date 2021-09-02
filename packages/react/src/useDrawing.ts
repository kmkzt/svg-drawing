import React, { useRef, useEffect, useCallback, MutableRefObject } from 'react'
import type { DrawingOption } from '@svg-drawing/core/lib/types'
import { svgObjectToElement } from '@svg-drawing/core/lib/renderer'
import { SvgDrawing } from '@svg-drawing/core/lib/drawing'
import { UseSvgDrawing } from './types'
import {
  BasicPathFactory,
  Svg,
  Renderer,
  ResizeEventHandler,
  DrawEventHandler,
} from 'packages/core/lib'

export const useSvgDrawing = (
  option?: Partial<DrawingOption>
): [MutableRefObject<HTMLDivElement | null>, UseSvgDrawing] => {
  const renderRef = useRef<HTMLDivElement | null>(null)
  const drawingRef = useRef<SvgDrawing<
    Svg,
    BasicPathFactory,
    Renderer,
    DrawEventHandler,
    ResizeEventHandler
  > | null>(null)
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
    drawingRef.current.pathFactory.updateAttributes({
      stroke: penColor,
    })
  }, [])

  const changeFill = useCallback((fill: DrawingOption['fill']) => {
    if (!drawingRef.current || !fill) return
    drawingRef.current.pathFactory.updateAttributes({
      fill,
    })
  }, [])

  const changeDelay = useCallback((param: DrawingOption['delay']) => {
    if (!drawingRef.current || !param) return
    drawingRef.current.changeDelay(param)
  }, [])

  const changePenWidth = useCallback((param: DrawingOption['penWidth']) => {
    if (!drawingRef.current) return
    drawingRef.current.pathFactory.updateAttributes({
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

  useEffect(() => {
    if (drawingRef.current) return
    if (!renderRef.current) return
    drawingRef.current = SvgDrawing.init(renderRef.current, {
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
