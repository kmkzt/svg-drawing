import { Renderer, RendererOption } from './renderer'
import { Path, Point, Command, COMMAND_TYPE } from './svg'
import { BezierCurve } from './bezier'
import { throttle } from './throttle'
import { getPassiveOptions } from './shared/getPassiveOptions'

export type DrawingOption = RendererOption & {
  penColor?: string
  penWidth?: number
  close?: boolean
  curve?: boolean
  delay?: number
  fill?: string
}

export class SvgDrawing {
  public penColor: string
  public penWidth: number
  public fill: string
  public curve: boolean
  public close: boolean
  public delay: number
  public bezier: BezierCurve
  public renderer: Renderer
  private _drawPath: Path | null
  private _drawMoveThrottle: this['drawMove']
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
    /**
     * Setup parameter
     */
    this.renderer = new Renderer(el, { ...rendOpt })
    this.penColor = penColor ?? '#000'
    this.penWidth = penWidth ?? 1
    this.curve = curve ?? true
    this.close = close ?? false
    this.delay = delay ?? 0
    this.fill = fill ?? 'none'
    this.bezier = new BezierCurve()
    this._drawPath = null
    this._listenerOption = getPassiveOptions(false)
    this._clearPointListener = null
    this._clearMouseListener = null
    this._clearTouchListener = null

    /**
     * Setup listener
     */
    this._handleStart = this._handleStart.bind(this)
    this._handleDraw = this._handleDraw.bind(this)
    this._handleDrawForTouch = this._handleDrawForTouch.bind(this)
    this._handleEnd = this._handleEnd.bind(this)
    this._drawMoveThrottle = throttle(this.drawMove, this.delay)
    this.on()
  }

  public clear(): Path[] {
    const paths = this.renderer.svg.paths
    this.renderer.svg.paths = []
    this.renderer.update()
    return paths
  }

  public undo(): Path | undefined {
    const path = this.renderer.svg.paths.pop()
    this.renderer.update()
    return path
  }

  public changeDelay(delay: number): void {
    this.delay = delay
    this._drawMoveThrottle = throttle(this.drawMove, this.delay)
  }

  public on(): void {
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

  public off(): void {
    ;[
      this._clearPointListener,
      this._clearMouseListener,
      this._clearTouchListener,
    ].map((clear) => {
      if (!clear) return
      clear()
      clear = null
    })
  }

  public drawStart(): void {
    if (this._drawPath) return
    this._drawPath = this._createDrawPath()
    this.renderer.svg.addPath(this._drawPath)
  }

  public drawMove(x: number, y: number): void {
    if (!this._drawPath) return
    const po: [number, number] = [x - this.renderer.left, y - this.renderer.top]
    this._addDrawPoint(po)
    if (
      (this._drawPath.attrs.strokeWidth &&
        +this._drawPath.attrs.strokeWidth !== this.penWidth) ||
      this._drawPath.attrs.stroke !== this.penColor
    ) {
      this._drawPath = this._createDrawPath()
      this._addDrawPoint(po)
      this.renderer.svg.addPath(this._drawPath)
    }
    this.renderer.update()
  }

  public drawEnd(): void {
    if (this.close && this._drawPath) {
      this._drawPath.commands.push(new Command(COMMAND_TYPE.CLOSE))
    }
    this._drawPath = null
    this.renderer.update()
  }

  private get _el(): HTMLElement {
    return this.renderer.el
  }
  private _addDrawPoint(po: [number, number]) {
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
    this.renderer.resizeElement()
    return new Path({
      stroke: this.penColor,
      strokeWidth: String(this.penWidth),
      fill: this.fill,
      strokeLinecap: this.curve ? 'round' : 'mitter',
      strokeLinejoin: this.curve ? 'round' : 'square',
    })
  }

  private _handleStart(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.drawStart()
  }

  private _handleEnd(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.drawEnd()
  }

  private _handleDrawForTouch(ev: TouchEvent) {
    ev.preventDefault()
    const touch = ev.touches[0]
    this._drawMoveThrottle(touch.clientX, touch.clientY)
  }

  private _handleDraw(ev: MouseEvent | PointerEvent) {
    ev.preventDefault()
    this._drawMoveThrottle(ev.clientX, ev.clientY)
  }

  /**
   * Drawing PointerEvent
   */
  private _setupPointEventListener(): void {
    this._el.addEventListener(
      'pointerdown',
      this._handleStart,
      this._listenerOption
    )
    this._el.addEventListener(
      'pointermove',
      this._handleDraw,
      this._listenerOption
    )
    this._el.addEventListener(
      'pointerleave',
      this._handleEnd,
      this._listenerOption
    )
    this._el.addEventListener(
      'pointercancel',
      this._handleEnd,
      this._listenerOption
    )
    window.addEventListener('pointerup', this._handleEnd, this._listenerOption)

    this._clearPointListener = () => {
      this._el.removeEventListener('pointerdown', this._handleStart)
      this._el.removeEventListener('pointermove', this._handleDraw)
      this._el.removeEventListener('pointerleave', this._handleEnd)
      this._el.addEventListener('pointercancel', this._handleEnd)
      window.removeEventListener('pointerup', this._handleEnd)
    }
  }
  /**
   * Drawing MouseEvent
   */
  private _setupMouseEventListener(): void {
    this._el.addEventListener(
      'mousedown',
      this._handleStart,
      this._listenerOption
    )
    this._el.addEventListener(
      'mousemove',
      this._handleDraw,
      this._listenerOption
    )
    this._el.addEventListener(
      'mouseleave',
      this._handleEnd,
      this._listenerOption
    )
    this._el.addEventListener('mouseout', this._handleEnd, this._listenerOption)
    window.addEventListener('mouseup', this._handleEnd, this._listenerOption)

    this._clearMouseListener = () => {
      this._el.removeEventListener('mousedown', this._handleStart)
      this._el.removeEventListener('mousemove', this._handleDraw)
      this._el.removeEventListener('mouseleave', this._handleEnd)
      this._el.removeEventListener('mouseout', this._handleEnd)
      window.removeEventListener('mouseup', this._handleEnd)
    }
  }

  /**
   * Drawing TouchEvent
   */
  private _setupTouchEventListener(): void {
    this._el.addEventListener(
      'touchstart',
      this._handleStart,
      this._listenerOption
    )
    this._el.addEventListener(
      'touchmove',
      this._handleDrawForTouch,
      this._listenerOption
    )
    this._el.addEventListener('touchend', this._handleEnd, this._listenerOption)
    window.addEventListener(
      'touchcancel',
      this._handleEnd,
      this._listenerOption
    )
    this._clearTouchListener = () => {
      this._el.removeEventListener('touchstart', this._handleStart)
      this._el.removeEventListener('touchmove', this._handleDrawForTouch)
      this._el.removeEventListener('touchend', this._handleEnd)
      window.removeEventListener('touchcancel', this._handleEnd)
    }
  }
}
