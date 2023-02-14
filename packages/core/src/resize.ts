import type { ResizeCallback, EventHandler } from './types'

const SUPPORT_RESIZE_OBSERVER = typeof ResizeObserver !== 'undefined'

/**
 * ### Resize SVG to match element resizing
 *
 * ```ts
 * const svg = new Svg()
 * const resizeHandler = new ResizeHandler(
 *   document.getElementById('draw-area')
 * )
 *
 * resizeHandler.setHandler(({ width, height }) =>
 *   svg.resize({ width, height })
 * )
 * resizeHandler.on()
 * ```
 */
export class ResizeHandler implements EventHandler<HTMLElement> {
  /** Remove EventList */
  private _clearEventList: Array<() => void>
  private resizeCallback: ResizeCallback
  private width = 0
  private height = 0
  private threshold = 1
  private el: HTMLElement | null = null
  constructor() {
    this.resizeCallback = () => void 0
    this._clearEventList = []
  }

  public get active(): boolean {
    return this._clearEventList.length > 0
  }

  public cleanup() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []
    this.el = null
  }

  public setup(el: HTMLElement) {
    this.cleanup()
    this._setupListener(el)
  }

  public setHandler(resizeCallback: ResizeCallback) {
    this.resizeCallback = resizeCallback
  }

  private resize({ width, height }: { width: number; height: number }) {
    this.width = width
    this.height = height
    this.resizeCallback({ width, height })
  }

  private handleResize() {
    if (!this.el) return
    const { width, height } = this.el.getBoundingClientRect()

    if (
      Math.abs(this.width - width) < this.threshold &&
      Math.abs(this.height - height) < this.threshold
    ) {
      return
    }

    this.resize({ width, height })
  }

  private _setupListener(el: HTMLElement): void {
    this.el = el
    // Initialize size
    this.handleResize()

    // ResizeObserver
    // Use `getBoundingClientRect` because it is not fit when the size is obtained from `contentRect` of resize observe entry.
    if (SUPPORT_RESIZE_OBSERVER) {
      const resizeObserver = new ResizeObserver(() => this.handleResize())
      resizeObserver.observe(this.el)

      this._clearEventList.push(() => resizeObserver.disconnect())
      return
    }

    // Fallback resize listener
    addEventListener('resize', this.handleResize)
    this._clearEventList.push(() =>
      removeEventListener('resize', this.handleResize)
    )
  }
}
