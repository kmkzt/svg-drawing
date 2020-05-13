import { Renderer, SvgPath, Point } from './renderer'
import { throttle } from './throttle'
import { getPassiveOptions } from './utils/getPassiveOptions'

export interface DrawingOption {
  penColor?: string
  penWidth?: number
  close?: boolean
  circuler?: boolean
  delay?: number
  fill?: string
}

export class SvgDrawing extends Renderer {
  public penColor: string
  public penWidth: number
  public fill: string
  public circuler: boolean
  public close: boolean
  public delay: number
  private line: SvgPath | null
  private el: HTMLElement
  private clearListener?: () => void
  private top: number
  private left: number
  constructor(
    el: HTMLElement,
    { penColor, penWidth, circuler, close, delay, fill }: DrawingOption = {}
  ) {
    const { width, height, left, top } = el.getBoundingClientRect()
    super({ width, height })
    /**
     * Setup parameter
     */
    this.line = null
    this.penColor = penColor ?? '#333'
    this.penWidth = penWidth ?? 1
    this.circuler = circuler ?? true
    this.close = close ?? false
    this.delay = delay ?? 20
    this.fill = fill ?? 'none'
    this.el = el
    this.left = left
    this.top = top
    this.drawingMove = this.drawingMove.bind(this) // for throttle
    this.init()
  }

  public clear() {
    this.clear()
    this.updateRender()
  }

  public undo() {
    this.undoPath()
    this.updateRender()
  }

  public changeDelay(delay: number) {
    this.delay = delay
    this.setupDrawListener()
  }
  /**
   * Init methods
   */
  private init() {
    this.el.appendChild(this.toElement())
    this.setupAdjustResize()
    this.setupDrawListener()
  }

  // TODO: add PointerEvents
  private setupDrawListener() {
    if (this.clearListener) {
      this.clearListener()
    }
    if (navigator.userAgent.includes('Mobile')) {
      this.setupTouchEventListener()
    } else {
      this.setupMouseEventListener()
    }
  }

  private setupAdjustResize() {
    // TODO: fallback resize
    if ((window as any).ResizeObserver) {
      const resizeObserver: any = new (window as any).ResizeObserver(
        (entries: any[]) => {
          const { width, height, left, top }: any = entries[0].contentRect
          this.resizeElement(width, height)
          this.left = left
          this.top = top
        }
      )
      resizeObserver.observe(this.el)
    }

    window.addEventListener('resize', () => {
      const { width, height, left, top }: any = this.el.getBoundingClientRect()
      this.resizeElement(width, height)
      this.left = left
      this.top = top
    })
  }
  /**
   * render
   * TODO: improve render
   */
  private updateRender() {
    this.el.innerHTML = this.toElement().outerHTML
  }

  /**
   * Drawing Line methods
   */
  private drawingStart({ x, y }: { x: number; y: number }) {
    this.line = this.createPath()
    this.addPath(this.line)
    this.addPoint(this.createPoint({ x, y }))
    this.updateRender()
  }
  private drawingMove({ x, y }: { x: number; y: number }): void {
    const po = this.createPoint({ x, y })
    this.addPoint(po)
    if (
      !this.line ||
      this.line.strokeWidth !== this.penWidth ||
      this.line.stroke !== this.penColor
    ) {
      this.line = this.createPath()
      this.addPath(this.line)
      this.addPoint(po)
    }
    this.updateRender()
  }

  private drawingEnd({ x, y }: { x: number; y: number }) {
    this.addPoint(this.createPoint({ x, y }))
    this.updateRender()
  }

  private createPath(): SvgPath {
    const { left, top } = this.el.getBoundingClientRect()
    this.left = left
    this.top = top
    return new SvgPath({
      close: this.close,
      circuler: this.circuler,
      stroke: this.penColor,
      strokeWidth: this.penWidth,
      fill: this.fill
    })
  }
  private createPoint({ x, y }: { x: number; y: number }): Point {
    return new Point(x - this.left, y - this.top)
  }
  /**
   * Drawing MouseEvent
   */
  private setupMouseEventListener() {
    const handleMouse = (cb: (param: { x: number; y: number }) => void) => (
      ev: MouseEvent
    ): void => {
      ev.preventDefault()
      cb({ x: ev.clientX, y: ev.clientY })
    }
    const mouseDown = handleMouse(param => {
      this.drawingStart(param)
      setTimeout(() => {
        this.el.addEventListener(
          'mousemove',
          mouseMove,
          getPassiveOptions(false)
        )
        this.el.addEventListener('mouseup', mouseUp, getPassiveOptions(false))
      }, this.delay)
    })
    const mouseMove = throttle(handleMouse(this.drawingMove), this.delay)
    const mouseUp = handleMouse((param: { x: number; y: number }) => {
      this.el.removeEventListener('mousemove', mouseMove)
      this.el.removeEventListener('mouseup', mouseUp)
      this.drawingEnd(param)
    })
    this.el.addEventListener('mousedown', mouseDown, getPassiveOptions(false))
    this.clearListener = () =>
      this.el.removeEventListener('mousedown', mouseDown)
  }

  /**
   * Drawing TouchEvent
   */
  private setupTouchEventListener() {
    const handleTouch = (cb: (param: { x: number; y: number }) => void) => (
      ev: TouchEvent
    ): void => {
      ev.preventDefault()
      const touch = ev.touches[0]
      cb({ x: touch.clientX, y: touch.clientY })
    }
    const touchStart = handleTouch(param => {
      this.drawingStart(param)
      setTimeout(() => {
        this.el.addEventListener(
          'touchmove',
          touchMove,
          getPassiveOptions(false)
        )
        this.el.addEventListener('touchend', touchEnd, getPassiveOptions(false))
      }, this.delay)
    })
    const touchMove = throttle(handleTouch(this.drawingMove), this.delay)
    const touchEnd = handleTouch(param => {
      this.el.removeEventListener('touchmove', touchMove)
      this.el.removeEventListener('touchend', touchEnd)
      this.drawingEnd(param)
    })
    this.el.addEventListener('touchstart', touchStart, getPassiveOptions(false))
    this.clearListener = () =>
      this.el.removeEventListener('touchstart', touchStart)
  }
}
