import { getEventPoint } from '../event'
import type {
  PointObject,
  PathAttributes,
  Selecting,
  ResizeBoundingBoxBase,
  SelectIndex,
} from '../types'
import type { EditSvg } from './editSvg'

export class Editing {
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

  public setupUpdater(upd: (eSvg: EditSvg) => void) {
    this.updater = upd
  }

  public cancel() {
    this.editSvg.cancel()
    this.updater(this.editSvg)
  }

  public select(index: SelectIndex, multipleSelect?: boolean) {
    this.editSvg.select(index, multipleSelect)
    this.updater(this.editSvg)
  }

  public deletePaths() {
    this.editSvg.delete()
    this.cancel()
  }

  public changeAttributes(attrs: PathAttributes) {
    this.editSvg.changeAttributes(attrs)
    this.updater(this.editSvg)
  }

  public startTranslate(po: PointObject) {
    this.editSvg.setupTranslateBsePoint(po)

    this.addTranslateListener()
  }

  public translatePreview(move: PointObject) {
    const preview = this.editSvg.preview()
    preview.translate(move)

    this.updater(preview)
  }

  public translate(move: PointObject) {
    this.editSvg.translate(move)
    this.editSvg.resetTranslateBsePoint()

    this.updater(this.editSvg)
  }

  private handleTranslatePreview(ev: MouseEvent | TouchEvent) {
    this.translatePreview(getEventPoint(ev))
  }

  private handleTranslateEnd(ev: MouseEvent | TouchEvent) {
    this.translate(getEventPoint(ev))

    this.removeTranslateListener()
  }

  public addTranslateListener() {
    addEventListener('mouseup', this.handleTranslateEnd)
    addEventListener('touchend', this.handleTranslateEnd)

    addEventListener('mousemove', this.handleTranslatePreview)
    addEventListener('touchmove', this.handleTranslatePreview)
  }

  public removeTranslateListener() {
    removeEventListener('mouseup', this.handleTranslateEnd)
    removeEventListener('touchend', this.handleTranslateEnd)

    removeEventListener('mousemove', this.handleTranslatePreview)
    removeEventListener('touchmove', this.handleTranslatePreview)
  }

  public startResizeBoundingBox(base: ResizeBoundingBoxBase) {
    this.editSvg.setupResizeBoundingBox(base)
    this.addResizeBoundingBoxListener()
  }

  public resizeBoundingBox(po: PointObject) {
    this.editSvg.resizeBoundingBox(po)
    this.updater(this.editSvg)

    this.editSvg.resetTranslateBsePoint()
    this.removeResizeBoundingBoxListener()
  }

  public resizeBoundingBoxPreview(po: PointObject) {
    const preview = this.editSvg.preview()
    preview.resizeBoundingBox(po)
    this.updater(preview)
  }

  public handleResizeBoundingBoxPreview(ev: MouseEvent | TouchEvent) {
    this.resizeBoundingBoxPreview(getEventPoint(ev))
  }

  public handleResizeBoundingBoxEnd(ev: MouseEvent | TouchEvent) {
    this.resizeBoundingBox(getEventPoint(ev))

    this.removeResizeBoundingBoxListener()
  }

  public addResizeBoundingBoxListener() {
    addEventListener('mouseup', this.handleResizeBoundingBoxEnd)
    addEventListener('touchend', this.handleResizeBoundingBoxEnd)

    addEventListener('mousemove', this.handleResizeBoundingBoxPreview)
    addEventListener('touchmove', this.handleResizeBoundingBoxPreview)
  }

  public removeResizeBoundingBoxListener() {
    removeEventListener('mouseup', this.handleResizeBoundingBoxEnd)
    removeEventListener('touchend', this.handleResizeBoundingBoxEnd)

    removeEventListener('mousemove', this.handleResizeBoundingBoxPreview)
    removeEventListener('touchmove', this.handleResizeBoundingBoxPreview)
  }

  public cleanup() {
    this.removeTranslateListener()
    this.removeResizeBoundingBoxListener()
  }
}
