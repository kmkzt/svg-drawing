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
  ['stroke-width']?: string
  ['stroke-linecap']?: 'inherit' | 'butt' | 'round' | 'square'
  ['stroke-linejoin']?: 'round' | 'inherit' | 'miter' | 'bevel'
  [pathAttributeKey: string]: string | undefined
}

/**
 * Identification key. Use for update, delete. Return same key when ElementClass
 * cloned.
 */
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
  /** Set element. */
  setElement: (element: ElementClass) => this
  /** Delete element */
  deleteElement: (element: ElementClass) => this
  /** Replace elements */
  replaceElements: (elements: ReadonlyArray<ElementClass>) => this
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

export type RenderParams = {
  svg: SvgObject
  edit?: EditSvgObject
  animation?: AnimationObject
}

export interface RendererClass {
  render: (arg: RenderParams) => void
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
  createElement: (arg?: {
    elementKey: ElementKey
    eventPoints: ReadonlyArray<EventPoint>
  }) => ElementClass
}

export interface DrawingClass {
  start: () => void
  dot: (po: EventPoint) => void
  end: () => void
}

export interface EventHandler<C = undefined> {
  setup: (ctx: C) => void
  cleanup: () => void
}

export type AnchorPoint = {
  index: {
    command: number
    point: number
  }
  selected: boolean
  value: PointObject
}

export type EditCommandObject = {
  index: number
  value: PointObject
  selected: boolean
  anchorPoints: AnchorPoint[]
  outline: string | undefined
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
  commands: EditCommandObject[]
} & PathObject

export type EditElementObject = EditPathObject

export type EditSvgObject = {
  elements: EditElementObject[]
  boundingBox: BoundingBoxObject
}

/** Edit event */
export type SelectEventObject =
  | {
      type: 'path'
      key: ElementKey
      multiple?: boolean
    }
  | {
      type: 'path/anchorPoint'
      key: ElementKey
      index: {
        command: number
        point: number
      }
      multiple?: boolean
    }
  | {
      type: 'path/command'
      key: ElementKey
      index: {
        command: number
      }
      multiple?: boolean
    }
  | { type: 'bounding-box' }
  | {
      type: 'bounding-box/vertex'
      vertexType: VertexType
    }
  | { type: 'frame' }

export type SelectEventType = SelectEventObject['type']

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
