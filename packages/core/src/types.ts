import type { Path, Point } from './svg'

/** Svg Path JSON TODO: improve key types */
export type PathAttributes = {
  [camelCase: string]: string | undefined
}

export type PathObject = {
  key: string
  type: keyof SVGElementTagNameMap
  attributes: PathAttributes
}

/** Svg JSON */
export type SvgObject = {
  width: number
  height: number
  background?: string
  paths: PathObject[]
}

/** Point Object */
export interface PointObject {
  x: number
  y: number
}

/** @todo Be used `factory.createCommand` */
export interface DrawPoint extends PointObject {
  pressure?: number
}

/** Command Object */
export type RelativeCommandType = 'm' | 'l' | 'c' | 'q' | 's'

export type AbsoluteCommandType = Uppercase<RelativeCommandType>

export type OtherCommandType = 'h' | 'v' | 'a' | 'H' | 'V' | 'A'

export type CloseCommandType = 'Z' | 'z'

export type CommandType =
  | RelativeCommandType
  | AbsoluteCommandType
  | CloseCommandType
  | OtherCommandType

export type Command<T extends CommandType = any> = {
  type: T
  values: number[]
  points: Point[]
  point: Point | undefined
  toString: () => string
  clone: () => Command<T>
  scale: (r: number) => Command<T>
  scaleX: (r: number) => Command<T>
  scaleY: (r: number) => Command<T>
  translate: (po: PointObject) => void
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
  createPath: () => Path
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

export type SelectIndex = {
  path: PathObject['key']
  command?: number
  point?: number
}

/** Control Point */
export type EditVertex = {
  points: {
    index: Required<SelectIndex>
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

export type CreateCommand = (points: PointObject[]) => Command[]

export type AnimationOption = {
  ms: number
}

export interface FrameAnimation {
  loops: number
  animation: (origin: Path[], key: number) => Path[]
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
