import type { Command, Path } from './svg'

/** Svg Path JSON TODO: improve key types */
export type PathObject = {
  [camelCase: string]: string | undefined
}

/** Svg JSON */
export type SvgObject = {
  width: number
  height: number
  background?: string
  paths: PathObject[]
}

/** Point Object */
export type PointObject = {
  x: number
  y: number
  pressure?: number
}

/** Command Object */
export type CommandType =
  | 'M'
  | 'm'
  | 'L'
  | 'l'
  | 'C'
  | 'c'
  | 'Z'
  | 'H'
  | 'h'
  | 'V'
  | 'v'
  | 'A'
  | 'a'
  | 'Q'
  | 'q'
  | 'S'
  | 's'
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

export type ResizeCallback = (arg: {
  width: number
  height: number
  left: number
  top: number
}) => void

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
  setPathAttributes: (attrs: PathObject) => void
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

/** Control Point */
export type ControlPoint = {
  points: PointObject[]
  d: string
}

/** BoundingBox */
export type BoundingBox = {
  min: [number, number]
  max: [number, number]
}

export type Selecting = {
  [path: number]: SelectingCommands
}
export type SelectingCommands = { [command: number]: SelectingPoints }
export type SelectingPoints = Array<number>

export type EditPathObject = {
  d: string
  controlPoints: ControlPoint[]
  boundingBox: BoundingBox
}
export type EditSvgObject = {
  index: Selecting
  paths: {
    [pathIndex: number]: EditPathObject
  }
  boundingBox: BoundingBox
}

export type FixedPositionType =
  | 'LeftTop'
  | 'RightTop'
  | 'RightBottom'
  | 'LeftBottom'

export type CreateCommand = (points: PointObject[]) => Command[]
