import type {
  Animation,
  SvgObject,
  SvgClass,
  EditSvgObject,
  DrawFactory,
  ResizeCallback,
  DrawingClass,
  Editing,
  SelectIndex,
  SvgOption,
  PathClass,
  AnimationObject,
  VertexType,
} from '@svg-drawing/core'
import type { RefObject, HTMLAttributes } from 'react'

/** UseSvg */
export type UseSvg = (opts: Partial<SvgOption>) => SvgClass
export type SvgProps = HTMLAttributes<SVGSVGElement> & {
  width: number
  height: number
  background?: SvgObject['background']
  children?: React.ReactNode
  paths?: SvgObject['paths']
  editProps?: EditProps
}

export type PathsProps = {
  paths: SvgObject['paths']
}

/** UseDraw */
export type UseDraw = (opts: UseDrawOptions) => DrawAction

export type UseDrawOptions = {
  factory: DrawFactory
  svg: SvgClass
  onChangeSvg: (obj: SvgObject) => void
}
export type DrawAction = {
  draw: DrawingClass
  update: () => void
  clear: () => PathClass[]
  undo: () => PathClass | undefined
}

/** UseEdit */
export type UseEdit = (opts: {
  svg: SvgClass
  editSvgObject: EditSvgObject | null
  multipleSelectBindKey?: string
  onChangeEdit: (arg: EditSvgObject | null) => void
  onChangeSvg: (obj: SvgObject) => void
}) => EditSvgAction

export type EditSvgAction = {
  edit: Editing
  keyboardMap: KeyboardMap
  update: () => void
  deletePaths: () => void
  translate: Editing['translate']
  changeAttributes: Editing['changeAttributes']
  selectPaths: (sel: SelectIndex | SelectIndex[]) => void
  cancelSelect: () => void
  editProps: EditProps
}

export type EditProps = {
  editPaths: EditSvgObject['paths'] | null
  boundingBox: EditSvgObject['boundingBox'] | null
  selectedOnlyPaths: boolean
  onCancelSelect: () => void
  onResizeStart: (
    ev:
      | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>,
    type: VertexType
  ) => void
  onTranslateStart: (
    ev:
      | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
  ) => void
  onSelectPaths: (sel: SelectIndex | SelectIndex[]) => void
}

export type BoundingBoxProps = {
  boundingBox: EditSvgObject['boundingBox']
} & Pick<
  EditProps,
  'selectedOnlyPaths' | 'onSelectPaths' | 'onResizeStart' | 'onTranslateStart'
>

/** UseAnimation */
export type UseAnimation = (arg: {
  onChangeAnimation: (obj: AnimationObject | null) => void
}) => {
  instance: Animation
  update: (paths: PathClass[]) => void
  clear: () => void
  setup: Animation['setup']
}

export type AnimatePathsProps = PathsProps & {
  animatePaths?: AnimationObject
}
/** UseDrawEventHandler */
export type UseDrawEventHandler<E extends HTMLElement = HTMLElement> = (
  ref: RefObject<E>,
  drawing: DrawingClass,
  active?: boolean
) => void

/** UseResize */
export type UseResize<T extends HTMLElement = HTMLElement> = (
  ref: RefObject<T>,
  onResize: ResizeCallback,
  active?: boolean
) => void

export type KeyboardMap = {
  [key: string]: (() => void) | undefined
}

export type UseParseFile = (opts: {
  svg: SvgClass
}) => (file: File) => Promise<void>
