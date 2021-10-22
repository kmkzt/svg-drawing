import { BasicDrawFactory } from './factory'
import { PencilHandler } from './handler'
import { download } from '../download'
import { Renderer } from '../renderer'
import { Path, Svg } from '../svg'
import { isAlmostSameNumber } from '../utils'
import type {
  DownloadOption,
  DrawHandler,
  DrawingOption,
  PointObject,
  DrawFactory,
  ResizeCallback,
} from '../types'

/**
 * @example <caption>Default.</caption>
 *   import { SvgDrawing } from '@svg-drawing/core'
 *
 *   const el = document.getElementById('draw')
 *
 *   SvgDrawing.init(el)
 *
 *   // Options
 *   SvgDrawing.init(el, {
 *     curve: true,
 *     close: false,
 *     penColor: '#00f',
 *     penWidth: 10,
 *     fill: '#F00',
 *     background: '#ff0',
 *   })
 *
 * @example <caption>Customize.</caption>
 *   import {
 *     Svg,
 *     SvgDrawing,
 *     PenHandler,
 *     Renderer,
 *     BasicDrawFactory,
 *   } from '@svg-drawing/core'
 *
 *   const el = document.getElementById('draw')
 *   const { width, height } = el.getBoundingClientRect()
 *
 *   new SvgDrawing(
 *     new Svg({ width, height }),
 *     new BasicDrawFactory({ stroke: '#000' }),
 *     new PenHandler(el),
 *     new Renderer(el).update
 *   )
 *
 * @class SvgDrawing
 * @export
 * @todo Separate SvgDrawing and Drawing
 */
export class SvgDrawing<
  S extends Svg = Svg,
  P extends DrawFactory = BasicDrawFactory,
  H extends DrawHandler = PencilHandler
> {
  private _drawPath: Path | null
  private _drawPoints: PointObject[]
  constructor(
    public svg: S,
    public pathFactory: P,
    public handler: H,
    private update: (svg: Svg) => void
  ) {
    /** Setup property */
    this._drawPath = null
    this._drawPoints = []

    /** Setup methods */
    this.resize = this.resize.bind(this)

    /** Setup EventDrawHandler */
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
    const po =
      this._drawPath?.commands[
        this._drawPath.commands.length - 1
      ]?.point?.clone()
    if (!po) return
    this._drawPath = this._createDrawPath()
    this._addDrawPoint(po.toJson())
    this.svg.addPath(this._drawPath)
  }

  public drawEnd(): void {
    this._drawPath = null
    this.update(this.svg)
  }

  public resize({ width, height }: Parameters<ResizeCallback>[0]) {
    if (isAlmostSameNumber(this.svg.width, width)) return

    this.svg.resize({ width, height })
    this.update(this.svg)
  }

  /** @deprecated */
  public download(opt?: DownloadOption): void {
    download(this.svg, opt)
  }

  /**
   * @deprecated
   * @todo Separate methods
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

    return new SvgDrawing(
      new Svg({ width, height, background }),
      new BasicDrawFactory(
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
    return this.pathFactory.createPath()
  }
}
