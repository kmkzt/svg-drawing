import { PressedKeyHandler } from './event/pressedKeyHandler'
import { ResizePathHandler } from './event/resizePathHandler'
import { TranslatePathHandler } from './event/translatePathHandler'
import { getEditDataAttributes } from './renderer/dataAttributes'
import type { Editing } from './edit/editing'
import type { SelectObject } from './types'

export class SvgEditing {
  private resizePathHandler: ResizePathHandler
  private translatePathHandler: TranslatePathHandler
  private pressedKeyHandler: PressedKeyHandler
  private el: HTMLElement | undefined

  constructor(
    private editing: Editing,
    options?: { multipleSelectBindKey?: string }
  ) {
    this.resizePathHandler = new ResizePathHandler(editing)
    this.translatePathHandler = new TranslatePathHandler(editing)

    this.pressedKeyHandler = new PressedKeyHandler(
      options?.multipleSelectBindKey ?? 'Shift'
    )

    this.selectElements = this.selectElements.bind(this)
    this.editHandler = this.editHandler.bind(this)
  }

  private get multipleSelect() {
    return this.pressedKeyHandler.pressed
  }

  private selectElements(selectObject: SelectObject | SelectObject[]) {
    this.editing.select(selectObject, this.multipleSelect)
  }

  private editHandler(ev: MouseEvent | TouchEvent) {
    const el = ev.target as HTMLElement
    const editData = getEditDataAttributes(el)

    if (!editData) return

    switch (editData.type) {
      case 'path': {
        this.selectElements({ type: 'path', key: editData.elementKey })
        this.translatePathHandler.start(ev)
        break
      }

      case 'path-anchor-point': {
        this.selectElements({
          type: 'path-point',
          key: editData.elementKey,
          index: {
            command: editData.commandIndex,
            point: editData.pointIndex,
          },
        })
        this.translatePathHandler.start(ev)
        break
      }

      case 'bounding-box': {
        this.editing.selectBoundingBox()
        this.translatePathHandler.start(ev)
        break
      }

      case 'bounding-box-vertex': {
        this.resizePathHandler.start(ev, editData.vertexType)
        break
      }

      case 'frame': {
        this.editing.cancel()
        break
      }
    }
  }

  start(el: HTMLElement) {
    this.end()

    this.el = el
    this.el?.addEventListener('mousedown', this.editHandler)
    this.el?.addEventListener('touchstart', this.editHandler)

    this.pressedKeyHandler.start()
  }

  end() {
    this.el?.removeEventListener('mousedown', this.editHandler)
    this.el?.removeEventListener('touchstart', this.editHandler)

    this.pressedKeyHandler.end()

    this.translatePathHandler.end()
    this.resizePathHandler.end()
  }
}
