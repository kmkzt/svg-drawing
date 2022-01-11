import { isAlmostSameNumber } from '../utils'
import type {
  EventPoint,
  DrawEventHandler,
  DrawFactory,
  ResizeCallback,
  PathClass,
  SvgClass,
} from '../types'

/**
 * @example
 *   import {
 *     Svg,
 *     Drawing,
 *     PenHandler,
 *     Renderer,
 *     BasicDrawFactory,
 *   } from '@svg-drawing/core'
 *
 *   const el = document.getElementById('draw')
 *   const { width, height } = el.getBoundingClientRect()
 *
 *   new Drawing(
 *     new Svg({ width, height }),
 *     new BasicDrawFactory({ stroke: '#000' }),
 *     new PenHandler(el),
 *     new Renderer(el).update
 *   )
 */
export class Drawing {
  private _drawPath: PathClass | null
  private _drawPoints: EventPoint[]
  constructor(
    public svg: SvgClass,
    public pathFactory: DrawFactory,
    public handler: DrawEventHandler,
    private update: (svg: SvgClass) => void
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

  public clear(): PathClass[] {
    const paths = this.svg.paths
    this.svg.paths = []
    this.update(this.svg)
    return paths
  }

  public undo(): PathClass | undefined {
    const path = this.svg.paths.pop()
    this.update(this.svg)
    return path
  }

  public drawStart(): void {
    this._drawPoints = []
    this._drawPath = this.pathFactory.createPath()
    this.svg.addPath(this._drawPath)
  }

  public drawMove(po: EventPoint): void {
    if (!this._drawPath) return

    this._drawPoints.push(po)
    this._drawPath.commands = this.pathFactory.createCommand(this._drawPoints)

    this.update(this.svg)
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
}
