import { getEventPoint } from '../event'
import type { PointObject } from '../types'
import type { Editing } from './editing' // todo: Replace interface

export class TranslatePathHandler {
  private basePoint: PointObject | null

  constructor(public editing: Editing) {
    this.basePoint = null

    this.handleTranslateEnd = this.handleTranslateEnd.bind(this)
    this.handleTranslatePreview = this.handleTranslatePreview.bind(this)
  }

  private handleTranslatePreview(ev: MouseEvent | TouchEvent) {
    this.editing.translatePreview(this.getTranslatePoint(ev))
  }

  private handleTranslateEnd(ev: MouseEvent | TouchEvent) {
    this.end()

    this.editing.translate(this.getTranslatePoint(ev))
    this.basePoint = null
  }

  private getTranslatePoint(ev: MouseEvent | TouchEvent): PointObject {
    const point = getEventPoint(ev)

    return {
      x: point.x - (this.basePoint?.x ?? 0),
      y: point.y - (this.basePoint?.y ?? 0),
    }
  }

  start(po: PointObject) {
    this.basePoint = po

    addEventListener('mouseup', this.handleTranslateEnd)
    addEventListener('touchend', this.handleTranslateEnd)

    addEventListener('mousemove', this.handleTranslatePreview)
    addEventListener('touchmove', this.handleTranslatePreview)
  }

  end() {
    removeEventListener('mouseup', this.handleTranslateEnd)
    removeEventListener('touchend', this.handleTranslateEnd)

    removeEventListener('mousemove', this.handleTranslatePreview)
    removeEventListener('touchmove', this.handleTranslatePreview)
  }
}
