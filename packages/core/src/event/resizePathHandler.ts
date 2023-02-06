import { getEventPoint } from './getEventPoint'
import type { Editing } from '../edit/editing' // TODO: Replace interface
import type { PointObject, Vertex, VertexType } from '../types'

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

  start(ev: MouseEvent | TouchEvent, type: VertexType) {
    this.selectedVertex = {
      point: getEventPoint(ev),
      type,
    }

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
