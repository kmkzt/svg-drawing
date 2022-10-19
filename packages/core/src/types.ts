export type PointObject = Readonly<{
  x: number
  y: number
}>

export interface PointClass {
  readonly x: number
  readonly y: number
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

type PointsLengthMap<T = CommandType> = T extends OtherCommandType
  ? PointClass[]
  : T extends 'm' | 'M' | 'l' | 'L'
  ? [PointClass]
  : T extends 'C' | 'c'
  ? [PointClass, PointClass, PointClass]
  : [PointClass, PointClass]

export type CommandObject = {
  type: CommandType
  value: number[]
}

export interface CommandClass<T = CommandType> {
  type: T
  values: number[]
  points: PointsLengthMap<T>
  point: T extends OtherCommandType ? undefined : PointClass
  toString: () => string
  clone: () => CommandClass<T>
  scale: (r: number) => CommandClass<T>
  scaleX: (r: number) => CommandClass<T>
  scaleY: (r: number) => CommandClass<T>
  translate: (po: PointObject) => CommandClass<T>
}

export type PathAttributes = {
  [camelCase: string]: string | undefined
}

export type PathObject = {
  key: string
  type: keyof SVGElementTagNameMap
  attributes: PathAttributes
}

export interface PathClass {
  /** Identification key. Use for update, delete. Return same key when PathClass cloned. */
  key: string
  attrs: PathAttributes
  absoluteCommands: CommandClass[]
  relativeCommands: CommandClass[]
  scale: (r: number) => this
  scaleX: (r: number) => this
  scaleY: (r: number) => this
  addCommand: (params: CommandClass | CommandClass[]) => this
  updateCommand: (
    i: number,
    update: (absoluteCommand: CommandClass) => CommandClass
  ) => this
  updateCommands: (commands: CommandClass[]) => this
  deleteCommand: (i: number) => this
  translate: (p: PointObject) => this
  setAttributes: (attr: PathAttributes) => this
  updateAttributes: (attr: PathAttributes) => this
  clone: () => PathClass
  getCommandString: () => string
  toJson: () => PathObject
}

export type SvgObject = {
  width: number
  height: number
  background?: string
  paths: PathObject[]
}

export type SvgOption = {
  width: number
  height: number
  background?: string
}

export interface SvgClass {
  /** Svg child element */
  paths: PathClass[]
  width: number
  height: number
  background?: string
  /** Resize svg and path of children. */
  resize: (arg: { width: number; height: number }) => void
  /** Add multiple paths. */
  addPath: (path: PathClass | PathClass[]) => this
  /** Get path */
  getPath: (key: string) => PathClass | undefined
  /** Update path */
  updatePath: (path: PathClass) => this
  /** Delete paths */
  deletePath: (path: PathClass) => this
  /** Return cloned paths. */
  clonePaths: () => PathClass[]
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
  createPath: () => PathClass
  createCommand: CreateCommand
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
  path: PathObject['key']
  command?: undefined
  point?: undefined
}

export type SelectCommandIndex = {
  path: PathObject['key']
  command: number
  point?: undefined
}

export type SelectPointIndex = {
  path: PathObject['key']
  command: number
  point: number
}

export type SelectIndex =
  | SelectPathIndex
  | SelectCommandIndex
  | SelectPointIndex

export type EditVertex = {
  points: {
    index: SelectPointIndex
    selected: boolean
    value: PointObject
  }[]
  d: string
}

export type BoundingBoxObject = {
  x: number
  y: number
  width: number
  height: number
  vertex: Record<FixedType, PointObject>
  selected: boolean
}

export type EditPathObject = {
  key: PathObject['key']
  d: string
  vertex: EditVertex[]
}

export type EditSvgObject = {
  paths: Record<PathObject['key'], EditPathObject>
  boundingBox: BoundingBoxObject
}

export type FixedType = 'LeftTop' | 'RightTop' | 'RightBottom' | 'LeftBottom'

export type ResizeBoundingBoxBase = {
  fixedType: FixedType
  point: PointObject
}

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
  type: 'animate'
  attributes: AnimateAttribute
}

export type AnimationObject = Record<string, AnimateObject[]>
