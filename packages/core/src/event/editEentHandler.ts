import { getEventPoint } from './getEventPoint'
import { PressedKeyHandler } from './pressedKeyHandler'
import { getSelectEvent } from '../renderer/dataAttributes'
import type { Editing } from '../edit/editing'
import type { EventHandler, PointObject, SelectEventObject } from '../types'

export class EditEventHandler implements EventHandler<HTMLElement> {
  private el: HTMLElement | null = null
  private basePoint: PointObject | null = null
  private currentEvent: SelectEventObject | null = null
  private pressedKeyHandler: PressedKeyHandler
  private multipleSelectBindKey: string

  constructor(
    public editing: Editing,
    options: { multipleSelectBindKey?: string }
  ) {
    this.multipleSelectBindKey = options?.multipleSelectBindKey ?? 'Shift'
    this.pressedKeyHandler = new PressedKeyHandler()

    this.handleTransform = this.handleTransform.bind(this)
    this.handleTransformPreview = this.handleTransformPreview.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  private get multipleSelect() {
    return this.pressedKeyHandler.key === this.multipleSelectBindKey
  }

  private getMovePoint(ev: MouseEvent | TouchEvent): PointObject | null {
    if (!this.basePoint) return null

    const po = getEventPoint(ev)
    return {
      x: po.x - this.basePoint.x,
      y: po.y - this.basePoint.y,
    }
  }

  private handleTransformPreview(ev: MouseEvent | TouchEvent) {
    const movePoint = this.getMovePoint(ev)
    if (!this.currentEvent || !movePoint) return

    switch (this.currentEvent.type) {
      case 'bounding-box/vertex': {
        this.editing.resizeBoundingBoxPreview(
          this.currentEvent.vertexType,
          movePoint
        )
        break
      }
      default: {
        this.editing.translatePreview(movePoint)
        break
      }
    }
  }

  private handleTransform(ev: MouseEvent | TouchEvent) {
    this.transformEnd()

    const movePoint = this.getMovePoint(ev)
    if (!this.currentEvent || !movePoint) return

    switch (this.currentEvent.type) {
      case 'bounding-box/vertex': {
        this.editing.resizeBoundingBox(this.currentEvent.vertexType, movePoint)
        break
      }
      default: {
        this.editing.translate(movePoint)
        break
      }
    }

    this.currentEvent = null
    this.basePoint = null
  }

  private transformStart(
    ev: MouseEvent | TouchEvent,
    selectEvent: SelectEventObject
  ) {
    this.currentEvent = selectEvent
    this.basePoint = getEventPoint(ev)

    addEventListener('mouseup', this.handleTransform)
    addEventListener('touchend', this.handleTransform)

    addEventListener('mousemove', this.handleTransformPreview)
    addEventListener('touchmove', this.handleTransformPreview)
  }

  private transformEnd() {
    removeEventListener('mouseup', this.handleTransform)
    removeEventListener('touchend', this.handleTransform)

    removeEventListener('mousemove', this.handleTransformPreview)
    removeEventListener('touchmove', this.handleTransformPreview)
  }

  private handleSelect(ev: MouseEvent | TouchEvent) {
    const el = ev.target as HTMLElement
    const selectEvent = getSelectEvent(el, this.multipleSelect)

    if (!selectEvent) return

    this.editing.select(selectEvent)

    this.transformStart(ev, selectEvent)
  }

  setup(el: HTMLElement) {
    this.cleanup()
    this.el = el

    this.el?.addEventListener('mousedown', this.handleSelect)
    this.el?.addEventListener('touchstart', this.handleSelect)

    this.pressedKeyHandler.setup()
  }

  cleanup() {
    this.el?.removeEventListener('mousedown', this.handleSelect)
    this.el?.removeEventListener('touchstart', this.handleSelect)

    this.pressedKeyHandler.cleanup()

    this.el = null
  }
}
