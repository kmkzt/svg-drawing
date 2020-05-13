import { Renderer, RendererOption } from './renderer'
import { Path, Point } from './svg'
import { throttle } from './throttle'
import { getPassiveOptions } from './utils/getPassiveOptions'

export interface DrawingOption extends RendererOption {
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
  private line: Path | null
  private clearListener?: () => void
  constructor(
    el: HTMLElement,
    {
      penColor,
      penWidth,
      circuler,
      close,
      delay,
      fill,
      ...rendOpt
    }: DrawingOption = {}
  ) {
    super(el, { ...rendOpt })
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
    this.drawingMove = this.drawingMove.bind(this) // for throttle
    this.init()
  }

  public clear() {
    this.clearPath()
    this.update()
  }

  public undo() {
    this.undoPath()
    this.update()
  }

  public changeDelay(delay: number) {
    this.delay = delay
    this.setupDrawListener()
  }
  /**
   * Init methods
   */
  private init() {
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

  /**
   * Drawing Line methods
   */
  private drawingStart({ x, y }: { x: number; y: number }) {
    this.line = this.createPath()
    this.addPath(this.line)
    this.addPoint(this.createPoint({ x, y }))
    this.update()
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
    this.update()
  }

  private createPath(): Path {
    this.resize()
    return new Path({
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
    })
    this.el.addEventListener('touchstart', touchStart, getPassiveOptions(false))
    this.clearListener = () =>
      this.el.removeEventListener('touchstart', touchStart)
  }
}
