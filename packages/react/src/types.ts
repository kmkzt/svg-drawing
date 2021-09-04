import type { RefObject } from 'react'
import type { SvgDrawing } from '@svg-drawing/core/lib/drawing'
import type { DrawingOption } from '@svg-drawing/core/lib/types'
import type { download } from '@svg-drawing/core/lib/download'
import type {
  BasicPathFactory,
  Svg,
  ResizeEventHandler,
  PencilHandler,
} from 'packages/core/lib'

export type SvgDrawingObject = SvgDrawing<Svg, BasicPathFactory, PencilHandler>

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
