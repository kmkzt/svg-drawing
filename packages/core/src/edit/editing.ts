import type {
  PointObject,
  PathAttributes,
  ResizeBoundingBoxBase,
  SelectIndex,
} from '../types'
import type { EditSvg } from './editSvg'

export class Editing {
  private translateBasePoint: PointObject | null = null
  private resizeBoundingBoxBase: ResizeBoundingBoxBase | null = null
  constructor(
    public editSvg: EditSvg,
    /** Callback function that refreshes the screen. */
    public updater: (eSvg: EditSvg) => void = () => void 0
  ) {
    this.translate = this.translate.bind(this)
    this.translatePreview = this.translatePreview.bind(this)

    this.resize = this.resize.bind(this)
    this.resizePreview = this.resizePreview.bind(this)
  }

  /** Set the callback function to update the screen */
  setupUpdater(upd: (eSvg: EditSvg) => void) {
    this.updater = upd
  }

  /** Clear selected status and update screen. */
  cancel() {
    this.editSvg.cancel()
    this.updater(this.editSvg)
  }

  /** Select edit path and update screen. */
  select(index: SelectIndex, multipleSelect?: boolean) {
    this.editSvg.select(index, multipleSelect)
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
