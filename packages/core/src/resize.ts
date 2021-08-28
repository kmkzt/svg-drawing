import type { ResizeEventHandler, ResizeHandlerOption } from './types'

const SUPPORT_RESIZE_OBSERVER = typeof ResizeObserver !== 'undefined'
export class ResizeHandler implements ResizeEventHandler {
  /**
   * Remove EventList
   */
  private _clearEventList: Array<() => void>
  public resize: ResizeHandlerOption['resize']
  private _el?: ResizeHandlerOption['el']
  constructor({ el, resize }: ResizeHandlerOption) {
    this._el = el
    this.resize = resize
    this._clearEventList = []
  }

  public off() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []
  }

  public on() {
    this.off()
    this._setupListener()
  }

  public get isActive(): boolean {
    return this._clearEventList.length > 0
  }

  public setElement(el: HTMLElement) {
    this._el = el
    if (this.isActive) this.on()
    return this
  }

  private _setupListener(): void {
    if (!this._el) return

    // ResizeObserver
    if (SUPPORT_RESIZE_OBSERVER) {
      const resizeObserver: any = new ResizeObserver(([entry]: any[]) => {
        this.resize(entry.contentRect)
      })
      resizeObserver.observe(this._el)
      this._clearEventList.push(() => resizeObserver.disconnect())
      return
    }

    const handleResizeEvent = () => {
      if (!this._el) return
      this.resize(this._el.getBoundingClientRect())
    }
    addEventListener('resize', handleResizeEvent)
    this._clearEventList.push(() =>
      removeEventListener('resize', handleResizeEvent)
    )
  }
}
