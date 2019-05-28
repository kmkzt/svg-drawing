import Two, { ConstructorParams } from 'two.js'
import { svgFormatting } from './utils/svgFormatting'
export interface DrawingOption extends ConstructorParams {
  el: SvgDrawing['el']
  penColor?: SvgDrawing['penColor']
  penWidth?: SvgDrawing['penWidth']
  strokeCap?: SvgDrawing['strokeCap'] // butt | round | square | inherit
  strokeLineJoin?: SvgDrawing['strokeLineJoin'] // miter | round | bevel
}

export class SvgDrawing extends Two {
  public penColor: Two.Color
  public penWidth: number
  public strokeCap: string
  public strokeLineJoin: string
  private line: Two.Path | null
  private current: Two.Vector
  private el: HTMLElement
  constructor(params: DrawingOption) {
    super(params)
    /**
     * bind methods
     */
    this.drawingStart = this.drawingStart.bind(this)
    this.clearListner = this.clearListner.bind(this)
    this.toSvgXml = this.toSvgXml.bind(this)
    this.toSvgBase64 = this.toSvgBase64.bind(this)
    this.move = this.move.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.mouseMove = this.mouseMove.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
    /**
     * Setup parameter
     */
    this.line = null
    // TODO: Fix Two.vector constructor params
    this.current = new Two.Vector(0, 0)
    this.penColor = params.penColor || '#333'
    this.penWidth = params.penWidth || 10
    this.strokeCap = params.strokeCap || 'round'
    this.strokeLineJoin = params.strokeLineJoin || 'round'
    this.type = params.type || Two.Types.svg
    this.el = params.el
    this.width = params.width || this.el.clientWidth
    this.height = params.height || this.el.clientHeight
    this.drawingStart()
  }

  /**
   * toSvgXML
   */
  public toSvgXml(): string | null {
    const domElement: HTMLElement = (this.renderer as any).domElement
    const svgElement: SVGSVGElement = svgFormatting(domElement.outerHTML)
    if (!domElement) return null
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${
      this.width
    }" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">${
      svgElement.innerHTML
    }</svg>`
  }
  /**
   * toSvgXML
   */
  public toSvgBase64(): string | null {
    const svgXml = this.toSvgXml()
    if (!svgXml) return null
    return `data:image/svg+xml;base64,${btoa(svgXml)}`
  }
  /**
   * listner clear
   */
  public clearListner() {
    this.el.removeEventListener('mousedown', this.mouseDown)
    this.el.removeEventListener('touchstart', this.touchStart)
  }
  /**
   * DrawingStart
   */
  private drawingStart() {
    this.appendTo(this.el)
    this.el.addEventListener('mousedown', this.mouseDown)
    this.el.addEventListener('touchstart', this.touchStart)
    return this
  }
  /**
   * Drawing Line methods
   */
  private move({ x, y }: { x: number; y: number }): void {
    const rect: ClientRect | DOMRect = this.el.getBoundingClientRect()
    const makePoint = (mx: number, my: number) =>
      new Two.Vector(mx - rect.left, my - rect.top)
    this.current.set(x, y)
    if (this.line) {
      const v = makePoint(x, y)
      this.line.vertices.push(v as Two.Anchor)
      return
    }
    const vprev: Two.Vector = makePoint(this.current.x, this.current.y)
    const vnext: Two.Vector = makePoint(x, y)
    this.line = this.makeCurve([vprev, vnext], true)
    this.line.noFill().stroke = this.penColor
    this.line.linewidth = this.penWidth
    this.line.cap = this.strokeCap
    this.line.join = this.strokeLineJoin
    this.line.vertices.map(v => {
      if (!this.line) return
      v.addSelf(this.line.translation)
    })
    this.line.translation.clear()
  }

  /**
   * Drawing MouseEvent
   */
  private mouseMove(e: MouseEvent): void {
    this.move({ x: e.clientX, y: e.clientY })
  }
  private mouseUp(e: MouseEvent) {
    this.el.removeEventListener('mousemove', this.mouseMove)
    this.el.removeEventListener('mouseup', this.mouseUp)
  }
  private mouseDown(e: MouseEvent) {
    this.current.set(e.clientX, e.clientY)
    this.line = null
    this.el.addEventListener('mousemove', this.mouseMove)
    this.el.addEventListener('mouseup', this.mouseUp)
  }

  /**
   * Drawing TouchEvent
   */
  private touchMove(e: TouchEvent) {
    e.preventDefault()
    const touch = e.touches[0]
    this.move({
      x: touch.pageX,
      y: touch.pageY
    })
    return false
  }
  private touchEnd(e: TouchEvent) {
    e.preventDefault()
    this.el.removeEventListener('touchmove', this.touchMove)
    this.el.removeEventListener('touchend', this.touchEnd)
    return false
  }
  private touchStart(e: TouchEvent) {
    e.preventDefault()
    const touch = e.touches[0]
    this.current.set(touch.pageX, touch.pageY)
    this.line = null
    this.el.addEventListener('touchmove', this.touchMove)
    this.el.addEventListener('touchend', this.touchEnd)
    return false
  }
}
