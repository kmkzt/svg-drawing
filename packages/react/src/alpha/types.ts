import type { RefObject } from 'react'
import type {
  SvgObject,
  Svg,
  ResizeHandler,
  PathObject,
  PointObject,
  Selecting,
  EditSvgObject,
  FixedPositionType,
  DrawHandler,
  PathFactory,
  ResizeCallback,
  DrawEventHandler,
} from '@svg-drawing/core'

/**
 * useSvg
 */
export type UseSvg = (opts: UseSvgOptions) => [SvgObject, SvgAction]

/**
 * useEdit
 */
export type UseEdit = (opts: UseEditOptions) => [EditSvgProps, EditSvgAction]

/**
 * useDraw
 */
export type UseDraw = (opts: UseDrawOptions) => [SvgObject, DrawAction]

/**
 * useDrawHandler
 */
export type UseDrawHandler<
  T extends HTMLElement = HTMLElement,
  U extends DrawHandler = any
> = (ref: RefObject<T>, Handler: U, active: boolean) => U

/**
 * useResize
 */
export type UseResize<T extends HTMLElement = HTMLElement> = (
  ref: RefObject<T>,
  onResize: ResizeCallback
) => ResizeHandler

/**
 * useSvg options
 */
export type UseSvgOptions = {
  sharedSvg?: Svg
}

/**
 * useEdit options
 */
export type UseEditOptions = UseSvgOptions & {
  multipleSelectBindKey?: string
}

/**
 * useDraw options
 */
export type UseDrawOptions = UseSvgOptions & {
  pathFactory: PathFactory
  drawHandler: DrawEventHandler
}

/**
 * useSvg Return type
 */
export type SvgAction = {
  svg: Svg
  onUpdate: () => void
  onClear: () => void
  onResize: ResizeCallback
}

export type KeyboardMap = {
  [key: string]: (() => void) | undefined
}

export type UseParseFile = (opts: { svg: Svg }) => (file: File) => Promise<void>

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
  edit: EditSvgObject
  onSelecting: SelectingHandler
  onMovePaths: MovePathsHandler
  onMovePathsPreview: MovePathsHandler
  onResizePaths: ResizePathsHandler
  onResizePathsPreview: ResizePathsHandler
}

/**
 * useDraw return type
 */
export type DrawAction = SvgAction & {
  onUndoDraw: () => void
  keyboardMap: KeyboardMap
}
