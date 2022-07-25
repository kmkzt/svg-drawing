import { getEventPoint } from '../event'
import type { PointObject, ResizeBoundingBoxBase } from '../types'
import type { Editing } from './editing' // TODO: Replace interface

export class ResizePathHandler {
  private resizeBoundingBoxBase: ResizeBoundingBoxBase | null = null
  constructor(public editing: Editing) {
    this.handleResizePathEnd = this.handleResizePathEnd.bind(this)
    this.handleResizePathPreview = this.handleResizePathPreview.bind(this)
  }

  private getResizeMovePoint(ev: MouseEvent | TouchEvent): PointObject {
    const po = getEventPoint(ev)
    return {
      x: po.x - (this.resizeBoundingBoxBase?.point.x ?? 0),
      y: po.y - (this.resizeBoundingBoxBase?.point.y ?? 0),
    }
  }

  private handleResizePathPreview(ev: MouseEvent | TouchEvent) {
    if (!this.resizeBoundingBoxBase) return

    this.editing.resizePreview(
      this.resizeBoundingBoxBase.fixedType,
      this.getResizeMovePoint(ev)
    )
  }

  private handleResizePathEnd(ev: MouseEvent | TouchEvent) {
    this.end()

    if (!this.resizeBoundingBoxBase) return

    this.editing.resize(
      this.resizeBoundingBoxBase?.fixedType,
      this.getResizeMovePoint(ev)
    )

    this.resizeBoundingBoxBase = null
  }

  start(base: ResizeBoundingBoxBase) {
    this.resizeBoundingBoxBase = base
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
