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
export type SelectHandler = (selectIndex: SelectIndex) => void
export type MoveHandler = (move: PointObject) => void
export type ChangeAttributesHandler = (pathAttrs: PathObject) => void
export type DeleteHandler = () => void
export type CancelHandler = () => void
export type UseEditProperty = UseSvgProperty & {
  selecting: SelectIndex | null
  select: SelectHandler
  move: MoveHandler
  cancel: CancelHandler
  delete: DeleteHandler
  changeAttributes: ChangeAttributesHandler
}

export type SelectIndex = {
  path: number
  command?: number
  value?: number
}

/**
 * EditSvg components
 */
export type EditProps = {
  selecting: UseEditProperty['selecting']
  onSelect: UseEditProperty['select']
  onMove: UseEditProperty['move']
}
export type EditSvgProps = Omit<SvgProps, 'onSelect'> &
  Omit<EditProps, 'onEdit'>
export type SelectPathIndex = Omit<SelectIndex, 'path'>
export type SelectPathHandler = (editCommandIndex: SelectPathIndex) => void
export type EditPathProps = Pick<EditSvgProps, 'onMove'> & {
  selectingPath: SelectPathIndex | null
  onSelectPath: SelectPathHandler
}
