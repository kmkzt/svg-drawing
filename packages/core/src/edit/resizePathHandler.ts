import { getEventPoint } from '../event'
import type { PointObject, Vertex } from '../types'
import type { Editing } from './editing' // TODO: Replace interface

export class ResizePathHandler {
  private selectedVertex: Vertex | null = null
  constructor(public editing: Editing) {
    this.handleResizePathEnd = this.handleResizePathEnd.bind(this)
    this.handleResizePathPreview = this.handleResizePathPreview.bind(this)
  }

  private getResizeMovePoint(ev: MouseEvent | TouchEvent): PointObject {
    const po = getEventPoint(ev)
    return {
      x: po.x - (this.selectedVertex?.point.x ?? 0),
      y: po.y - (this.selectedVertex?.point.y ?? 0),
    }
  }

  private handleResizePathPreview(ev: MouseEvent | TouchEvent) {
    if (!this.selectedVertex) return

    this.editing.resizePreview(
      this.selectedVertex.type,
      this.getResizeMovePoint(ev)
    )
  }

  private handleResizePathEnd(ev: MouseEvent | TouchEvent) {
    this.end()

    if (!this.selectedVertex) return

    this.editing.resize(this.selectedVertex?.type, this.getResizeMovePoint(ev))

    this.selectedVertex = null
  }

  start(vertex: Vertex) {
    this.selectedVertex = vertex
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
