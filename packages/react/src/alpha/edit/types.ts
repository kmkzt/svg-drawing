import type { RefObject } from 'react'
import type { PathObject, PointObject, SvgObject } from '@svg-drawing/core'
import { UseSvgOptions, UseSvgProperty, SvgProps } from '../svg/types'

export type UseEditOptions = UseSvgOptions
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
  editing: EditIndex | null
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

/**
 * EditSvg components
 */
export type EditProps = {
  editing: UseEditProperty['editing']
  onSelect: UseEditProperty['select']
  onMove: UseEditProperty['move']
  onEdit: UseEditProperty['edit']
  onCancel: UseEditProperty['cancel']
}
export type EditSvgProps = Omit<SvgProps, 'onSelect'> &
  Omit<EditProps, 'onEdit'>
export type EditPathIndex = Omit<EditIndex, 'path'>
export type SelectPathHandler = (editCommandIndex: EditPathIndex) => void
export type EditPathProps = Pick<EditSvgProps, 'onCancel' | 'onMove'> & {
  editingPath: EditPathIndex | null
  onSelectPath: SelectPathHandler
}
