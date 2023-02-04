export type PointObject = {
  x: number
  y: number
}

export interface PointClass {
  readonly x: number
  readonly y: number
  readonly values: [number, number]
  scale: (r: number) => PointClass
  scaleX: (r: number) => PointClass
  scaleY: (r: number) => PointClass
  add: (p: PointObject) => PointClass
  sub: (p: PointObject) => PointClass
  clone: () => PointClass
  toJson: () => PointObject
}

export type VectorObject = Readonly<{
  value: number
  angle: number
}>

export interface VectorClass {
  readonly value: number
  readonly angle: number
  scale: (r: number) => VectorClass
  rotate: (a: number) => VectorClass
  toJson: () => VectorObject
}

export type RelativeCommandType = 'm' | 'l' | 'c' | 'q' | 's'

export type AbsoluteCommandType = 'M' | 'L' | 'C' | 'Q' | 'S'

export type OtherCommandType = 'h' | 'v' | 'a' | 'H' | 'V' | 'A' | 'Z' | 'z'

export type CommandType =
  | RelativeCommandType
  | AbsoluteCommandType
  | OtherCommandType

/** @todo Implements for h,v,a,H,V,A */
type PointsLengthMap<T = CommandType> = T extends 'Z' | 'z'
  ? []
  : T extends 'm' | 'M' | 'l' | 'L'
  ? [PointClass]
  : T extends 'C' | 'c'
  ? [PointClass, PointClass, PointClass]
  : T extends 'Q' | 'q' | 'S' | 's'
  ? [PointClass, PointClass]
  : PointClass[]

/** @todo Implements for h,v,a,H,V,A */
type ValueLengthMap<T extends CommandType> = T extends 'Z' | 'z'
  ? []
  : T extends 'm' | 'M' | 'l' | 'L'
  ? [number, number]
  : T extends 'C' | 'c'
  ? [number, number, number, number, number, number]
  : T extends 'Q' | 'q' | 'S' | 's'
  ? [number, number, number, number]
  : number[]

export type CommandObject<T extends CommandType = CommandType> = {
  type: T
  values: ValueLengthMap<T>
}

export interface CommandClass<T extends CommandType = CommandType> {
  readonly type: T
  readonly values: ReadonlyArray<number>
  readonly point: T extends OtherCommandType ? undefined : PointClass
  points: PointsLengthMap<T>
  toString: () => string
  clone: () => CommandClass<T>
  scale: (r: number) => CommandClass<T>
  scaleX: (r: number) => CommandClass<T>
  scaleY: (r: number) => CommandClass<T>
  translate: (po: PointObject) => CommandClass<T>
}

export type PathAttributes = {
  d?: string
  fill?: string
  stroke?: string
  strokeWidth?: string
  strokeLinecap?: 'inherit' | 'butt' | 'round' | 'square'
  strokeLinejoin?: 'round' | 'inherit' | 'miter' | 'bevel'
  [camelCase: string]: string | undefined
}

/** Identification key. Use for update, delete. Return same key when ElementClass cloned. */
export type ElementKey = string

export type PathObject = {
  key: ElementKey
  type: 'path'
  attributes: PathAttributes
}

export interface PathClass {
  key: ElementKey
  readonly attrs: PathAttributes
  absoluteCommands: ReadonlyArray<CommandClass>
  relativeCommands: ReadonlyArray<CommandClass>
  scale: (r: number) => this
  scaleX: (r: number) => this
  scaleY: (r: number) => this
  setCommands: (
    commands: ReadonlyArray<CommandClass> | Readonly<CommandClass>
  ) => this
  updateCommand: (
    i: number,
    update: (absoluteCommand: CommandClass) => CommandClass
  ) => this
  addCommand: (params: Readonly<CommandClass>) => this
  deleteCommand: (i: number) => this
  translate: (p: PointObject) => this
  setAttributes: (attr: PathAttributes) => this
  updateAttributes: (attr: PathAttributes) => this
  clone: () => PathClass
  getCommandString: () => string
  toJson: () => PathObject
}

export type ElementObject = PathObject

export type ElementClass = PathClass

export type SvgObject = {
  width: number
  height: number
  background?: string
  elements: ElementObject[]
}

export type SvgOption = {
  width: number
  height: number
  background?: string
}

export interface SvgClass {
  /** Svg child element */
  elements: ReadonlyArray<ElementClass>
  width: number
  height: number
  background?: string
  /** Resize svg and path of children. */
  resize: (arg: { width: number; height: number }) => void
  /** Get element */
  getElement: (key: string) => ElementClass | undefined
  /** Update element. If it exists it will be updated, otherwise it will be newly added */
  updateElement: (element: ElementClass) => this
  /** Delete element */
  deleteElement: (element: ElementClass) => this
  /** Set elements */
  setElements: (elements: ReadonlyArray<ElementClass>) => this
  /** Return cloned paths. */
  cloneElements: () => ReadonlyArray<ElementClass>
  toJson: () => SvgObject
  /**
   * Copy resized paths.
   *
   * ```ts
   * class Svg implements SvgClass {}
   *
   * const drawSvg = new Svg()
   * const animateSvg = new Svg().copy(drawSvg)
   * ```
   */
  copy: (svg: SvgClass) => this
  /** Return cloned class object. */
  clone: () => SvgClass
}

