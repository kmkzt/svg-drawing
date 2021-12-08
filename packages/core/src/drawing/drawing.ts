import { isAlmostSameNumber } from '../utils'
import type { Path, Svg } from '../svg'
import type {
  DrawHandler,
  PointObject,
  DrawFactory,
  ResizeCallback,
} from '../types'
import type { BasicDrawFactory } from './factory'
import type { PencilHandler } from './handler'

export class Drawing<
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

  private _createCommand() {
    if (!this._drawPath) return

    /** @todo Refactor */
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
