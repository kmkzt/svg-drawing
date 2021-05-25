/**
 * Svg Path JSON
 * TODO: improve key types
 */
export type PathObject = {
  [camelCase: string]: string | undefined
}
/**
 * Svg JSON
 */
export type SvgObject = {
  width: number
  height: number
  background?: string
  paths: PathObject[]
}

/**
 * Path Object
 */
export type PointObject = {
  x: number
  y: number
  pressure?: number
}

/**
 * Command Object
 */
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
/**
 * Svg options
 */
export type SvgOption = {
  width: number
  height: number
  background?: string
}
/**
 * Convert options
 */
export interface ConvertOption {
  ratio?: number
}
/**
 * Renderer options
 */
export type RendererOption = Pick<SvgOption, 'background'>

/**
 * SvgDrawing options
 */
export type DrawingOption = RendererOption & {
  penColor?: string
  penWidth?: number
  curve?: boolean
  close?: boolean
  delay?: number
  fill?: string
}
/**
 * Download options
 */
export type DownloadOption = {
  extension: 'svg' | 'png' | 'jpg'
  filename?: string
}
/**
 * DrawHandler callback
 */
export type DrawHandlerOption = {
  el: HTMLElement | null
  start: () => void
  end: () => void
  move: (po: PointObject) => void
}
/**
 * ResizeHandler callback
 */
export type ResizeHandlerOption = {
  el?: HTMLElement
  resize: (
    rect: DOMRect | { width: number; height: number; left: number; top: number }
  ) => void
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

export interface DrawEventHandler extends Omit<DrawHandlerOption, 'el'> {
  isActive: boolean
  on: () => void
  off: () => void
}

/**
 * Control Point
 */
export type ControlPoint = {
  points: PointObject[]
  d: string
}

/**
 * BoundingBox
 */
export type BoundingBox = {
  width: number
  height: number
  x: number
  y: number
}

export type Selecting = {
  [path: number]: SelectingCommand
}
export type SelectingCommand = { [command: number]: SelectingPoint }
export type SelectingPoint = Array<number>
