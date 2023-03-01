import { EditSvg } from './editSvg'
import { Selector } from './selector'
import type {
  PointObject,
  PathAttributes,
  SelectEventObject,
  VertexType,
  SvgClass,
} from '../types'

export class Editing {
  private selector: Selector

  constructor(
    private svg: SvgClass,
    private _update: (eSvg: EditSvg) => void = () => void 0
  ) {
    this.selector = new Selector()

    this.translate = this.translate.bind(this)
    this.resizeBoundingBox = this.resizeBoundingBox.bind(this)
    this.transform = this.transform.bind(this)
  }

  /** Clear selected status and update screen. */
  cancel() {
    this.selector.clear()
    this.update()
  }

  /** Callback function that refreshes the screen. */
  update() {
    this._update(this.getEditSvg())
  }

  /** Select edit path and update screen. */
  select(event: SelectEventObject) {
    this.selector.select(event)

    this.update()
  }

  /** Delete path and update screen. */
  deleteElements() {
    const editSvg = this.getEditSvg()
    editSvg.delete()
    this._update(editSvg)
  }

  /** Change attributes and update screen. */
  changeAttributes(attrs: PathAttributes) {
    const editSvg = this.getEditSvg()
    editSvg.changeAttributes(attrs)
    this.update()
  }

  translate(po: PointObject, preview?: boolean) {
    const editSvg = this.getEditSvg(preview)
    editSvg.translate(po)
    this._update(editSvg)
  }

  resizeBoundingBox(
    vertexType: VertexType,
    movePoint: PointObject,
    preview?: boolean
  ) {
    const editSvg = this.getEditSvg(preview)
    editSvg.resizeBoundingBox(vertexType, movePoint)
    this._update(editSvg)
  }

  transform(movePoint: PointObject, preview?: boolean) {
    if (this.selector.vertexType) {
      this.resizeBoundingBox(this.selector.vertexType, movePoint, preview)
      return
    }

    this.translate(movePoint, preview)
  }

  private getEditSvg(preview?: boolean): EditSvg {
    const svgClass = preview ? this.svg.clone() : this.svg

    return new EditSvg(svgClass, this.selector)
  }
}
