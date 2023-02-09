import { EditSvg } from './editSvg'
import type {
  PointObject,
  PathAttributes,
  SelectEventObject,
  VertexType,
  SvgClass,
} from '../types'

export class Editing {
  private editSvg: EditSvg
  constructor(
    svg: SvgClass,
    private _update: (eSvg: EditSvg) => void = () => void 0
  ) {
    this.editSvg = new EditSvg(svg)

    this.translate = this.translate.bind(this)
    this.translatePreview = this.translatePreview.bind(this)

    this.resize = this.resize.bind(this)
    this.resizePreview = this.resizePreview.bind(this)
  }

  /** Clear selected status and update screen. */
  cancel() {
    this.editSvg.cancel()
    this.update()
  }

  /** Callback function that refreshes the screen. */
  update() {
    this._update(this.editSvg)
  }

  /** Select edit path and update screen. */
  select(event: SelectEventObject) {
    this.editSvg.select(event)
    this.update()
  }

  /** Delete path and update screen. */
  deleteElements() {
    this.editSvg.delete()
    this.update()
  }

  /** Change attributes and update screen. */
  changeAttributes(attrs: PathAttributes) {
    this.editSvg.changeAttributes(attrs)
    this.update()
  }

  translatePreview(po: PointObject) {
    this.translateEditSvg(this.editSvg.preview(), po)
  }

  translate(po: PointObject) {
    this.translateEditSvg(this.editSvg, po)
  }

  private translateEditSvg(editSvg: EditSvg, po: PointObject) {
    editSvg.translate(po)
    this._update(editSvg)
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
    this._update(editSvg)
  }
}
