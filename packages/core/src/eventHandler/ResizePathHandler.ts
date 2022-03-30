import { getEventPoint } from '../event'
import type { Editing } from '../edit/editing' /** @todo Replace interface */

export class ResizePathHandler {
  constructor(public editing: Editing) {
    this.handleResizePathEnd = this.handleResizePathEnd.bind(this)
    this.handleResizePathPreview = this.handleResizePathPreview.bind(this)
  }

  private handleResizePathPreview(ev: MouseEvent | TouchEvent) {
    this.editing.resizePreview(getEventPoint(ev))
  }

  private handleResizePathEnd(ev: MouseEvent | TouchEvent) {
    this.end()

    this.editing.resize(getEventPoint(ev))
  }

  start() {
    addEventListener('mouseup', this.handleResizePathEnd)
    addEventListener('touchend', this.handleResizePathEnd)

    addEventListener('mousemove', this.handleResizePathPreview)
    addEventListener('touchmove', this.handleResizePathPreview)
  }

  end() {
    removeEventListener('mouseup', this.handleResizePathEnd)
    removeEventListener('touchend', this.handleResizePathEnd)

    removeEventListener('mousemove', this.handleResizePathPreview)
    removeEventListener('touchmove', this.handleResizePathPreview)
  }
}
