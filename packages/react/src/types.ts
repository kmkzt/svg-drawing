import type { RefObject } from 'react'
import type {
  ResizeEventHandler,
  SvgDrawing,
  DrawingOption,
  download,
} from '@svg-drawing/core'

export type SvgDrawingObject = ReturnType<typeof SvgDrawing['init']>

export type UseSvgDrawing = {
  ref: RefObject<SvgDrawingObject | null>
  clear: () => void
  undo: () => void
  changePenColor: (penColor: DrawingOption['penColor']) => void
  changePenWidth: (penwidth: DrawingOption['penWidth']) => void
  changeFill: (penColor: DrawingOption['fill']) => void
  changeClose: (penwidth: DrawingOption['close']) => void
  changeDelay: (penColor: DrawingOption['delay']) => void
  changeCurve: (penwidth: DrawingOption['curve']) => void
  getSvgXML: () => string | null
  download: (opt: Parameters<typeof download>[1]) => void
  resizeHandler: ResizeEventHandler
}
