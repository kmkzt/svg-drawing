import type { EventHandler, PointObject } from '../types'

export class OffsetPosition implements EventHandler<HTMLElement> {
  position: PointObject | null = null
  private el: HTMLElement | null = null
  private _cleanup: (() => void) | null = null
  constructor() {
    this.setOffsetPosition = this.setOffsetPosition.bind(this)
  }

  private setOffsetPosition() {
    if (!this.el) {
      this.position = null
      return
    }

    const { left, top } = this.el.getBoundingClientRect()
    this.position = { x: left, y: top }
  }

  setElement(el: HTMLElement) {
    this.el = el
  }

  setup(el: HTMLElement): void {
    this.el = el
    this.setOffsetPosition()

    addEventListener('scroll', this.setOffsetPosition)
    this.el.addEventListener('resize', this.setOffsetPosition)

    this._cleanup = () => {
      removeEventListener('scroll', this.setOffsetPosition)
      el.removeEventListener('resize', this.setOffsetPosition)
      this.el = null
    }
  }

  cleanup() {
    this._cleanup?.()
  }
}
