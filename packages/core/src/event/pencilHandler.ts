import { BaseDrawHandler } from './baseDrawHandler'
import {
  SUPPORT_EVENT_LISTENER_PASSIVE_OPTION,
  SUPPORT_ON_TOUCH_START,
  SUPPORT_POINTER_EVENT,
} from './support'
import { throttle } from '../throttle'
import type { DrawingClass } from '..'
import type { DrawListenerType, ClearListener, DrawEventName } from '../types'

export class PencilHandler extends BaseDrawHandler {
  private _drawMoveThrottle: DrawingClass['dot']
  private delay = 20
  /** AddEventListener Options */
  private listenerOption: { passive: boolean } | false
  constructor(drawing: DrawingClass, el?: HTMLElement) {
    super(drawing, el)

    // Bind methods
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

    if (this.active) this.setup()
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
