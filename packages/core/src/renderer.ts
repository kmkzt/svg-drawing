import { Svg, SvgOption } from './svg'

export type RendererOption = Omit<SvgOption, 'width' | 'height'>
export class Renderer extends Svg {
  public el: HTMLElement
  public top: number
  public left: number
  constructor(el: HTMLElement, opt: RendererOption = {}) {
    const { width, height, left, top } = el.getBoundingClientRect()
    super({ width, height, ...opt })
    /**
     * Setup parameter
     */
    this.el = el
    this.left = left
    this.top = top
    el.appendChild(this.toElement())
    this._setupAdjustResize()
  }
  /**
   * render
   * TODO: XSS test
   */
  public update(): void {
    this.el.replaceChild(this.toElement(), this.el.childNodes[0])
  }

  public resizeElement(param?: DOMRect): void {
    const { width, height, left, top } =
      param || this.el.getBoundingClientRect()
    // TODO: Resizing improve
    this.scalePath(width / this.width)
    this.width = width
    this.height = height
    this.left = left
    this.top = top
  }

  private _setupAdjustResize(): void {
    if ((window as any).ResizeObserver) {
      const resizeObserver: any = new (window as any).ResizeObserver(
        (entries: any[]) => {
          this.resizeElement(entries[0].contentRect)
          this.update()
        }
      )
      resizeObserver.observe(this.el)
    } else {
      // TODO: improve
      window.addEventListener('resize', (_ev) => {
        this.resizeElement(this.el.getBoundingClientRect())
        this.update()
      })
    }
  }
}
