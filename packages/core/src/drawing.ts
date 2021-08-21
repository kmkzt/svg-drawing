import { Renderer } from './renderer'
import { Path, Svg } from './svg'
import {
  BezierCurve,
  CommandsConverter,
  convertLineCommands,
  closeCommands,
} from './convert'
import { throttle } from './throttle'
import { PencilHandler, DrawHandler, ResizeHandler } from './handler'
import {
  DownloadOption,
  DrawingOption,
  PointObject,
  ResizeHandlerOption,
} from './types'
import { isAlmostSameNumber } from './utils'
import { download } from './download'

export class SvgDrawing {
  /**
   * Draw Option
   */
  public penColor: string
  public penWidth: number
  public fill: string
  /**
   * @deprecated
   */
  public curve: boolean
  /**
   * @deprecated
   */
  public close: boolean
  public delay: number
  /**
   * Module
   */
  /**
   * Private property
   */
  private _drawPath: Path | null
  private _drawPoints: PointObject[]
  private _drawMoveThrottle: this['drawMove']
  constructor(
    public svg: Svg,
    public renderer: Renderer,
    public drawHandler: any extends DrawHandler ? DrawHandler : never,
    public resizeHandler: ResizeHandler,
    { penColor, penWidth, curve, close, delay, fill }: DrawingOption = {}
  ) {
    /**
     * Setup Config
     */
    this.penColor = penColor ?? '#000'
    this.penWidth = penWidth ?? 1
    this.curve = curve ?? true
    this.close = close ?? false
    this.fill = fill ?? 'none'
    /**
     * Setup property
     */
    this.delay = delay ?? 0
    this._drawPath = null
    this._drawPoints = []

    /**
     * Setup ResizeHandler
     */
    this._resize = this._resize.bind(this)
    this.resizeHandler.resize = this._resize.bind(this)
    /**
     * Setup EventDrawHandler
     */
    this.drawStart = this.drawStart.bind(this)
    this.drawMove = this.drawMove.bind(this)
    this._drawMoveThrottle = throttle(this.drawMove, this.delay)
    this.drawEnd = this.drawEnd.bind(this)

    this.drawHandler.start = this.drawStart
    this.drawHandler.move = this._drawMoveThrottle
    this.drawHandler.end = this.drawEnd
    /**
     * Start exec
     */
    this.on()
  }

  public update() {
    this.renderer.update(this.svg.toJson())
  }
  public clear(): Path[] {
    const paths = this.svg.paths
    this.svg.paths = []
    this.update()
    return paths
  }

  public undo(): Path | undefined {
    const path = this.svg.paths.pop()
    this.update()
    return path
  }

  public changeDelay(delay: number): void {
    this.delay = delay
    this.drawHandler.move = throttle(this.drawMove, this.delay)
    this.drawHandler.on()
  }

  public on(): void {
    this.drawHandler.on()
    this.resizeHandler.on()
  }

  public off(): void {
    this.drawHandler.off()
    this.resizeHandler.off()
  }

  public drawStart(): void {
    if (this._drawPath) return
    this._drawPath = this._createDrawPath()
    this.svg.addPath(this._drawPath)
  }

  public drawMove(po: PointObject): void {
    if (!this._drawPath) return
    this._addDrawPoint(po)
    this.update()
  }

  public switchPath() {
    const po = this._drawPath?.commands[
      this._drawPath.commands.length - 1
    ].point?.clone()
    if (!po) return
    this._drawPath = this._createDrawPath()
    this._addDrawPoint(po.toJson())
    this.svg.addPath(this._drawPath)
  }

  public drawEnd(): void {
    this._drawPath = null
    this.update()
  }

  /**
   * @TODO Allow the conversion part to be passed from the outside.
   */
  private get _converter(): CommandsConverter {
    const converter = this.curve
      ? new BezierCurve().convert
      : convertLineCommands
    return (po) => (this.close ? closeCommands(converter(po)) : converter(po))
  }

  private _createCommand() {
    if (!this._drawPath) return
    this._drawPath.commands = this._converter(this._drawPoints)
  }

  private _addDrawPoint(p4: PointObject) {
    this._drawPoints.push(p4)
    this._createCommand()
  }

  private _createDrawPath(): Path {
    // this._resize(this.el.getBoundingClientRect())
    this._drawPoints = []
    return new Path({
      stroke: this.penColor,
      strokeWidth: String(this.penWidth),
      fill: this.fill,
      strokeLinecap: this.curve ? 'round' : 'mitter',
      strokeLinejoin: this.curve ? 'round' : 'square',
    })
  }

  /**
   */
  private _resize({
    width,
    height,
  }: Parameters<ResizeHandlerOption['resize']>[0]) {
    if (!isAlmostSameNumber(this.svg.width, width)) {
      this.svg.resize({ width, height })
      this.update()
    }
  }

  public download(opt?: DownloadOption): void {
    download(this.svg, opt)
  }

  public static init(el: HTMLElement, opts: DrawingOption = {}): SvgDrawing {
    const { width, height } = el.getBoundingClientRect()

    const dummyHandler = () => undefined

    return new SvgDrawing(
      new Svg({ width, height, background: opts.background }),
      new Renderer(el, { background: opts.background }),
      new PencilHandler({
        el,
        start: dummyHandler,
        move: dummyHandler,
        end: dummyHandler,
      }),
      new ResizeHandler({
        el,
        resize: dummyHandler,
      }),
      opts
    )
  }
}
