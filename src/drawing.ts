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
  private _clearPointListener: (() => void) | null
  private _clearMouseListener: (() => void) | null
  private _clearTouchListener: (() => void) | null
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
    this._clearPointListener = null
    this._clearMouseListener = null
    this._clearTouchListener = null
    this._drawingMove = this._drawingMove.bind(this) // for throttle
    this.on()
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
    this.on()
  }

  private _updateRender() {
    this.current?.formatCommand()
    this.update()
  }
  private get current(): Path | null {
    if (this.paths.length === 0) return null
    return this.paths[this.paths.length - 1]
  }

  public on() {
    this.off()

    if (window.PointerEvent) {
      this._setupPointEventListener()
    } else {
      this._setupMouseEventListener()
    }
    if ('ontouchstart' in window) {
      this._setupTouchEventListener()
    }
  }

  public off() {
    if (this._clearPointListener) {
      this._clearPointListener()
      this._clearPointListener = null
    }
    if (this._clearMouseListener) {
      this._clearMouseListener()
      this._clearMouseListener = null
    }
    if (this._clearTouchListener) {
      this._clearTouchListener()
      this._clearTouchListener = null
    }
  }
  private _drawingStart() {
    this._line = this._createPath()
    this.addPath(this._line)
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
  private _setupPointEventListener() {
    const handleMouse = (cb: (param: { x: number; y: number }) => void) => (
      ev: PointerEvent
    ): void => {
      ev.preventDefault()
      cb({ x: ev.clientX, y: ev.clientY })
    }
    const start = handleMouse(param => {
      this._drawingStart()
      this.el.addEventListener('pointermove', draw)
      this.el.addEventListener('pointerup', end)
      this.el.addEventListener('pointerleave', end)
    })
    const draw = throttle(handleMouse(this._drawingMove), this.delay)
    const end = handleMouse((param: { x: number; y: number }) => {
      this.el.removeEventListener('pointermove', draw)
      this.el.removeEventListener('pointerup', end)
      this.el.removeEventListener('pointerleave', end)
    })
    document.addEventListener('pointerdown', start)
    this._clearPointListener = () =>
      document.removeEventListener('pointerdown', start)
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
    const start = handleMouse(_param => {
      this._drawingStart()
      this.el.addEventListener('mousemove', draw, getPassiveOptions(false))
      this.el.addEventListener('mouseup', end, getPassiveOptions(false))
      this.el.addEventListener('mouseleave', end, getPassiveOptions(false))
    })
    const draw = throttle(handleMouse(this._drawingMove), this.delay)
    const end = handleMouse(_param => {
      this.el.removeEventListener('mousemove', draw)
      this.el.removeEventListener('mouseup', end)
      this.el.removeEventListener('mouseleave', end)
    })
    this.el.addEventListener('mousedown', start, getPassiveOptions(false))
    this._clearMouseListener = () =>
      this.el.removeEventListener('mousedown', start)
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
    const start = handleTouch(_param => {
      this._drawingStart()
      this.el.addEventListener('touchmove', draw, getPassiveOptions(false))
      this.el.addEventListener('touchend', end, getPassiveOptions(false))
    })
    const draw = throttle(handleTouch(this._drawingMove), this.delay)
    const end = handleTouch(_param => {
      this.el.removeEventListener('touchmove', draw)
      this.el.removeEventListener('touchend', end)
    })
    this.el.addEventListener('touchstart', start, getPassiveOptions(false))
    this._clearTouchListener = () =>
      this.el.removeEventListener('touchstart', start)
  }
}
