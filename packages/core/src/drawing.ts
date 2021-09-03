import { Renderer } from './renderer'
import { Path, Svg } from './svg'
import { PencilHandler } from './handler'
import { BasicPathFactory } from './pathFactory'
import { isAlmostSameNumber } from './utils'
import { download } from './download'
import type {
  DownloadOption,
  DrawEventHandler,
  DrawingOption,
  PointObject,
  PathFactory,
  ResizeCallback,
} from './types'

export class SvgDrawing<
  S extends Svg,
  P extends PathFactory,
  RN extends Renderer,
  H extends DrawEventHandler
> {
  private _drawPath: Path | null
  private _drawPoints: PointObject[]
  constructor(
    public svg: S,
    public pathFactory: P,
    public renderer: RN,
    public handler: H
  ) {
    /**
     * Setup property
     */
    this._drawPath = null
    this._drawPoints = []

    /**
     * Setup methods
     */
    this.resize = this.resize.bind(this)

    /**
     * Setup EventDrawHandler
     */
    this.drawStart = this.drawStart.bind(this)
    this.drawMove = this.drawMove.bind(this)
    this.drawEnd = this.drawEnd.bind(this)

    this.handler.setHandler({
      drawStart: this.drawStart,
      drawMove: this.drawMove,
      drawEnd: this.drawEnd,
    })

    /**
     * Start exec
     */
    this.handler.on()
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

  private _createCommand() {
    if (!this._drawPath) return
    this._drawPath.commands = this.pathFactory.createCommand(this._drawPoints)
  }

  private _addDrawPoint(p4: PointObject) {
    this._drawPoints.push(p4)
    this._createCommand()
  }

  private _createDrawPath(): Path {
    this._drawPoints = []
    return this.pathFactory.create()
  }

  public resize({ width, height }: Parameters<ResizeCallback>[0]) {
    if (isAlmostSameNumber(this.svg.width, width)) return

    this.svg.resize({ width, height })
    this.update()
  }

  public download(opt?: DownloadOption): void {
    download(this.svg, opt)
  }

  /**
   * @todo remove dummy handler
   */
  public static init(
    el: HTMLElement,
    {
      curve = true,
      close = false,
      delay = 0,
      penColor,
      penWidth,
      fill,
      background,
    }: DrawingOption
  ) {
    const { width, height } = el.getBoundingClientRect()

    return new SvgDrawing<Svg, BasicPathFactory, Renderer, PencilHandler>(
      new Svg({ width, height, background }),
      new BasicPathFactory(
        {
          stroke: penColor ?? '#000',
          strokeWidth: penWidth || penWidth === 0 ? String(penWidth) : '1',
          fill: fill ?? 'none',
        },
        { curve, close }
      ),
      new Renderer(el, { background }),
      new PencilHandler(el, delay)
    )
  }
}
