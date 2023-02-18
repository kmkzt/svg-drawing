import { getEventPoint } from './getEventPoint'
import { OffsetPositionHandler } from './offsetPositionHandler'
import { SUPPORT_ON_TOUCH_START, SUPPORT_POINTER_EVENT } from './support'
import type { DrawingClass } from '..'
import type {
  DrawListenerType,
  ClearListener,
  DrawEventName,
  EventPoint,
  EventHandler,
} from '../types'

export class PenHandler implements EventHandler<HTMLElement> {
  private _editing: boolean
  /** Remove EventList */
  private _clearEventList: Array<ClearListener>
  /** Offset coordinates */
  private _offsetPositionHandler: OffsetPositionHandler
  private el: HTMLElement | null = null
  constructor(private drawing: DrawingClass) {
    // Set offset coordinates
    this._offsetPositionHandler = new OffsetPositionHandler()
    this._clearEventList = []

    this._editing = false
    this._handleProt = this._handleProt.bind(this)
  }

  public cleanup() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []

    this._offsetPositionHandler.cleanup()
    this.el = null
  }

  public setup(el: HTMLElement) {
    this.cleanup()
    this.el = el

    this._offsetPositionHandler.setup(el)
    this._clearEventList = this.setupListener()
  }

  private setupListener(): Array<ClearListener> {
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

  private getPointObjectFromDrawEvent(
    ev: MouseEvent | TouchEvent | PointerEvent
  ): EventPoint {
    return getEventPoint(ev, this._offsetPositionHandler.position || undefined)
  }
}
