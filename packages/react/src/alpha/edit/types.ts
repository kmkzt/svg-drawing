import type { RefObject } from 'react'
import type {
  PathObject,
  PointObject,
  SvgObject,
  Selecting,
  BoundingBox,
  SelectPaths,
} from '@svg-drawing/core'
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
export type SelectHandler = (selectIndex: Selecting) => void
export type MoveHandler = (move: PointObject) => void
export type ChangeAttributesHandler = (pathAttrs: PathObject) => void
export type DeleteHandler = () => void
export type CancelHandler = () => void
export type UseEditProperty = UseSvgProperty & {
  selecting: Selecting
  boundingBox: BoundingBox
  selectPaths: SelectPaths
  select: SelectHandler
  move: MoveHandler
  cancel: CancelHandler
  delete: DeleteHandler
  changeAttributes: ChangeAttributesHandler
}
/**
 * EditSvg components
 */
export type EditSvgProps = Omit<SvgProps, 'onSelect'> & {
  selecting: Selecting
  boundingBox: BoundingBox
  selectPaths: SelectPaths
  onSelect: UseEditProperty['select']
  onMove: UseEditProperty['move']
}