import type { ClearListener } from '../types'

export class OffsetPosition {
  left: number
  top: number
  constructor(private el?: HTMLElement) {
    const { left, top } = el ? el.getBoundingClientRect() : { left: 0, top: 0 }

    this.left = left
    this.top = top
  }

  setElement(el: HTMLElement) {
    this.el = el
  }

  setup(): Array<ClearListener> {
    const el = this.el
    if (!el) return []

    const setOffsetPosition = () => {
      const { left, top } = el.getBoundingClientRect()
      this.left = left
      this.top = top
    }

    setOffsetPosition()
    addEventListener('scroll', setOffsetPosition)
    el.addEventListener('resize', setOffsetPosition)
    return [
      () => {
        removeEventListener('scroll', setOffsetPosition)
        el.removeEventListener('resize', setOffsetPosition)
      },
    ]
  }
}
