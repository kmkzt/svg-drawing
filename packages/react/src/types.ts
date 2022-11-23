import type {
  Animation,
  SvgObject,
  SvgClass,
  EditSvgObject,
  DrawFactory,
  ResizeCallback,
  DrawingClass,
  Editing,
  SvgOption,
  PathClass,
  AnimateObject,
  PathObject,
  AnimateAttribute,
} from '@svg-drawing/core'
import type { RefObject, HTMLAttributes } from 'react'

/** UseSvg */
export type UseSvg = (opts: Partial<SvgOption>) => SvgClass
export type SvgContextProps = {
  editProps?: EditProps
  animationProps?: AnimationProps
}

export type SvgProps = HTMLAttributes<SVGSVGElement> &
  SvgContextProps & {
    width: number
    height: number
    background?: SvgObject['background']
    children?: React.ReactNode
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
  onChangeEdit: (arg: EditSvgObject | null) => void
  onChangeSvg: (obj: SvgObject) => void
}) => EditSvgAction

export type EditSvgAction = {
  edit: Editing
  update: () => void
  keyboardMap: KeyboardMap
  editProps: EditProps
}

/** UseEditEventHandler */
export type UseEditEventHandler<E extends HTMLElement = HTMLElement> = (
  ref: RefObject<E>,
  edit: Editing,
  opts?: {
    multipleSelectBindKey?: string
  }
) => void

export type EditProps = {
  editPaths: EditSvgObject['paths'] | null
  boundingBox: EditSvgObject['boundingBox'] | null
  selectedOnlyPaths: boolean
}

export type BoundingBoxProps = {
  boundingBox: EditSvgObject['boundingBox']
  selectedOnlyPaths: boolean
}

export type AnimationProps = {
  getAnimates: (pathKey: PathObject['key']) => AnimateAttribute[]
}

export type AnimatesProps = {
  pathKey: PathObject['key']
}

/** UseAnimation */
export type UseAnimation = (arg: {
  animation: AnimateObject[]
  onChangeAnimation: (obj: AnimateObject[]) => void
}) => {
  instance: Animation
  update: (paths: PathClass[]) => void
  clear: () => void
  setup: Animation['setup']
  animationProps: AnimationProps
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
