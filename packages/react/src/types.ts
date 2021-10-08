import type {
  SvgObject,
  Svg,
  EditSvgObject,
  DrawHandler,
  DrawFactory,
  ResizeCallback,
  DrawEventHandler,
  SvgEditing,
  PointObject,
  SelectIndex,
  SvgOption,
  SvgDrawing,
} from '@svg-drawing/core'
import type { RefObject } from 'react'

/** UseSvg */
export type UseSvg = (opts: UseSvgOptions) => [SvgObject, SvgAction]

/** UseEdit */
export type UseEdit = (opts: UseEditOptions) => [EditSvgProps, EditSvgAction]

/** UseDraw */
export type UseDraw = (opts: UseDrawOptions) => [SvgObject, DrawAction]

/** UseDrawEventHandler */
export type UseDrawEventHandler<
  D extends DrawEventHandler = any,
  E extends HTMLElement = HTMLElement
> = (ref: RefObject<E>, Handler: new () => D, active?: boolean) => D

/** UseResize */
export type UseResize<T extends HTMLElement = HTMLElement> = (
  ref: RefObject<T>,
  onResize: ResizeCallback,
  active?: boolean
) => void

/** UseSvg options */
export type UseSvgOptions = {
  sharedSvg?: Svg
  defaultSvgOption?: Partial<SvgOption>
}

/**
 * UseEdit options
 *
 * @todo Active status.
 */
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

export type EditSvgAction = SvgAction & {
  keyboardMap: KeyboardMap
  onDeletePaths: () => void
  onTranslate: SvgEditing['translate']
  onChangeAttributes: SvgEditing['changeAttributes']
}

/** EditSvg components */
export type EditSvgProps = SvgObject & {
  editPaths: EditSvgObject['paths'] | null
  boundingBox: EditSvgObject['boundingBox'] | null
  onResizeBoundingBoxStart: SvgEditing['startResizeBoundingBox']
  onTranslateStart: SvgEditing['startTranslate']
  onSelectPaths: (sel: SelectIndex) => void
  onCancelSelect: () => void
}

/** UseDraw return type */
export type DrawAction = SvgAction & {
  onUndoDraw: SvgDrawing['undo']
}
