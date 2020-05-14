import { Svg, SvgOption } from './svg'

export type RendererOption = Pick<SvgOption, 'background'>
export class Renderer extends Svg {
  public el: HTMLElement
  public top: number
  public left: number
  constructor(el: HTMLElement, { background }: RendererOption) {
    const { width, height, left, top } = el.getBoundingClientRect()
    super({ width, height, background })
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
   * TODO: improve render
   */
  public update() {
    this.el.innerHTML = this.toElement().outerHTML
  }

  public resize(param?: DOMRect) {
    const { width, height, left, top } =
      param || this.el.getBoundingClientRect()
    if (this.resizeElement(width, height)) {
      this.update()
    }
    this.left = left
    this.top = top
  }

  private _setupAdjustResize() {
    if ((window as any).ResizeObserver) {
      const resizeObserver: any = new (window as any).ResizeObserver(
        (entries: any[]) => {
          this.resize(entries[0].contentRect)
        }
      )
      resizeObserver.observe(this.el)
    } else {
      // TODO: improve
      window.addEventListener('resize', _ev => {
        this.resize(this.el.getBoundingClientRect())
      })
    }
  }
}
