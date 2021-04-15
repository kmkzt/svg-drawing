import type { RefObject, MutableRefObject, HTMLAttributes } from 'react'
import type {
  PathObject,
  PointObject,
  SvgObject,
  Svg,
  DrawHandler,
  ResizeHandler,
  CommandsConverter,
} from '@svg-drawing/core'

export type UseDrawing<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseDrawingMethods
]
// eslint-disable-next-line @typescript-eslint/ban-types
export type UseDrawingMethods = {
  svg: MutableRefObject<Svg>
  drawHandler: MutableRefObject<DrawHandler | null>
  resizeHandler: MutableRefObject<ResizeHandler | null>
  on: () => void
  off: () => void
  update: () => void
  clear: () => void
  undo: () => void
  setDrawHandler: (handler: typeof DrawHandler) => void
  editProps: EditProps
}
export type DrawingOptions = {
  pathOptions: PathObject
  commandsConverter?: CommandsConverter
  drawHandler?: typeof DrawHandler
}
export type EditIndex = {
  path?: number
  command?: number
  value?: number
}

export type SvgProps = SvgObject & HTMLAttributes<SVGSVGElement>

export type SelectHandler = (editIndex: EditIndex) => void
export type UpdateHandler = (po: PointObject) => void
export type CancelHandler = () => void
export type EditProps = {
  editing: EditIndex
  onSelect: SelectHandler
  onUpdate: UpdateHandler
  onCancel: CancelHandler
}
export type EditSvgProps = SvgProps & EditProps
export type EditPathIndex = Omit<EditIndex, 'path'>
export type SelectPathHandler = (editCommandIndex: EditPathIndex) => void
export type EditPathProps = Pick<EditSvgProps, 'onCancel' | 'onUpdate'> & {
  editingPath: EditPathIndex | null
  onSelectPath: SelectPathHandler
}
