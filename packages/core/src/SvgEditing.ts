import {
  dataEditType,
  dataPathKey,
  dataCommandIndex,
  dataPointIndex,
  dataVertexType,
} from './dataAttributes'
import { PressedKeyHandler } from './edit/pressedKeyHandler'
import { ResizePathHandler } from './edit/resizePathHandler'
import { TranslatePathHandler } from './edit/translatePathHandler'
import type { Editing } from './edit/editing'
import type { SelectIndex, VertexType } from './types'

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

  private selectElements(selectIndex: SelectIndex | SelectIndex) {
    this.editing.select(selectIndex, this.multipleSelect)
  }

  private editHandler(ev: MouseEvent | TouchEvent) {
    const el = ev.target as HTMLElement
    const editType = el.getAttribute(dataEditType)
    // DEBUG: console.info(ev.target, editType)

    // path
    if (editType === 'path') {
      const pathKey = el.getAttribute(dataPathKey)

      if (!pathKey) return

      this.selectElements({ path: pathKey })
      this.translatePathHandler.start(ev)
      return
    }

    // point
    if (editType === 'point') {
      const pathKey = el.getAttribute(dataPathKey)
      const commandIndex = el.getAttribute(dataCommandIndex)
      const pointIndex = el.getAttribute(dataPointIndex)

      if (!pathKey) return
      if (commandIndex === null) return
      if (pointIndex === null) return

      this.selectElements({
        path: pathKey,
        command: +commandIndex,
        point: +pointIndex,
      })
      this.translatePathHandler.start(ev)
    }

    // bounding-box
    if (editType === 'bounding-box') {
      this.editing.selectBoundingBox()
      this.translatePathHandler.start(ev)
      return
    }

    // bounding-box-vertex
    if (editType === 'bounding-box-vertex') {
      const vertexType = el.getAttribute(dataVertexType)
      if (!vertexType) return

      this.resizePathHandler.start(ev, vertexType as VertexType)

      return
    }

    if (editType === 'frame') {
      this.editing.cancel()
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
