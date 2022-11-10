import type {
  PointObject,
  PathAttributes,
  SelectIndex,
  VertexType,
} from '../types'
import type { EditSvg } from './editSvg'

export class Editing {
  constructor(
    private editSvg: EditSvg,
    /** Callback function that refreshes the screen. */
    private updater: (eSvg: EditSvg) => void = () => void 0
  ) {
    this.translate = this.translate.bind(this)
    this.translatePreview = this.translatePreview.bind(this)

    this.resize = this.resize.bind(this)
    this.resizePreview = this.resizePreview.bind(this)
  }

  /** Clear selected status and update screen. */
  cancel() {
    this.editSvg.cancel()
    this.updater(this.editSvg)
  }

  /** Select edit path and update screen. */
  select(index: SelectIndex | SelectIndex[], combined?: boolean) {
    this.editSvg.select(index, combined)
    this.updater(this.editSvg)
  }

  /** Delete path and update screen. */
  deletePaths() {
    this.editSvg.delete()
    this.updater(this.editSvg)
  }

  /** Change attributes and update screen. */
  changeAttributes(attrs: PathAttributes) {
    this.editSvg.changeAttributes(attrs)
    this.updater(this.editSvg)
  }

  translatePreview(po: PointObject) {
    this.translateEditSvg(this.editSvg.preview(), po)
  }

  translate(po: PointObject) {
    this.translateEditSvg(this.editSvg, po)
  }

  private translateEditSvg(editSvg: EditSvg, po: PointObject) {
    editSvg.translate(po)
    this.updater(editSvg)
  }

  resize(vertexType: VertexType, movePoint: PointObject) {
    this.resizeEditSvg(this.editSvg, vertexType, movePoint)
  }

  resizePreview(vertexType: VertexType, movePoint: PointObject) {
    this.resizeEditSvg(this.editSvg.preview(), vertexType, movePoint)
  }

  private resizeEditSvg(
    editSvg: EditSvg,
    vertexType: VertexType,
    movePoint: PointObject
  ) {
    editSvg.resizeBoundingBox(vertexType, movePoint)
    this.updater(editSvg)
  }
}
