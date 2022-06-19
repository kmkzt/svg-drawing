import { getEventPoint } from '../event'
import type { Editing } from './editing' // todo: Replace interface

export class TranslatePathHandler {
  constructor(public editing: Editing) {
    this.handleTranslateEnd = this.handleTranslateEnd.bind(this)
    this.handleTranslatePreview = this.handleTranslatePreview.bind(this)
  }

  private handleTranslatePreview(ev: MouseEvent | TouchEvent) {
    this.editing.translatePreview(getEventPoint(ev))
  }

  private handleTranslateEnd(ev: MouseEvent | TouchEvent) {
    this.end()

    this.editing.translate(getEventPoint(ev))
  }

  start() {
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
