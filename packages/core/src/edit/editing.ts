import { EditSvg } from './editSvg'
import { Selector } from './selector'
import type {
  PointObject,
  PathAttributes,
  SelectEventObject,
  VertexType,
  SvgClass,
  RenderParams,
} from '../types'

export class Editing {
  private selector: Selector

  constructor(
    private svg: SvgClass,
    private render: (arg: RenderParams) => void = () => void 0
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

  /** Call render methods to update screen. */
  update() {
    const { svg, editSvg } = this.getEditSvg()
    this.reflect({ svg, editSvg })
  }

  /** Select edit path and update screen. */
  select(event: SelectEventObject) {
    this.selector.select(event)

    this.update()
  }

  /** Delete path and update screen. */
  deleteElements() {
    const { svg, editSvg } = this.getEditSvg()
    editSvg.delete()

    this.reflect({ svg, editSvg })
  }

  /** Change attributes and update screen. */
  changeAttributes(attrs: PathAttributes) {
    const { editSvg, svg } = this.getEditSvg()
    editSvg.changeAttributes(attrs)

    this.reflect({ svg, editSvg })
  }

  /**
   * Translate the selected path and update screen.
   *
   * @param preview If true, svg should be the same.
   */
  translate(po: PointObject, preview?: boolean) {
    const { editSvg, svg } = this.getEditSvg(preview)
    editSvg.translate(po)

    this.reflect({ svg, editSvg })
  }

  /**
   * Resize the bounding box of the selected path and update screen.
   *
   * @param vertexType The type of vertex.
   * @param movePoint The point to move.
   * @param preview If true, svg should be the same.
   */
  resizeBoundingBox(
    vertexType: VertexType,
    movePoint: PointObject,
    preview?: boolean
  ) {
    const { svg, editSvg } = this.getEditSvg(preview)
    editSvg.resizeBoundingBox(vertexType, movePoint)

    this.reflect({ svg, editSvg })
  }

  /**
   * @param movePoint
   * @param preview
   * @returns
   */
  transform(movePoint: PointObject, preview?: boolean) {
    if (this.selector.vertexType) {
      this.resizeBoundingBox(this.selector.vertexType, movePoint, preview)
      return
    }

    this.translate(movePoint, preview)
  }

  private reflect({ svg, editSvg }: { svg: SvgClass; editSvg: EditSvg }) {
    this.render({
      svg: svg.toJson(),
      edit: editSvg.toJson(),
    })
  }

  private getEditSvg(preview?: boolean): { svg: SvgClass; editSvg: EditSvg } {
    const svg = preview ? this.svg.clone() : this.svg

    return {
      svg,
      editSvg: new EditSvg(svg, this.selector),
    }
  }
}
