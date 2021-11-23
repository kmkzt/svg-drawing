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
  Path,
  Drawing,
} from '@svg-drawing/core'
import type { RefObject, HTMLAttributes } from 'react'

/** UseSvg */
export type UseSvg = (opts: Partial<SvgOption>) => Svg
export type SvgProps = HTMLAttributes<SVGSVGElement> & {
  background?: SvgObject['background']
  children: React.ReactNode
  onSelectSvg?: () => void
}

export type PathsProps = {
  paths: SvgObject['paths']
}

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
  draw: Drawing<Svg, P, H>
  update: () => void
  clear: Drawing<Svg, P, H>['clear']
  undo: Drawing<Svg, P, H>['undo']
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
  editProps: EditProps
}

export type EditProps = {
  editPaths: EditSvgObject['paths'] | null
  boundingBox: EditSvgObject['boundingBox'] | null
  onResizeBoundingBoxStart: SvgEditing['startResizeBoundingBox']
  onTranslateStart: SvgEditing['startTranslate']
  onSelectPaths: (sel: SelectIndex) => void
}

export type EditPathsProps = PathsProps & EditProps
export type EditBoundingBoxProps = EditSvgObject['boundingBox'] &
  Pick<EditProps, 'onResizeBoundingBoxStart' | 'onTranslateStart'>

/** UseAnimation */
export type UseAnimation = (arg: {
  onChangeAnimation: (obj: AnimationObject | null) => void
}) => {
  instance: Animation
  update: (paths: Path[]) => void
  clear: () => void
  setup: Animation['setup']
}

export type AnimatePathsProps = PathsProps & {
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
