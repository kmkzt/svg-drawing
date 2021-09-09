import { Renderer } from '../renderer'
import { Path, Svg } from '../svg'
import { PencilHandler } from './handler'
import { BasicPathFactory } from './pathFactory'
import { isAlmostSameNumber } from '../utils'
import { download } from '../download'
import type {
  DownloadOption,
  DrawEventHandler,
  DrawingOption,
  PointObject,
  PathFactory,
  ResizeCallback,
} from '../types'

export class SvgDrawing<
  S extends Svg,
  P extends PathFactory,
  H extends DrawEventHandler
> {
  private _drawPath: Path | null
  private _drawPoints: PointObject[]
  constructor(
    public svg: S,
    public pathFactory: P,
    public handler: H,
    private update: (svg: Svg) => void
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
  }

  public clear(): Path[] {
    const paths = this.svg.paths
    this.svg.paths = []
    this.update(this.svg)
    return paths
  }

  public undo(): Path | undefined {
    const path = this.svg.paths.pop()
    this.update(this.svg)
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
    this.update(this.svg)
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
    this.update(this.svg)
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
    this.update(this.svg)
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
    }: DrawingOption = {}
  ) {
    const { width, height } = el.getBoundingClientRect()

    const handler = new PencilHandler(el)
    handler.changeDelay(delay)
    handler.on()

    return new SvgDrawing<Svg, BasicPathFactory, PencilHandler>(
      new Svg({ width, height, background }),
      new BasicPathFactory(
        {
          stroke: penColor ?? '#000',
          strokeWidth: penWidth || penWidth === 0 ? String(penWidth) : '1',
          fill: fill ?? 'none',
        },
        { curve, close }
      ),
      handler,
      new Renderer(el, { background }).update
    )
  }
}
