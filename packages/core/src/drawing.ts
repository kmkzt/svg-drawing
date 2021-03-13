import { Renderer, RendererOption } from './renderer'
import { Path, Point, Command, COMMAND_TYPE } from './svg'
import { BezierCurve } from './bezier'
import { throttle } from './throttle'
import { Handler } from './handler'

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
  public handler: Handler
  private _drawPath: Path | null
  private _drawMoveThrottle: this['drawMove']
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
     * Setup Config
     */
    this.penColor = penColor ?? '#000'
    this.penWidth = penWidth ?? 1
    this.curve = curve ?? true
    this.close = close ?? false
    this.delay = delay ?? 0
    this.fill = fill ?? 'none'
    /**
     * Setup property
     */
    this._drawPath = null
    /**
     * Setup EventHandler
     */
    this.drawStart = this.drawStart.bind(this)
    this.drawMove = this.drawMove.bind(this)
    this._drawMoveThrottle = throttle(this.drawMove, this.delay)
    this.drawEnd = this.drawEnd.bind(this)
    this.handler = new Handler(el, {
      start: this.drawStart,
      move: this._drawMoveThrottle,
      end: this.drawEnd,
    })
    /**
     * Setup Renderer
     */
    this.renderer = new Renderer(el, { ...rendOpt })
    /**
     * Setup BezierCurve
     */
    this.bezier = new BezierCurve()
    /**
     * Start exec
     */
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
    this.handler.move = throttle(this.drawMove, this.delay)
    this.handler.on()
  }

  public on(): void {
    this.handler.on()
  }

  public off(): void {
    this.handler.off()
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
}
