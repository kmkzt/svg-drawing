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
  private _line: Path | null
  private _clearListener?: () => void
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
    this.penColor = penColor ?? '#333'
    this.penWidth = penWidth ?? 1
    this.circuler = circuler ?? true
    this.close = close ?? false
    this.delay = delay ?? 20
    this.fill = fill ?? 'none'
    this._line = null
    this._drawingMove = this._drawingMove.bind(this) // for throttle
    this._init()
  }

  public clear() {
    this.clearPath()
    this._updateRender()
  }

  public undo() {
    this.undoPath()
    this._updateRender()
  }

  public changeDelay(delay: number) {
    this.delay = delay
    this._setupDrawListener()
  }
  /**
   * Init methods
   */
  private _init() {
    this._setupDrawListener()
  }

  private _updateRender() {
    this.current?.formatCommand()
    this.update()
  }
  private get current(): Path | null {
    if (this.paths.length === 0) return null
    return this.paths[this.paths.length - 1]
  }

  // TODO: add PointerEvents
  private _setupDrawListener() {
    if (this._clearListener) {
      this._clearListener()
    }
    if (navigator.userAgent.includes('Mobile')) {
      this._setupTouchEventListener()
    } else {
      this._setupMouseEventListener()
    }
  }

  /**
   * Drawing Line methods
   */
  private _drawingStart({ x, y }: { x: number; y: number }) {
    this._line = this._createPath()
    this.addPath(this._line)
    this.addPoint(this._createPoint({ x, y }))
    this._updateRender()
  }

  private _drawingMove({ x, y }: { x: number; y: number }): void {
    const po = this._createPoint({ x, y })
    this.addPoint(po)
    if (
      !this._line ||
      this._line.strokeWidth !== this.penWidth ||
      this._line.stroke !== this.penColor
    ) {
      this._line = this._createPath()
      this.addPath(this._line)
      this.addPoint(po)
    }
    this._updateRender()
  }

  private _createPath(): Path {
    this.resize()
    return new Path({
      close: this.close,
      circuler: this.circuler,
      stroke: this.penColor,
      strokeWidth: this.penWidth,
      fill: this.fill
    })
  }
  private _createPoint({ x, y }: { x: number; y: number }): Point {
    return new Point(x - this.left, y - this.top)
  }
  /**
   * Drawing MouseEvent
   */
  private _setupMouseEventListener() {
    const handleMouse = (cb: (param: { x: number; y: number }) => void) => (
      ev: MouseEvent
    ): void => {
      ev.preventDefault()
      cb({ x: ev.clientX, y: ev.clientY })
    }
    const start = handleMouse(param => {
      this._drawingStart(param)
      setTimeout(() => {
        this.el.addEventListener('mousemove', draw, getPassiveOptions(false))
        this.el.addEventListener('mouseup', end, getPassiveOptions(false))
        this.el.addEventListener('mouseleave', end, getPassiveOptions(false))
      }, this.delay)
    })
    const draw = throttle(handleMouse(this._drawingMove), this.delay)
    const end = handleMouse((param: { x: number; y: number }) => {
      this.el.removeEventListener('mousemove', draw)
      this.el.removeEventListener('mouseup', end)
      this.el.removeEventListener('mouseleave', end)
    })
    this.el.addEventListener('mousedown', start, getPassiveOptions(false))
    this._clearListener = () => this.el.removeEventListener('mousedown', start)
  }

  /**
   * Drawing TouchEvent
   */
  private _setupTouchEventListener() {
    const handleTouch = (cb: (param: { x: number; y: number }) => void) => (
      ev: TouchEvent
    ): void => {
      ev.preventDefault()
      const touch = ev.touches[0]
      cb({ x: touch.clientX, y: touch.clientY })
    }
    const start = handleTouch(param => {
      this._drawingStart(param)
      setTimeout(() => {
        this.el.addEventListener('touchmove', draw, getPassiveOptions(false))
        this.el.addEventListener('touchend', end, getPassiveOptions(false))
      }, this.delay)
    })
    const draw = throttle(handleTouch(this._drawingMove), this.delay)
    const end = handleTouch(param => {
      this.el.removeEventListener('touchmove', draw)
      this.el.removeEventListener('touchend', end)
    })
    this.el.addEventListener('touchstart', start, getPassiveOptions(false))
    this._clearListener = () => this.el.removeEventListener('touchstart', start)
  }
}
