import type { ResizeEventHandler, ResizeCallback } from './types'

const SUPPORT_RESIZE_OBSERVER = typeof ResizeObserver !== 'undefined'
export class ResizeHandler implements ResizeEventHandler {
  /** Remove EventList */
  private _clearEventList: Array<() => void>
  private resize: ResizeCallback
  constructor(private el: HTMLElement | null = null) {
    this.el = el
    this.resize = () => void 0
    this._clearEventList = []
  }

  public get active(): boolean {
    return this._clearEventList.length > 0
  }

  public off() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []
  }

  public on() {
    this.off()
    this._setupListener()
  }

  public setElement(el: HTMLElement) {
    this.el = el
    if (this.active) this.on()
    return this
  }

  public setHandler(resize: ResizeCallback) {
    this.resize = resize
  }

  private _setupListener(): void {
    if (!this.el) return

    const { width, height, left, top } = this.el.getBoundingClientRect()
    this.resize({ width, height, left, top })

    // ResizeObserver
    if (SUPPORT_RESIZE_OBSERVER) {
      const resizeObserver = new ResizeObserver(([entry]) => {
        const { width, height, left, top } = entry.contentRect
        this.resize({ width, height, left, top })
      })
      resizeObserver.observe(this.el)

      this._clearEventList.push(() => resizeObserver.disconnect())
      return
    }

    // Fallback resize listener
    const handleResizeEvent = () => {
      if (!this.el) return

      const { width, height, left, top } = this.el.getBoundingClientRect()
      this.resize({ width, height, left, top })
    }

    addEventListener('resize', handleResizeEvent)
    this._clearEventList.push(() =>
      removeEventListener('resize', handleResizeEvent)
    )
  }
}
