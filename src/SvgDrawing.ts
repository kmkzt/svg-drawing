import { Renderer, SvgPath, Point } from './renderer'
import { throttle } from './throttle'
import { getPassiveOptions } from './utils/getPassiveOptions'

export interface DrawingOption {
  penColor?: string
  penWidth?: number
  close?: boolean
  circuler?: boolean
  delay?: number
}

export class SvgDrawing {
  public penColor: string
  public penWidth: number
  public circuler: boolean
  public close: boolean
  public delay: number
  private line: SvgPath | null
  private current: Point
  private el: HTMLElement
  private renderer: Renderer
  private clearListener?: () => void
  constructor(
    el: HTMLElement,
    { penColor, penWidth, circuler, close, delay }: DrawingOption = {}
  ) {
    /**
     * Setup parameter
     */
    this.line = null
    this.current = new Point(0, 0)
    this.penColor = penColor ?? '#333'
    this.penWidth = penWidth ?? 1
    this.circuler = circuler ?? true
    this.close = close ?? false
    this.delay = delay ?? 20
    this.el = el
    this.renderer = new Renderer(el)
    this.drawingStart = this.drawingStart.bind(this)
    this.drawingMove = this.drawingMove.bind(this)
    this.drawingEnd = this.drawingEnd.bind(this)
    this.init()
  }

  public clear() {
    this.renderer.clear()
    this.updateRender()
  }

  public download(ext: 'png' | 'svg' | 'jpg') {
    this.renderer.download(ext)
  }

  public undo() {
    this.renderer.undoPath()
    this.updateRender()
  }

  /**
   * Init methods
   */
  private init() {
    this.el.appendChild(this.renderer.toElement())
    if (navigator.userAgent.includes('Mobile')) {
      this.setupTouchEventListener()
    } else {
      this.setupMouseEventListener()
    }
  }
  /**
   * render
   * TODO: improve render
   */
  private updateRender() {
    this.el.innerHTML = this.renderer.toElement().outerHTML
  }

  /**
   * Drawing Line methods
   */
  private drawingStart({ x, y }: { x: number; y: number }) {
    this.line = new SvgPath({
      close: this.close,
      circuler: this.circuler
    })
    this.line.addPoint(new Point(x, y))
    this.renderer.addPath(this.line)
  }
  private drawingMove({ x, y }: { x: number; y: number }): void {
    if (this.line) {
      this.current = new Point(x, y)
      this.line.addPoint(this.current)
      this.renderer.updatePath(this.line)
      if (
        this.line.strokeWidth !== this.penWidth ||
        this.line.stroke !== this.penColor
      ) {
        this.drawingEnd()
        return
      }
      return
    }
    this.line = new SvgPath({
      close: this.close,
      circuler: this.circuler,
      stroke: this.penColor,
      strokeWidth: this.penWidth
    })
    this.line.addPoint(this.current)
    this.line.addPoint(new Point(x, y))
    this.renderer.updatePath(this.line)
  }

  private drawingEnd() {
    this.updateRender()
    if (!this.line) return
    this.renderer.updatePath(this.line)
  }

  /**
   * Drawing MouseEvent
   */
  private setupMouseEventListener() {
    if (this.clearListener) {
      this.clearListener()
    }
    const rect = this.el.getBoundingClientRect()
    const handleMouse = (cb: (param: { x: number; y: number }) => void) => (
      ev: MouseEvent
    ): void => {
      ev.preventDefault()
      cb({ x: ev.clientX - rect.left, y: ev.clientY - rect.top })
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
    const mouseUp = handleMouse((_param: any) => {
      this.el.removeEventListener('mousemove', mouseMove)
      this.el.removeEventListener('mouseup', mouseUp)
      this.drawingEnd()
    })
    this.el.addEventListener('mousedown', mouseDown, getPassiveOptions(false))
    this.clearListener = () =>
      this.el.removeEventListener('mousedown', mouseDown)
  }

  /**
   * Drawing TouchEvent
   */
  private setupTouchEventListener() {
    if (this.clearListener) {
      this.clearListener()
    }
    const touchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      this.drawingStart({ x: touch.clientX, y: touch.clientY })
      setTimeout(() => {
        this.el.addEventListener(
          'touchmove',
          touchMove,
          getPassiveOptions(false)
        )
        this.el.addEventListener('touchend', touchEnd, getPassiveOptions(false))
      }, this.delay)
    }
    const touchMove = throttle((e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      this.drawingMove({
        x: touch.clientX,
        y: touch.clientY
      })
    }, this.delay)
    const touchEnd = (e: TouchEvent) => {
      e.preventDefault()
      this.el.removeEventListener('touchmove', touchMove)
      this.el.removeEventListener('touchend', touchEnd)
      this.drawingEnd()
    }
    this.el.addEventListener('touchstart', touchStart, getPassiveOptions(false))
    this.clearListener = () =>
      this.el.removeEventListener('touchstart', touchStart)
  }
}
