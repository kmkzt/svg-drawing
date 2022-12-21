import type { DrawingClass } from '..'
import type { EventPoint, DrawFactory, PathClass, SvgClass } from '../types'

/**
 * ### Basic Drawing usage.
 *
 * ```ts
 * import {
 *   Svg,
 *   Drawing,
 *   PenHandler,
 *   Renderer,
 *   BasicDrawFactory,
 * } from '@svg-drawing/core'
 *
 * const el = document.getElementById('draw')
 * const { width, height } = el.getBoundingClientRect()
 *
 * new Drawing(
 *   new Svg({ width, height }),
 *   new BasicDrawFactory({ stroke: '#000' }),
 *   new PenHandler(el),
 *   new Renderer(el).update
 * )
 * ```
 */
export class Drawing implements DrawingClass {
  private _drawPath: PathClass | null
  private _drawPoints: EventPoint[]
  constructor(
    public svg: SvgClass,
    public pathFactory: DrawFactory,
    private update: (svg: SvgClass) => void
  ) {
    /** Setup property */
    this._drawPath = null
    this._drawPoints = []

    /** Setup EventDrawHandler */
    this.start = this.start.bind(this)
    this.dot = this.dot.bind(this)
    this.end = this.end.bind(this)
  }

  public start(): void {
    this._drawPoints = []
    this._drawPath = this.pathFactory.createPath()
    this.svg.addElement(this._drawPath)
  }

  public dot(po: EventPoint): void {
    if (!this._drawPath) return

    this._drawPoints.push(po)
    this._drawPath.setCommands(this.pathFactory.createCommand(this._drawPoints))

    this.update(this.svg)
  }

  public end(): void {
    this._drawPath = null
    this.update(this.svg)
  }
}
