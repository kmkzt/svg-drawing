import type { RefObject, Dispatch, SetStateAction } from 'react'
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
  CreateCommand,
} from '@svg-drawing/core'

/**
 * useSvg
 */
export type UseSvg<T extends HTMLElement> = [RefObject<T>, SvgObject, SvgAction]

/**
 * useDraw
 */
export type UseDraw<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  DrawAction
]

/**
 * useEdit
 */
export type UseEdit<T extends HTMLElement> = [
  RefObject<T>,
  EditSvgProps,
  EditSvgAction
]

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
  commandsConverter?: CreateCommand
  drawHandler?: typeof DrawHandler
}

/**
 * useSvg Return type
 */
export type SvgAction = {
  svg: Svg
  resizeListener: ResizeHandler
  onUpdate: () => void
  onClear: () => void
}

export type UsePathOptionsMethods = {
  changeFill: (fill: string) => void
  changeStroke: (stroke: string) => void
  changeStrokeWidth: (strokeWidth: number) => void
  setPathOptions: Dispatch<SetStateAction<PathObject>>
}
export type UsePathOptions = [PathObject, UsePathOptionsMethods]

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

/**
 * UseDrawHandler
 */
export type UseDrawHandler = typeof DrawHandler | undefined

/**
 * UseCreateCommandOptions
 */
export type UseCommandsConverterOptions = {
  curve: boolean
  close: boolean
}
