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

    this.resizeBoundingBox = this.resizeBoundingBox.bind(this)
    this.resizeBoundingBoxPreview = this.resizeBoundingBoxPreview.bind(this)
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
    this._translate(this.editSvg.preview(), po)
  }

  translate(po: PointObject) {
    this._translate(this.editSvg, po)
  }

  private _translate(editSvg: EditSvg, po: PointObject) {
    editSvg.translate(po)
    this._update(editSvg)
  }

  resizeBoundingBox(vertexType: VertexType, movePoint: PointObject) {
    this._resizeBoundingBox(this.editSvg, vertexType, movePoint)
  }

  resizeBoundingBoxPreview(vertexType: VertexType, movePoint: PointObject) {
    this._resizeBoundingBox(this.editSvg.preview(), vertexType, movePoint)
  }

  private _resizeBoundingBox(
    editSvg: EditSvg,
    vertexType: VertexType,
    movePoint: PointObject
  ) {
    editSvg.resizeBoundingBox(vertexType, movePoint)
    this._update(editSvg)
  }
}
