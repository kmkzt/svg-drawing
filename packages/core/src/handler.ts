import type {
  DrawListenerType,
  DrawEventHandler,
  ClearListener,
  PointObject,
  DrawEventName,
} from './types'

const SUPPORT_POINTER_EVENT = typeof PointerEvent !== 'undefined'

const SUPPORT_ON_TOUCH_START = typeof ontouchstart !== 'undefined'

const SUPPORT_EVENT_LISTENER_PASSIVE_OPTION = (() => {
  try {
    const check = () => null
    addEventListener('testPassive', check, { passive: true })
    removeEventListener('testPassive', check)
    return true
  } catch (e) {
    return false
  }
})()

const getPassiveOptions = (passive = true): false | { passive: boolean } =>
  SUPPORT_EVENT_LISTENER_PASSIVE_OPTION ? { passive } : false

export class DrawHandler implements DrawEventHandler {
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
  public drawEnd: DrawEventHandler['drawEnd']
  public drawStart: DrawEventHandler['drawStart']
  public drawMove: DrawEventHandler['drawMove']
  constructor(protected el: HTMLElement | null) {
    /**
     * Bind method
     */
    this.on = this.on.bind(this)
    this.off = this.off.bind(this)

    /**
     * Set offset coordinates
     */
    const { left, top } = el ? el.getBoundingClientRect() : { left: 0, top: 0 }
    this._offset = { left, top }
    /**
     * Setup property.
     */
    this.drawStart = () => void 0
    this.drawMove = () => void 0
    this.drawEnd = () => void 0
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

  public setElement(el: HTMLElement) {
    this.el = el
    if (this.isActive) this.on()
  }

  public setHandler({
    drawStart,
    drawMove,
    drawEnd,
  }: Parameters<DrawEventHandler['setHandler']>[0]) {
    this.drawEnd = drawEnd
    this.drawStart = drawStart
    this.drawMove = drawMove
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

    return {
      x: ev.clientX - this._offset.left,
      y: ev.clientY - this._offset.top,
      pressure: (ev as any)?.pressure,
    }
  }
  protected _setupListener(): Array<ClearListener> {
    return []
  }

  /**
   * Set left, top property when scroll or resize event
   */
  private _setupCoordinatesListener(): Array<ClearListener> {
    const el = this.el
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

export class PencilHandler extends DrawHandler {
  constructor(...[el]: ConstructorParameters<typeof DrawHandler>) {
    super(el)
    /**
     * Bind methods
     */
    this._handleStart = this._handleStart.bind(this)
    this._handleMove = this._handleMove.bind(this)
    this._handleEnd = this._handleEnd.bind(this)
  }

  protected _setupListener(): Array<ClearListener> {
    if (SUPPORT_POINTER_EVENT) return this._setupDrawListener('pointer')

    if (SUPPORT_ON_TOUCH_START) return this._setupDrawListener('touch')

    return this._setupDrawListener('mouse')
  }

  private _handleStart(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.drawStart()
  }

  private _handleEnd(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.drawEnd()
  }

  private _handleMove(ev: MouseEvent | PointerEvent | TouchEvent) {
    ev.preventDefault()
    this.drawMove(this.getPointObjectFromDrawEvent(ev))
  }

  private _setupDrawListener(type: DrawListenerType): Array<() => void> {
    const el = this.el
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

export class PenHandler extends DrawHandler {
  private _editing: boolean
  constructor(...[el]: ConstructorParameters<typeof DrawHandler>) {
    super(el)
    this._editing = false
    this._handleProt = this._handleProt.bind(this)
  }

  protected _setupListener(): Array<ClearListener> {
    const clearEvent: ClearListener[] = [...this._setupCancelListener()]
    if (SUPPORT_POINTER_EVENT)
      return [...this._setupDrawListener('pointer'), ...clearEvent]

    if (SUPPORT_ON_TOUCH_START)
      return [...this._setupDrawListener('touch'), ...clearEvent]

    return [...this._setupDrawListener('mouse'), ...clearEvent]
  }

  private _handleProt(ev: MouseEvent | PointerEvent | TouchEvent) {
    ev.preventDefault()
    const isFrameIn = this._isContainElement(ev)
    if (!this._editing && isFrameIn) {
      this.drawStart()
      this.drawMove(this.getPointObjectFromDrawEvent(ev))
      this._editing = true
      return
    }

    if (isFrameIn) {
      this.drawMove(this.getPointObjectFromDrawEvent(ev))
      return
    }

    // end
    this._editing = false
    this.drawEnd()
  }

  private _isContainElement(
    ev: MouseEvent | PointerEvent | TouchEvent
  ): boolean {
    if (!this.el) return false
    return this.el.contains(ev.target as any)
  }

  private _setupCancelListener() {
    const stopId = setInterval(() => {
      if (!document.hasFocus()) {
        this._editing = false
        this.drawEnd()
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
    addEventListener(eventMap[type], this._handleProt)
    return [
      () => {
        removeEventListener(eventMap[type], this._handleProt)
      },
    ]
  }
}
