import { BaseDrawHandler } from './baseDrawHandler'
import { SUPPORT_ON_TOUCH_START, SUPPORT_POINTER_EVENT } from '../event'
import type { DrawingClass } from '..'
import type { DrawListenerType, ClearListener, DrawEventName } from '../types'

export class PenHandler extends BaseDrawHandler {
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
