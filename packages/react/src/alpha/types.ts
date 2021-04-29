import type { RefObject, HTMLAttributes } from 'react'
import type {
  PathObject,
  PointObject,
  SvgObject,
  Svg,
  DrawHandler,
  ResizeHandler,
  CommandsConverter,
} from '@svg-drawing/core'

/**
 * useSvg options
 */
export type SvgOptions = {
  sharedSvg?: Svg
}
/**
 * useSvg
 */
export type UseSvg<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseSvgProperty
]
/**
 * useSvg Return type
 */
export type UseSvgProperty = {
  svg: Svg
  resize: ResizeHandler
  update: () => void
}

/**
 * useDraw options
 */
export type DrawOptions = SvgOptions & {
  pathOptions: PathObject
  commandsConverter?: CommandsConverter
  drawHandler?: typeof DrawHandler
}

/**
 * useDraw return type
 */
export type UseDrawProperty = UseSvgProperty & {
  draw: DrawHandler
  on: () => void
  off: () => void
  update: () => void
  clear: () => void
  undo: () => void
}

/**
 * useDraw
 */
export type UseDraw<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseDrawProperty
]

export type EditOptions = SvgOptions
/**
 * useEdit
 */
export type UseEdit<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseEditProperty
]
export type SelectHandler = (editIndex: EditIndex) => void
export type MoveHandler = (move: PointObject) => void
export type EditHandler = (pathAttrs: PathObject) => void
export type CancelHandler = () => void
export type UseEditProperty = UseSvgProperty & {
  editing: EditIndex
  select: SelectHandler
  move: MoveHandler
  edit: EditHandler
  cancel: CancelHandler
}

export type EditIndex = {
  path?: number
  command?: number
  value?: number
}

export type SvgProps = SvgObject & HTMLAttributes<SVGSVGElement>

/**
 * EditSvg components
 */
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
