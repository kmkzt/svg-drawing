import { PressedKeyHandler } from './event/pressedKeyHandler'
import { ResizePathHandler } from './event/resizePathHandler'
import { TranslatePathHandler } from './event/translatePathHandler'
import { getEditEvent } from './renderer/dataAttributes'
import type { Editing } from './edit/editing'
import type { SelectEventObject } from './types'

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

    this.editHandler = this.editHandler.bind(this)
  }

  private get multipleSelect() {
    return this.pressedKeyHandler.pressed
  }

  private editHandler(ev: MouseEvent | TouchEvent) {
    const el = ev.target as HTMLElement
    const editData = getEditEvent(el, this.multipleSelect)

    if (!editData) return

    switch (editData.type) {
      case 'path':
      case 'path/command':
      case 'path/point':
      case 'bounding-box':
      case 'frame': {
        this.editing.select(editData)
        this.translatePathHandler.start(ev)
        break
      }

      case 'bounding-box/vertex': {
        this.resizePathHandler.start(ev, editData.vertexType)
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
