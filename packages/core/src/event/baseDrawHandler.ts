import { getEventPoint } from './getEventPoint'
import { OffsetPosition } from './offsetPosition'
import type { DrawingClass } from '..'
import type { DrawEventHandler, ClearListener, EventPoint } from '../types'

export abstract class BaseDrawHandler implements DrawEventHandler {
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
