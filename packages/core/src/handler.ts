import {
  DrawHandlerOption,
  DrawListenerType,
  DrawEventHandler,
  ClearListener,
  PointObject,
  DrawEventName,
  ResizeHandlerOption,
} from './types'

export const getPassiveOptions = (
  passive = true
): boolean | { passive: boolean } => {
  try {
    const check = () => null
    addEventListener('testPassive', check, { passive })
    removeEventListener('testPassive', check)
    return { passive }
  } catch (e) {
    return false
  }
}

export class DrawHandler implements DrawEventHandler {
  /**
   *
   */
  protected _el: DrawHandlerOption['el']
  /**
   * Remove EventList
   */
  protected _clearEventList: Array<ClearListener>
  /**
   * addEventListener Options
   */
  protected _listenerOption: ReturnType<typeof getPassiveOptions>
  /**
   * Offset coordinates
   */
  protected _offset: {
    left: number
    top: number
  }
  /**
   * EventHandler
   */
  public end: DrawHandlerOption['end']
  public start: DrawHandlerOption['start']
  public move: DrawHandlerOption['move']
  constructor({ el, end, start, move }: DrawHandlerOption) {
    /**
     * Bind property from arguments.
     */
    this.end = end
    this.start = start
    this.move = move
    /**
     * Bind method
     */
    this.on = this.on.bind(this)
    this.off = this.off.bind(this)
    /**
     * Set offset coordinates
     */
    this._el = el
    const { left, top } = el ? el.getBoundingClientRect() : { left: 0, top: 0 }
    this._offset = { left, top }
    /**
     * Setup property.
     */
    this._clearEventList = []
    this._listenerOption = getPassiveOptions(false)
  }

  public get isActive(): boolean {
    return this._clearEventList.length > 0
  }
  /**
   * Exec removeEventListener
   */
  public off() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []
  }

  public on() {
    this.off()
    this._clearEventList = [
      ...this._setupCoordinatesListener(),
      ...this._setupListener(),
    ]
  }

  public setElement(el: Exclude<DrawHandlerOption['el'], undefined>) {
    this._el = el
    if (this.isActive) this.on()
  }

  public setHandler({
    start,
    move,
    end,
  }: Pick<DrawHandlerOption, 'start' | 'move' | 'end'>) {
    this.end = end
    this.start = start
    this.move = move
    if (this.isActive) this.on()
  }

  public getPointObjectFromDrawEvent(
    ev: MouseEvent | TouchEvent | PointerEvent
  ): PointObject {
    if (ev instanceof TouchEvent) {
      const touch = ev.touches[0]
      return {
        x: touch.clientX - this._offset.left,
        y: touch.clientY - this._offset.top,
        pressure: touch.force,
      }
    }
    if (ev instanceof PointerEvent) {
      return {
        x: ev.clientX - this._offset.left,
        y: ev.clientY - this._offset.top,
        pressure: ev.pressure,
      }
    }
    // if (ev instanceof MouseEvent) {
    return {
      x: ev.clientX - this._offset.left,
      y: ev.clientY - this._offset.top,
      pressure: (ev as any)?.pressure,
    }
    // }
  }
  protected _setupListener(): Array<ClearListener> {
    return []
  }

  /**
   * Set left, top property when scroll or resize event
   */
  private _setupCoordinatesListener(): Array<ClearListener> {
    const el = this._el
    if (!el) return []
    const setOffsetPosition = () => {
      const { left, top } = el.getBoundingClientRect()
      this._offset.left = left
      this._offset.top = top
    }
    setOffsetPosition()
    addEventListener('scroll', setOffsetPosition)
    el.addEventListener('resize', setOffsetPosition)
    return [
      () => {
        removeEventListener('scroll', setOffsetPosition)
        el.removeEventListener('resize', setOffsetPosition)
      },
    ]
  }
}

export class PencilHandler extends DrawHandler implements DrawHandler {
  constructor(option: DrawHandlerOption) {
    super(option)
    /**
     * Bind methods
     */
    this._handleStart = this._handleStart.bind(this)
    this._handleMove = this._handleMove.bind(this)
    this._handleEnd = this._handleEnd.bind(this)
  }

  protected _setupListener(): Array<ClearListener> {
    const clearEvent: Array<ClearListener> = []
    if (window.PointerEvent) {
      clearEvent.push(...this._setupDrawListener('pointer'))
    } else if ('ontouchstart' in window) {
      clearEvent.push(...this._setupDrawListener('touch'))
    } else {
      clearEvent.push(...this._setupDrawListener('mouse'))
    }

    return clearEvent
  }

  private _handleStart(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.start()
  }

  private _handleEnd(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.end()
  }

  private _handleMove(ev: MouseEvent | PointerEvent | TouchEvent) {
    ev.preventDefault()
    this.move(this.getPointObjectFromDrawEvent(ev))
  }

