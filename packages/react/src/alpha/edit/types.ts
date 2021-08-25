import type { MutableRefObject, RefObject } from 'react'
import type {
  PathObject,
  PointObject,
  Selecting,
  BoundingBox,
  SelectPaths,
  FixedPositionType,
  SvgObject,
} from '@svg-drawing/core'
import type { UseSvgOptions, SvgAction } from '../svg/types'
import type { KeyboardMap } from '../keyboard'

export type UseEditOptions = UseSvgOptions & {
  multipleSelectBindKey?: string
}

/**
 * useEdit
 */
export type UseEdit<T extends HTMLElement> = [
  RefObject<T>,
  EditSvgProps,
  EditSvgAction
]
export type SelectingHandler = (selectIndex: Selecting) => void
export type MovePathsHandler = (move: PointObject) => void
export type ChangeAttributesHandler = (pathAttrs: PathObject) => void
export type DeletePathsHandler = () => void
export type CancelSelectingHandler = () => void
export type ResizePathsHandler = (
  type: FixedPositionType,
  move: PointObject
) => void
export type EditSvgAction = SvgAction & {
  keyboardMap: KeyboardMap
  onCancelSelecting: CancelSelectingHandler
  onDeletePaths: DeletePathsHandler
  onChangeAttributes: ChangeAttributesHandler
}

/**
 * EditSvg components
 */
export type EditSvgProps = SvgObject & {
  selecting: Selecting
  boundingBox: BoundingBox
  selectPaths: SelectPaths
  onSelecting: SelectingHandler
  onMovePaths: MovePathsHandler
  onMovePathsPreview: MovePathsHandler
  onResizePaths: ResizePathsHandler
  onResizePathsPreview: ResizePathsHandler
}
