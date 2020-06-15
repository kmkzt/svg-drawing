import { Renderer, RendererOption } from './renderer'
import { Path, Point, Command, COMMAND_TYPE } from './svg'
import { BezierCurve } from './bezier'
import { throttle } from './throttle'
import { getPassiveOptions } from './utils/getPassiveOptions'

export interface DrawingOption extends RendererOption {
  penColor?: string
  penWidth?: number
  close?: boolean
  curve?: boolean
  delay?: number
  fill?: string
}

export class SvgDrawing extends Renderer {
  public penColor: string
  public penWidth: number
  public fill: string
  public curve: boolean
  public close: boolean
  public delay: number
  public bezier: BezierCurve
  private _drawPath: Path | null
  private _listenerOption: ReturnType<typeof getPassiveOptions>
  private _clearPointListener: (() => void) | null
  private _clearMouseListener: (() => void) | null
  private _clearTouchListener: (() => void) | null
  constructor(
    el: HTMLElement,
    {
      penColor,
      penWidth,
      curve,
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
    this.curve = curve ?? true
    this.close = close ?? false
    this.delay = delay ?? 20
    this.fill = fill ?? 'none'
    this.bezier = new BezierCurve()
    this._drawPath = null
    this._listenerOption = getPassiveOptions(false)
    this._clearPointListener = null
    this._clearMouseListener = null
    this._clearTouchListener = null
    this.drawingMove = this.drawingMove.bind(this) // for throttle
    this.on()
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
    this.on()
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

  public drawingStart() {
    if (this._drawPath) return
    this._drawPath = this._createDrawPath()
    this.addPath(this._drawPath)
  }

  public drawingMove({ x, y }: { x: number; y: number }): void {
    if (!this._drawPath) return
    const po = this._createDrawPoint({ x, y })
    this._addDrawPoint(po)
    if (
      this._drawPath.strokeWidth !== this.penWidth ||
      this._drawPath.stroke !== this.penColor
    ) {
      this._drawPath = this._createDrawPath()
      this._addDrawPoint(po)
      this.addPath(this._drawPath)
    }
    this.update()
  }

  public drawingEnd() {
    if (this.close && this._drawPath) {
      this._drawPath.commands.push(new Command(COMMAND_TYPE.CLOSE))
    }
    this._drawPath = null
    this.update()
  }

  private _addDrawPoint(po: number[]) {
    if (!this._drawPath) return
    const commands = this._drawPath.commands
    if (
      commands.length === 0 ||
      commands[commands.length - 1].type === COMMAND_TYPE.CLOSE
    ) {
      commands.push(new Command(COMMAND_TYPE.MOVE, po))
      return
    }

    if (!this.curve || commands.length < 2) {
      commands.push(new Command(COMMAND_TYPE.LINE, po))
      return
    }

    const p1 =
      commands.length === 2
        ? commands[commands.length - 2].point
        : commands[commands.length - 3].point
    const p2 = commands[commands.length - 2].point
    const p3 = commands[commands.length - 1].point

    if (!p1 || !p2 || !p3) {
      commands.push(new Command(COMMAND_TYPE.LINE, po))
      return
    }

    const p4 = new Point(po[0], po[1])
    commands[commands.length - 1] = this.bezier.createCommand(p1, p2, p3, p4)
    commands.push(this.bezier.createCommand(p2, p3, p4, p4))
  }

  private _createDrawPath(): Path {
    this.resizeElement()
    return new Path({
      stroke: this.penColor,
      strokeWidth: this.penWidth,
      attrs: {
        strokeLinecap: this.curve ? 'round' : 'mitter',
        strokeLinejoin: this.curve ? 'round' : 'square'
      },
      fill: this.fill
    })
  }
  private _createDrawPoint({
    x,
    y
  }: {
    x: number
    y: number
  }): [number, number] {
    return [x - this.left, y - this.top]
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
      this.drawingStart()
      this.el.addEventListener('pointermove', draw, this._listenerOption)
      this.el.addEventListener('pointerup', end, this._listenerOption)
      this.el.addEventListener('pointerleave', end, this._listenerOption)
      this.el.addEventListener('pointercancel', end, this._listenerOption)
    })
    const draw = throttle(handleMouse(this.drawingMove), this.delay)
    const end = handleMouse((param: { x: number; y: number }) => {
      this.el.removeEventListener('pointermove', draw)
      this.el.removeEventListener('pointerup', end)
      this.el.removeEventListener('pointerleave', end)
      this.el.addEventListener('pointercancel', end)
      this.drawingEnd()
    })
    this.el.addEventListener('pointerdown', start, this._listenerOption)
    this._clearPointListener = () =>
      this.el.removeEventListener('pointerdown', start)
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
      this.drawingStart()
      this.el.addEventListener('mousemove', draw, this._listenerOption)
      this.el.addEventListener('mouseup', end, this._listenerOption)
      this.el.addEventListener('mouseleave', end, this._listenerOption)
    })
    const draw = throttle(handleMouse(this.drawingMove), this.delay)
    const end = handleMouse(_param => {
      this.el.removeEventListener('mousemove', draw)
      this.el.removeEventListener('mouseup', end)
      this.el.removeEventListener('mouseleave', end)
      this.drawingEnd()
    })
    this.el.addEventListener('mousedown', start, this._listenerOption)
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
      this.drawingStart()
      this.el.addEventListener('touchmove', draw, this._listenerOption)
      this.el.addEventListener('touchend', end, this._listenerOption)
    })
    const draw = throttle(handleTouch(this.drawingMove), this.delay)
    const end = handleTouch(_param => {
      this.el.removeEventListener('touchmove', draw)
      this.el.removeEventListener('touchend', end)
      this.drawingEnd()
    })
    this.el.addEventListener('touchstart', start, this._listenerOption)
    this._clearTouchListener = () =>
      this.el.removeEventListener('touchstart', start)
  }
}
