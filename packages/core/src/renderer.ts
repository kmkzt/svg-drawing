import { Svg, SvgOption } from './svg'

export type RendererOption = Omit<SvgOption, 'width' | 'height'>
export class Renderer {
  public el: HTMLElement
  public top: number
  public left: number
  public svg: Svg
  constructor(el: HTMLElement, opt: RendererOption = {}) {
    const { width, height, left, top } = el.getBoundingClientRect()
    /**
     * Setup parameter
     */
    this.el = el
    this.left = left
    this.top = top
    this.svg = new Svg({ width, height, ...opt })
    el.appendChild(this.svg.toElement())
  }
  /**
   * render
   * TODO: XSS test
   */
  public update(): void {
    this.el.replaceChild(this.svg.toElement(), this.el.childNodes[0])
  }

  public resizeElement(
    param?:
      | DOMRect
      | { width: number; height: number; top: number; left: number }
  ): void {
    const { width, height, left, top } =
      param || this.el.getBoundingClientRect()
    // TODO: Resizing improve
    this.svg.scalePath(width / this.svg.width)
    this.svg.width = width
    this.svg.height = height
    this.left = left
    this.top = top
  }
}