  private _setupDrawListener(type: DrawListenerType): Array<() => void> {
    const el = this._el
    if (!el) return []
    const eventMap: Record<
      DrawListenerType,
      {
        start: Array<DrawEventName>
        move: Array<DrawEventName>
        end: Array<DrawEventName>
        flameout: Array<DrawEventName>
      }
    > = {
      pointer: {
        start: ['pointerdown'],
        move: ['pointermove'],
        end: ['pointerleave', 'pointercancel'],
        flameout: ['pointerup'],
      },
      touch: {
        start: ['touchstart'],
        move: ['touchmove'],
        end: ['touchend'],
        flameout: ['touchcancel'],
      },
      mouse: {
        start: ['mousedown'],
        move: ['mousemove'],
        end: ['mouseleave', 'mouseout'],
        flameout: ['mouseup'],
      },
    }
    const { start, move, end, flameout } = eventMap[type]
    const startClear = start.map(
      (evname): ClearListener => {
        el.addEventListener(evname, this._handleStart, this._listenerOption)
        return () => el.removeEventListener(evname, this._handleStart)
      }
    )
    const moveClear = move.map(
      (evname): ClearListener => {
        el.addEventListener(evname, this._handleMove, this._listenerOption)
        return () => el.removeEventListener(evname, this._handleMove)
      }
    )
    const endClear = end.map(
      (evname): ClearListener => {
        el.addEventListener(evname, this._handleEnd, this._listenerOption)
        return () => el.removeEventListener(evname, this._handleEnd)
      }
    )
    const flameoutClear = flameout.map(
      (evname): ClearListener => {
        addEventListener(evname, this._handleEnd, this._listenerOption)
        return () => removeEventListener(evname, this._handleEnd)
      }
    )
    return [...startClear, ...moveClear, ...endClear, ...flameoutClear]
  }
}

export class PenHandler extends DrawHandler implements DrawHandler {
  private _editing: boolean
  constructor(option: DrawHandlerOption) {
    super(option)
    this._editing = false
    this._handleProt = this._handleProt.bind(this)
  }

  protected _setupListener(): Array<ClearListener> {
    const clearEvent: ClearListener[] = []
    if (window.PointerEvent) {
      clearEvent.push(...this._setupDrawListener('pointer'))
    } else if ('ontouchstart' in window) {
      clearEvent.push(...this._setupDrawListener('touch'))
    } else {
      clearEvent.push(...this._setupDrawListener('mouse'))
    }

    clearEvent.push(...this._setupCancelListener())
    return clearEvent
  }

  private _handleProt(ev: MouseEvent | PointerEvent | TouchEvent) {
    ev.preventDefault()
    const isFrameIn = this._isContainElement(ev)
    if (!this._editing && isFrameIn) {
      this.start()
      this.move(this.getPointObjectFromDrawEvent(ev))
      this._editing = true
      return
    }

    if (isFrameIn) {
      this.move(this.getPointObjectFromDrawEvent(ev))
      return
    }

    // end
    this._editing = false
    this.end()
  }

  private _isContainElement(
    ev: MouseEvent | PointerEvent | TouchEvent
  ): boolean {
    if (!this._el) return false
    return this._el.contains(ev.target as any)
  }

  private _setupCancelListener() {
    const stopId = setInterval(() => {
      if (!document.hasFocus()) {
        this._editing = false
        this.end()
      }
    }, 1000)
    return [() => clearInterval(stopId)]
  }
  private _setupDrawListener(type: DrawListenerType): Array<ClearListener> {
    const eventMap: Record<DrawListenerType, DrawEventName> = {
      touch: 'touchstart',
      pointer: 'pointerup',
      mouse: 'mouseup',
    }
    window.addEventListener(eventMap[type], this._handleProt)
    return [
      () => {
        window.removeEventListener(eventMap[type], this._handleProt)
      },
    ]
  }
}
export class ResizeHandler {
  /**
   * Remove EventList
   */
  private _clearEventList: Array<() => void>
  public resize: ResizeHandlerOption['resize']
  private _el?: ResizeHandlerOption['el']
  constructor({ el, resize }: ResizeHandlerOption) {
    this._el = el
    this.resize = resize
    this._clearEventList = []
  }

  public off() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []
  }

  public on() {
    this.off()
    this._setupListener()
  }

  public get isActive(): boolean {
    return this._clearEventList.length > 0
  }

  public setElement(el: HTMLElement) {
    this._el = el
    if (this.isActive) this.on()
    return this
  }

  private _setupListener(): void {
    if (!this._el) return
    if ((window as any).ResizeObserver) {
      const resizeObserver: any = new (window as any).ResizeObserver(
        ([entry]: any[]) => {
          this.resize(entry.contentRect)
        }
      )
      resizeObserver.observe(this._el)
      this._clearEventList.push(() => resizeObserver.disconnect())
    } else {
      const handleResizeEvent = () => {
        if (!this._el) return
        this.resize(this._el.getBoundingClientRect())
      }
      addEventListener('resize', handleResizeEvent)
      this._clearEventList.push(() =>
        removeEventListener('resize', handleResizeEvent)
      )
    }
  }
}
