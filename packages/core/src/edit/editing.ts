import { getEventPoint } from '../event'
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
    this.handleTranslateEnd = this.handleTranslateEnd.bind(this)
    this.handleTranslatePreview = this.handleTranslatePreview.bind(this)

    this.resizeBoundingBox = this.resizeBoundingBox.bind(this)
    this.resizeBoundingBoxPreview = this.resizeBoundingBoxPreview.bind(this)
    this.handleResizeBoundingBoxEnd = this.handleResizeBoundingBoxEnd.bind(this)
    this.handleResizeBoundingBoxPreview =
      this.handleResizeBoundingBoxPreview.bind(this)
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

  cleanup() {
    this.removeTranslateListener()
    this.removeResizeBoundingBoxListener()
  }

  startTranslate(po: PointObject) {
    this.translateBasePoint = po

    this.addTranslateListener()
  }

  translatePreview(po: PointObject) {
    this.translateEditSvg(this.editSvg.preview(), po)
  }

  translate(po: PointObject) {
    this.translateEditSvg(this.editSvg, po)
  }

  private translateEditSvg(editSvg: EditSvg, po: PointObject) {
    editSvg.translate({
      x: po.x - (this.translateBasePoint?.x ?? 0),
      y: po.y - (this.translateBasePoint?.y ?? 0),
    })
    this.updater(editSvg)
  }

  private handleTranslatePreview(ev: MouseEvent | TouchEvent) {
    this.translatePreview(getEventPoint(ev))
  }

  private handleTranslateEnd(ev: MouseEvent | TouchEvent) {
    this.removeTranslateListener()

    this.translate(getEventPoint(ev))
    this.translateBasePoint = null
  }

  private addTranslateListener() {
    addEventListener('mouseup', this.handleTranslateEnd)
    addEventListener('touchend', this.handleTranslateEnd)

    addEventListener('mousemove', this.handleTranslatePreview)
    addEventListener('touchmove', this.handleTranslatePreview)
  }

  private removeTranslateListener() {
    removeEventListener('mouseup', this.handleTranslateEnd)
    removeEventListener('touchend', this.handleTranslateEnd)

    removeEventListener('mousemove', this.handleTranslatePreview)
    removeEventListener('touchmove', this.handleTranslatePreview)
  }

  startResizeBoundingBox(base: ResizeBoundingBoxBase) {
    this.resizeBoundingBoxBase = base
    this.addResizeBoundingBoxListener()
  }

  resizeBoundingBox(po: PointObject) {
    this.resizeEditSvg(this.editSvg, po)
  }

  resizeBoundingBoxPreview(po: PointObject) {
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

  private handleResizeBoundingBoxPreview(ev: MouseEvent | TouchEvent) {
    this.resizeBoundingBoxPreview(getEventPoint(ev))
  }

  private handleResizeBoundingBoxEnd(ev: MouseEvent | TouchEvent) {
    this.removeResizeBoundingBoxListener()

    this.resizeBoundingBox(getEventPoint(ev))
    this.resizeBoundingBoxBase = null
  }

  private addResizeBoundingBoxListener() {
    addEventListener('mouseup', this.handleResizeBoundingBoxEnd)
    addEventListener('touchend', this.handleResizeBoundingBoxEnd)

    addEventListener('mousemove', this.handleResizeBoundingBoxPreview)
    addEventListener('touchmove', this.handleResizeBoundingBoxPreview)
  }

  private removeResizeBoundingBoxListener() {
    removeEventListener('mouseup', this.handleResizeBoundingBoxEnd)
    removeEventListener('touchend', this.handleResizeBoundingBoxEnd)

    removeEventListener('mousemove', this.handleResizeBoundingBoxPreview)
    removeEventListener('touchmove', this.handleResizeBoundingBoxPreview)
  }
}
