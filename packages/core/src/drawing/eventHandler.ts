import {
  getEventPoint,
  SUPPORT_EVENT_LISTENER_PASSIVE_OPTION,
  SUPPORT_ON_TOUCH_START,
  SUPPORT_POINTER_EVENT,
} from '../event'
import { throttle } from '../throttle'
import type { DrawingClass } from '..'
import type {
  DrawListenerType,
  DrawEventHandler,
  ClearListener,
  EventPoint,
  DrawEventName,
} from '../types'

class OffsetPosition {
  left: number
  top: number
  constructor(private el?: HTMLElement) {
    const { left, top } = el ? el.getBoundingClientRect() : { left: 0, top: 0 }

    this.left = left
    this.top = top
  }

  setElement(el: HTMLElement) {
    this.el = el
  }

  setup(): Array<ClearListener> {
    const el = this.el
    if (!el) return []

    const setOffsetPosition = () => {
      const { left, top } = el.getBoundingClientRect()
      this.left = left
      this.top = top
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

export abstract class BaseHandler implements DrawEventHandler {
  /** Remove EventList */
  private _clearEventList: Array<ClearListener>
  /** Offset coordinates */
  private _offsetPosition: OffsetPosition

  constructor(
    protected drawing: DrawingClass,
    protected el?: HTMLElement | undefined
  ) {
    // Bind method
    this.on = this.on.bind(this)
    this.off = this.off.bind(this)
    this.setDrawing = this.setDrawing.bind(this)

    // Set offset coordinates
    this._offsetPosition = new OffsetPosition(el)
    this._clearEventList = []
  }

  public get active(): boolean {
    return this._clearEventList.length > 0
  }

  public off() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []
  }

  public on() {
    this.off()

    this._clearEventList = [
      ...this._offsetPosition.setup(),
      ...this.setupListener(),
    ]
  }

  public setElement(el: HTMLElement) {
    this.el = el
    this._offsetPosition.setElement(el)

    if (this.active) this.on()
  }

  public setDrawing(drawing: DrawingClass) {
    this.drawing = drawing
    if (this.active) this.on()
  }

  public getPointObjectFromDrawEvent(
    ev: MouseEvent | TouchEvent | PointerEvent
  ): EventPoint {
    const { x, y, pressure } = getEventPoint(ev)

    return {
      x: x - this._offsetPosition.left,
      y: y - this._offsetPosition.top,
      pressure,
    }
  }

  protected abstract setupListener(): Array<ClearListener>
}

export class PencilHandler extends BaseHandler {
  private _drawMoveThrottle: DrawingClass['dot']
  private delay = 20
  /** AddEventListener Options */
  private listenerOption: { passive: boolean } | false
  constructor(drawing: DrawingClass, el?: HTMLElement) {
    super(drawing, el)

    // Bind methods
    this.setDrawing = this.setDrawing.bind(this)
    this._handleStart = this._handleStart.bind(this)
    this._handleMove = this._handleMove.bind(this)
    this._handleEnd = this._handleEnd.bind(this)
    this._drawMoveThrottle = throttle(this.drawing.dot, this.delay).bind(this)

    this.listenerOption = SUPPORT_EVENT_LISTENER_PASSIVE_OPTION
      ? { passive: false }
      : false
  }

  public changeDelay(delay: number): void {
    this.delay = delay
    this._drawMoveThrottle = throttle(this.drawing.dot, this.delay)

    if (this.active) this.on()
  }

  public setDrawing(drawing: DrawingClass) {
    this.drawing = drawing
    this._drawMoveThrottle = throttle(this.drawing.dot, this.delay)

    if (this.active) this.on()
  }

  protected setupListener(): Array<ClearListener> {
    if (SUPPORT_POINTER_EVENT) return this._setupDrawListener('pointer')

    if (SUPPORT_ON_TOUCH_START) return this._setupDrawListener('touch')

    return this._setupDrawListener('mouse')
  }

  private _handleStart(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.drawing.start()
  }

  private _handleEnd(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.drawing.end()
  }

  private _handleMove(ev: MouseEvent | PointerEvent | TouchEvent) {
    ev.preventDefault()
    this._drawMoveThrottle(this.getPointObjectFromDrawEvent(ev))
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

    const startClear = start.map((evname): ClearListener => {
      el.addEventListener(evname, this._handleStart, this.listenerOption)
      return () => el.removeEventListener(evname, this._handleStart)
    })

    const moveClear = move.map((evname): ClearListener => {
      el.addEventListener(evname, this._handleMove, this.listenerOption)
      return () => el.removeEventListener(evname, this._handleMove)
    })

    const endClear = end.map((evname): ClearListener => {
      el.addEventListener(evname, this._handleEnd, this.listenerOption)
      return () => el.removeEventListener(evname, this._handleEnd)
    })

    const flameoutClear = flameout.map((evname): ClearListener => {
      addEventListener(evname, this._handleEnd, this.listenerOption)
      return () => removeEventListener(evname, this._handleEnd)
    })

    return [...startClear, ...moveClear, ...endClear, ...flameoutClear]
  }
}

export class PenHandler extends BaseHandler {
  private _editing: boolean
  constructor(drawing: DrawingClass, el?: HTMLElement) {
    super(drawing, el)
    this._editing = false
    this._handleProt = this._handleProt.bind(this)
  }

  protected setupListener(): Array<ClearListener> {
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
      this.drawing.start()
      this.drawing.dot(this.getPointObjectFromDrawEvent(ev))
      this._editing = true
      return
    }

    if (isFrameIn) {
      this.drawing.dot(this.getPointObjectFromDrawEvent(ev))
      return
    }

    // end
    this._editing = false
    this.drawing.end()
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
        this.drawing.end()
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
