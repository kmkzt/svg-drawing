import { getEventPoint } from './getEventPoint'
import { PressedKeyHandler } from './pressedKeyHandler'
import { getSelectEvent } from '../renderer/dataAttributes'
import type { Editing } from '../edit/editing'
import type { EventHandler, PointObject } from '../types'

export class EditHandler implements EventHandler<HTMLElement> {
  private parentElement: HTMLElement | null = null
  private basePoint: PointObject | null = null
  private pressedKeyHandler: PressedKeyHandler
  private multipleSelectBindKey: string

  constructor(
    private editing: Editing,
    options: { multipleSelectBindKey?: string }
  ) {
    this.multipleSelectBindKey = options?.multipleSelectBindKey ?? 'Shift'
    this.pressedKeyHandler = new PressedKeyHandler()

    this.transform = this.transform.bind(this)
    this.handleTransform = this.handleTransform.bind(this)
    this.handleTransformPreview = this.handleTransformPreview.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  private get multipleSelect() {
    return this.pressedKeyHandler.key === this.multipleSelectBindKey
  }

  private getMovePoint(ev: MouseEvent | TouchEvent): PointObject | null {
    if (!this.basePoint) return null

    const point = getEventPoint(ev)

    return {
      x: point.x - this.basePoint.x,
      y: point.y - this.basePoint.y,
    }
  }

  private transform(ev: MouseEvent | TouchEvent, preview: boolean) {
    const movePoint = this.getMovePoint(ev)
    if (!movePoint) return

    this.editing.transform(movePoint, preview)
  }

  private handleTransformPreview(ev: MouseEvent | TouchEvent) {
    this.transform(ev, true)
  }

  private handleTransform(ev: MouseEvent | TouchEvent) {
    this.cleanupTransformListener()

    this.transform(ev, false)

    this.basePoint = null
  }

  private setupTransformListener() {
    addEventListener('mouseup', this.handleTransform)
    addEventListener('touchend', this.handleTransform)

    addEventListener('mousemove', this.handleTransformPreview)
    addEventListener('touchmove', this.handleTransformPreview)
  }

  private cleanupTransformListener() {
    removeEventListener('mouseup', this.handleTransform)
    removeEventListener('touchend', this.handleTransform)

    removeEventListener('mousemove', this.handleTransformPreview)
    removeEventListener('touchmove', this.handleTransformPreview)
  }

  private handleSelect(ev: MouseEvent | TouchEvent) {
    const targetElement = ev.target as HTMLElement
    const selectEvent = getSelectEvent(targetElement, this.multipleSelect)

    if (!selectEvent) return

    this.editing.select(selectEvent)
    this.basePoint = getEventPoint(ev)
    this.setupTransformListener()
  }

  setup(el: HTMLElement) {
    this.cleanup()
    this.parentElement = el

    this.parentElement?.addEventListener('mousedown', this.handleSelect)
    this.parentElement?.addEventListener('touchstart', this.handleSelect)

    this.pressedKeyHandler.setup()
  }

  cleanup() {
    this.parentElement?.removeEventListener('mousedown', this.handleSelect)
    this.parentElement?.removeEventListener('touchstart', this.handleSelect)

    this.pressedKeyHandler.cleanup()

    this.parentElement = null
  }
}
