import type { RefObject } from 'react'
import type {
  SvgObject,
  Svg,
  PathObject,
  PointObject,
  Selecting,
  EditSvgObject,
  FixedPositionType,
  DrawHandler,
  DrawFactory,
  ResizeCallback,
  DrawEventHandler,
} from '@svg-drawing/core'

/** UseSvg */
export type UseSvg = (opts: UseSvgOptions) => [SvgObject, SvgAction]

/** UseEdit */
export type UseEdit = (opts: UseEditOptions) => [EditSvgProps, EditSvgAction]

/** UseDraw */
export type UseDraw = (opts: UseDrawOptions) => [SvgObject, DrawAction]

/** UseDrawEventHandler */
export type UseDrawEventHandler<
  T extends HTMLElement = HTMLElement,
  U extends DrawEventHandler = any
> = (ref: RefObject<T>, Handler: U, active?: boolean) => U

/** UseResize */
export type UseResize<T extends HTMLElement = HTMLElement> = (
  ref: RefObject<T>,
  onResize: ResizeCallback,
  active?: boolean
) => void

/** UseSvg options */
export type UseSvgOptions = {
  sharedSvg?: Svg
}

/** UseEdit options */
export type UseEditOptions = UseSvgOptions & {
  multipleSelectBindKey?: string
}

/** UseDraw options */
export type UseDrawOptions = UseSvgOptions & {
  factory: DrawFactory
  handler: DrawHandler
}

/** UseSvg Return type */
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

/** EditSvg components */
export type EditSvgProps = SvgObject & {
  edit: EditSvgObject
  onSelecting: SelectingHandler
  onMovePaths: MovePathsHandler
  onMovePathsPreview: MovePathsHandler
  onResizePaths: ResizePathsHandler
  onResizePathsPreview: ResizePathsHandler
}

/** UseDraw return type */
export type DrawAction = SvgAction & {
  onUndoDraw: () => void
  keyboardMap: KeyboardMap
}