export type EventPoint = {
  x: number
  y: number
  pressure?: number
}

export interface BezierCurveOption {
  ratio?: number
}

export interface RendererClass {
  update: (arg: {
    svg: SvgObject
    edit?: EditSvgObject
    animation?: AnimationObject
  }) => void
}

export type RendererOption = Pick<SvgOption, 'background'>

export type DrawingOption = RendererOption & {
  penColor?: string
  penWidth?: number
  curve?: boolean
  close?: boolean
  delay?: number
  fill?: string
}

export type DownloadOption = {
  extension: 'svg' | 'png' | 'jpg'
  filename?: string
}

export type ResizeCallback = (arg: { width: number; height: number }) => void

export interface ResizeEventHandler {
  active: boolean
  on: () => void
  off: () => void
  setElement: (el: HTMLElement) => void
  setHandler: (callback: ResizeCallback) => void
}

export type DrawListenerType = 'pointer' | 'touch' | 'mouse'

export type DrawEventName =
  | 'pointerdown'
  | 'pointermove'
  | 'pointerleave'
  | 'pointercancel'
  | 'pointerup'
  | 'touchstart'
  | 'touchmove'
  | 'touchend'
  | 'touchcancel'
  | 'mousedown'
  | 'mousemove'
  | 'mouseleave'
  | 'mouseout'
  | 'mouseup'

export type ClearListener = () => void

export interface DrawFactory {
  createElement: () => ElementClass
  updateElement: (
    element: ElementClass,
    points: ReadonlyArray<EventPoint>
  ) => ElementClass
}

export interface DrawingClass {
  start: () => void
  dot: (po: EventPoint) => void
  end: () => void
}

export interface DrawEventHandler {
  /** Returns true when draw event listener is active. */
  active: boolean
  on: () => void
  off: () => void
  setDrawing: (drawing: DrawingClass) => void
  setElement: (el: HTMLElement) => void
}

export type SelectPathIndex = {
  path: ElementKey
  command?: undefined
  point?: undefined
}

export type SelectCommandIndex = {
  path: ElementKey
  command: number
  point?: undefined
}

export type SelectPointIndex = {
  path: ElementKey
  command: number
  point: number
}

type SelectPathObject = {
  type: 'path'
  key: ElementKey
}

type SelectCommandObject = {
  type: 'command'
  key: ElementKey
  index: {
    command: number
  }
}

type SelectPointObject = {
  type: 'command'
  key: ElementKey
  index: {
    command: number
    point: number
  }
}

export type SelectObject =
  | SelectPathObject
  | SelectCommandObject
  | SelectPointObject

export type SelectIndex =
  | SelectPathIndex
  | SelectCommandIndex
  | SelectPointIndex

export type AnchorPoint = {
  points: {
    index: SelectPointIndex
    selected: boolean
    value: PointObject
  }[]
  d: string
}

export type BoundingBoxObject = {
  /** LeftTop vertex is same position. */
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  vertexes: Vertex[]
  selected: boolean
}

export type VertexType = 'LeftTop' | 'RightTop' | 'RightBottom' | 'LeftBottom'

export type Vertex = {
  type: VertexType
  point: PointObject
}

export type EditPathObject = {
  path: PathObject
  anchorPoints: AnchorPoint[]
}

export type EditElementObject = EditPathObject

export type EditSvgObject = {
  elements: EditElementObject[]
  boundingBox: BoundingBoxObject
}

/** Edit event */
export type EditEventObject =
  | {
      type: 'path'
      elementKey: ElementKey
    }
  | {
      type: 'path-anchor-point'
      elementKey: ElementKey
      commandIndex: number
      pointIndex: number
    }
  | {
      type: 'bounding-box'
    }
  | {
      type: 'bounding-box-vertex'
      vertexType: VertexType
    }
  | { type: 'frame' }

export type CreateCommand = (points: EventPoint[]) => CommandClass[]

export type AnimationOption = {
  ms: number
}

export interface FrameAnimation {
  loops: number
  animation: (origin: PathClass[], key: number) => PathClass[]
}

export type AnimateAttribute = {
  attributeName: string
  repeatCount: string
  dur: string
  keyTimes: string
  values: string
}

export type AnimateObject = {
  key: ElementKey
  animates: AnimateAttribute[]
}

export type AnimationObject = AnimateObject[]
