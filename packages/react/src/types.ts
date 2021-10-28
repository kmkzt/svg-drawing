import { AnimationObject, Animation } from '@svg-drawing/animation'
import type {
  SvgObject,
  Svg,
  EditSvgObject,
  DrawHandler,
  DrawFactory,
  ResizeCallback,
  DrawEventHandler,
  SvgEditing,
  SelectIndex,
  SvgOption,
  SvgDrawing,
  Path,
} from '@svg-drawing/core'
import type { RefObject, HTMLAttributes } from 'react'

/** UseSvg */
export type UseSvg = (opts: Partial<SvgOption>) => Svg
export type SvgProps = SvgObject & HTMLAttributes<SVGSVGElement>

/** UseDraw */
export type UseDraw<P extends DrawFactory, H extends DrawHandler> = (
  opts: UseDrawOptions<P, H>
) => DrawAction<P, H>

export type UseDrawOptions<P extends DrawFactory, H extends DrawHandler> = {
  factory: P
  handler: H
  svg: Svg
  onChangeSvg: (obj: SvgObject) => void
}
export type DrawAction<P extends DrawFactory, H extends DrawHandler> = {
  draw: SvgDrawing<Svg, P, H>
  update: () => void
  clear: SvgDrawing<Svg, P, H>['clear']
  undo: SvgDrawing<Svg, P, H>['undo']
}

/** UseEdit */
export type UseEdit = (opts: {
  svg: Svg
  editSvgObject: EditSvgObject | null
  multipleSelectBindKey?: string
  onChangeEdit: (arg: EditSvgObject | null) => void
  onChangeSvg: (obj: SvgObject) => void
}) => EditSvgAction

/** @todo Added return props for EditSvg */
export type EditSvgAction = {
  edit: SvgEditing
  keyboardMap: KeyboardMap
  update: () => void
  deletePaths: () => void
  translate: SvgEditing['translate']
  changeAttributes: SvgEditing['changeAttributes']
  selectPaths: (sel: SelectIndex) => void
  cancelSelect: () => void
  editSvgProps: EditProps
}

export type EditSvgProps = SvgProps & EditProps

export type EditProps = {
  editPaths: EditSvgObject['paths'] | null
  boundingBox: EditSvgObject['boundingBox'] | null
  onResizeBoundingBoxStart: SvgEditing['startResizeBoundingBox']
  onTranslateStart: SvgEditing['startTranslate']
  onSelectPaths: (sel: SelectIndex) => void
  onCancelSelect: () => void
}

/** UseAnimation */
export type UseAnimation = (arg: {
  onChangeAnimation: (obj: AnimationObject | null) => void
}) => {
  instance: Animation
  update: (paths: Path[]) => void
  clear: () => void
  setup: Animation['setup']
}

export type AnimateSvgProps = SvgObject & {
  animatePaths?: AnimationObject
}
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

export type KeyboardMap = {
  [key: string]: (() => void) | undefined
}

export type UseParseFile = (opts: { svg: Svg }) => (file: File) => Promise<void>
