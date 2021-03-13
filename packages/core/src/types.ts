export type DrawHandlerCallback = {
  start: () => void
  end: () => void
  move: (x: number, y: number) => void
}

export type ResizeHandlerCallback = {
  resize: (
    rect: DOMRect | { width: number; height: number; left: number; top: number }
  ) => void
}

export type DrawType = 'pointer' | 'touch' | 'mouse'

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
  DrawType,
  {
    start: Array<DrawEventName>
    move: Array<DrawEventName>
    end: Array<DrawEventName>
    frameout: Array<DrawEventName>
  }
>
