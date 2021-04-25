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

export type UseDraw<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseDrawMethods
]
export type UseDrawMethods = {
  svg: Svg
  draw: DrawHandler
  resize: ResizeHandler
  on: () => void
  off: () => void
  update: () => void
  clear: () => void
  undo: () => void
  editProps: EditProps
}
export type DrawOptions = {
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
export type MoveHandler = (move: PointObject) => void
export type EditHandler = (pathAttrs: PathObject) => void
export type CancelHandler = () => void
export type EditProps = {
  editing: EditIndex
  onSelect: SelectHandler
  onMove: MoveHandler
  onEdit: EditHandler
  onCancel: CancelHandler
}
export type EditSvgProps = SvgProps & Omit<EditProps, 'onEdit'>
export type EditPathIndex = Omit<EditIndex, 'path'>
export type SelectPathHandler = (editCommandIndex: EditPathIndex) => void
export type EditPathProps = Pick<EditSvgProps, 'onCancel' | 'onMove'> & {
  editingPath: EditPathIndex | null
  onSelectPath: SelectPathHandler
}
