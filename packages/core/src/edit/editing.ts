import type {
  PointObject,
  PathAttributes,
  ResizeBoundingBoxBase,
  SelectIndex,
} from '../types'
import type { EditSvg } from './editSvg'

/** @todo Separate Event handler */
export class Editing {
  private translateBasePoint: PointObject | null = null
  private resizeBoundingBoxBase: ResizeBoundingBoxBase | null = null
  constructor(
    public editSvg: EditSvg,
    public updater: (eSvg: EditSvg) => void = () => void 0
  ) {
    this.translate = this.translate.bind(this)
    this.translatePreview = this.translatePreview.bind(this)

    this.resize = this.resize.bind(this)
    this.resizePreview = this.resizePreview.bind(this)
  }

  setupUpdater(upd: (eSvg: EditSvg) => void) {
    this.updater = upd
  }

  cancel() {
    this.editSvg.cancel()
    this.updater(this.editSvg)
  }

  select(index: SelectIndex, multipleSelect?: boolean) {
    this.editSvg.select(index, multipleSelect)
    this.updater(this.editSvg)
  }

  deletePaths() {
    this.editSvg.delete()
    this.updater(this.editSvg)
  }

  changeAttributes(attrs: PathAttributes) {
    this.editSvg.changeAttributes(attrs)
    this.updater(this.editSvg)
  }

  startTranslate(po: PointObject) {
    this.translateBasePoint = po
  }

  translatePreview(po: PointObject) {
    this.translateEditSvg(this.editSvg.preview(), po)
  }

  translate(po: PointObject) {
    this.translateEditSvg(this.editSvg, po)
    this.translateBasePoint = null
  }

  private translateEditSvg(editSvg: EditSvg, po: PointObject) {
    editSvg.translate({
      x: po.x - (this.translateBasePoint?.x ?? 0),
      y: po.y - (this.translateBasePoint?.y ?? 0),
    })
    this.updater(editSvg)
  }

  startResize(base: ResizeBoundingBoxBase) {
    this.resizeBoundingBoxBase = base
  }

  resize(po: PointObject) {
    this.resizeEditSvg(this.editSvg, po)
    this.resizeBoundingBoxBase = null
  }

  resizePreview(po: PointObject) {
    this.resizeEditSvg(this.editSvg.preview(), po)
  }

  private resizeEditSvg(editSvg: EditSvg, po: PointObject) {
    if (!this.resizeBoundingBoxBase) return

    editSvg.resizeBoundingBox(this.resizeBoundingBoxBase.fixedType, {
      x: po.x - (this.resizeBoundingBoxBase?.point.x ?? 0),
      y: po.y - (this.resizeBoundingBoxBase?.point.y ?? 0),
    })
    this.updater(editSvg)
  }
}
