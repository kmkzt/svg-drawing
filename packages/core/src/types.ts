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
 * Renderer options
 */
export type RendererOption = Pick<SvgOption, 'background'>

/**
 * SvgDrawing options
 */
export type DrawingOption = RendererOption & {
  penColor?: string
  penWidth?: number
  close?: boolean
  curve?: boolean
  delay?: number
  fill?: string
}

/**
 * DrawHandler callback
 */
export type DrawHandlerCallback = {
  start: () => void
  end: () => void
  move: (po: PointObject) => void
}
/**
 * ResizeHandler callback
 */
export type ResizeHandlerCallback = {
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
export type ListenerMaps = Record<
  DrawListenerType,
  {
    start: Array<DrawEventName>
    move: Array<DrawEventName>
    end: Array<DrawEventName>
    frameout: Array<DrawEventName>
  }
>
