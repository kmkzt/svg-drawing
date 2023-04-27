import type { EventHandler, PointObject } from '../types'

export class OffsetPositionHandler implements EventHandler<HTMLElement> {
  position: PointObject | null = null
  private _cleanup: (() => void) | null = null

  setup(el: HTMLElement): void {
    this._cleanup?.()

    const setOffsetPosition = () => {
      const { left, top } = el.getBoundingClientRect()
      this.position = { x: left, y: top }
    }

    setOffsetPosition()

    addEventListener('scroll', setOffsetPosition)
    addEventListener('resize', setOffsetPosition)

    this._cleanup = () => {
      removeEventListener('scroll', setOffsetPosition)
      removeEventListener('resize', setOffsetPosition)
    }
  }

  cleanup() {
    this._cleanup?.()
  }
}
