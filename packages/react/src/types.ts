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
  AnimateAttribute,
  ElementKey,
  ElementClass,
} from '@svg-drawing/core'
import type { RefObject, HTMLAttributes } from 'react'

/** UseSvg */
export type UseSvg = (opts: Partial<SvgOption>) => SvgClass
export type SvgContextProps = {
  editProps?: EditSvgObject
  animationProps?: AnimationProps
}

export type SvgProps = HTMLAttributes<SVGSVGElement> &
  SvgContextProps & {
    width: number
    height: number
    elements: SvgObject['elements']
    background?: SvgObject['background']
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
  clear: () => ReadonlyArray<ElementClass>
  undo: () => ElementClass | undefined
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
  keyboardMap: KeyboardMap
  editProps: EditSvgObject | undefined
}

/** UseEditEventHandler */
export type UseEditEventHandler<E extends HTMLElement = HTMLElement> = (
  ref: RefObject<E>,
  edit: Editing,
  active: boolean,
  opts?: {
    multipleSelectBindKey?: string
  }
) => void

export type AnimationProps = {
  getAnimates: (elementKey: ElementKey) => AnimateAttribute[]
}

export type AnimatesProps = {
  elementKey?: ElementKey
}

/** UseAnimation */
export type UseAnimation = (arg: {
  animation: AnimateObject[]
  onChangeAnimation: (obj: AnimateObject[]) => void
}) => {
  instance: Animation
  update: (paths: ReadonlyArray<PathClass>) => void
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
