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
export type UseDraw<T extends HTMLElement = HTMLElement> = (
  ref: RefObject<T>,
  opts: UseDrawOptions
) => [SvgObject, DrawAction]

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
  active?: boolean
  pathOptions: PathObject
  pathFactory: PathFactory
  drawHandler?: typeof DrawHandler
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

/**
 * DrawHandlerMap
 */
export type DrawHandlerMap<T extends string> = {
  [key in T]: typeof DrawHandler
}
