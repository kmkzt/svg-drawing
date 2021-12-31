/** Svg Path JSON TODO: improve key types */
export type PathAttributes = {
  [camelCase: string]: string | undefined
}

export type PathObject = {
  key: string
  type: keyof SVGElementTagNameMap
  attributes: PathAttributes
}

export interface PathClass {
  key: string
  attrs: PathAttributes
  commands: CommandClass[]
  scale: (r: number) => this
  scaleX: (r: number) => this
  scaleY: (r: number) => this
  addCommand: (params: CommandClass | CommandClass[]) => this
  deleteCommand: (i: number) => this
  translate: (p: PointObject) => this
  setAttributes: (attr: PathAttributes) => this
  updateAttributes: (attr: PathAttributes) => this
  clone: () => PathClass
  getCommandString: () => string
  toJson: () => PathObject
}

/** Svg JSON */
export type SvgObject = {
  width: number
  height: number
  background?: string
  paths: PathObject[]
}

/** Point Object */
export type PointObject = Readonly<{
  x: number
  y: number
}>

export interface PointClass {
  readonly x: number
  readonly y: number
  degrees: number
  absoluteValue: number
  scale: (r: number) => PointClass
  scaleX: (r: number) => PointClass
  scaleY: (r: number) => PointClass
  add: (p: PointObject) => PointClass
  sub: (p: PointObject) => PointClass
  eql: (p: PointObject) => boolean
  clone: () => PointClass
  toJson: () => PointObject
}

/** @todo Be used `factory.createCommand` */
export interface DrawPoint extends PointObject {
  pressure?: number
}

/** Command Object */
export type RelativeCommandType = 'm' | 'l' | 'c' | 'q' | 's'

export type AbsoluteCommandType = Uppercase<RelativeCommandType>

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

export type CommandObject = {
  type: CommandType
  value: number[]
}
/** Svg options */
export type SvgOption = {
  width: number
  height: number
  background?: string
}
/** Convert options */
export interface ConvertOption {
  ratio?: number
}
/** Renderer options */
export type RendererOption = Pick<SvgOption, 'background'>

/** SvgDrawing options */
export type DrawingOption = RendererOption & {
  penColor?: string
  penWidth?: number
  curve?: boolean
  close?: boolean
  delay?: number
  fill?: string
}
/** Download options */
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

export type DrawEventName = Extract<
  keyof GlobalEventHandlersEventMap,
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
>

export type ClearListener = () => void

export interface DrawFactory {
  createPath: () => PathClass
  createCommand: CreateCommand
}

export type DrawStart = () => void
export type DrawEnd = () => void
export type DrawMove = (po: PointObject) => void
export interface DrawHandler {
  isActive: boolean
  on: () => void
  off: () => void
  setHandler: (handler: {
    drawStart: DrawStart
    drawMove: DrawMove
    drawEnd: DrawEnd
  }) => void
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

/** Control Point */
export type EditVertex = {
  points: {
    index: SelectPointIndex
    selected: boolean
    value: PointObject
  }[]
  d: string
}

/** BoundingBox */
export type BoundingBox = {
  min: PointObject
  max: PointObject
}

export type Selecting = Record<PathObject['key'], SelectingCommands>
export type SelectingCommands = Record<number, SelectingPoints>
export type SelectingPoints = Array<number>

export type EditPathObject = {
  key: PathObject['key']
  d: string
  vertex: EditVertex[]
  boundingBox: BoundingBox
}

export type EditSvgObject = {
  index: Selecting
  paths: Record<PathObject['key'], EditPathObject>
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
    vertex: Record<FixedType, PointObject>
    selected: boolean
  }
}

export type FixedType = 'LeftTop' | 'RightTop' | 'RightBottom' | 'LeftBottom'

export type ResizeBoundingBoxBase = {
  fixedType: FixedType
  point: PointObject
}

export type CreateCommand = (points: PointObject[]) => CommandClass[]

export type AnimationOption = {
  ms: number
}

export interface FrameAnimation {
  loops: number
  animation: (origin: PathClass[], key: number) => PathClass[]
}

export type AnimateAttribute = {
  [key in
    | 'attributeName'
    | 'repeatCount'
    | 'dur'
    | 'keyTimes'
    | 'values']: string
}

export type AnimateObject = {
  type: 'animate'
  attributes: AnimateAttribute
}

export type AnimationObject = Record<string, AnimateObject[]>
