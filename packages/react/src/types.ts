import React, { RefObject } from 'react'
import type { SvgDrawing } from '@ranklab/svg-drawing-core/lib/drawing'
import type { DrawingOption } from '@ranklab/svg-drawing-core/lib/types'
import type { download } from '@ranklab/svg-drawing-core/lib/download'

export type UseSvgDrawing = {
  ref: RefObject<SvgDrawing | null>
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
}
