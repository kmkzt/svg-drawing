import type { DrawingClass } from '..'
import type {
  EventPoint,
  DrawFactory,
  PathClass,
  SvgClass,
  ElementKey,
} from '../types'

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
  private _drawElementKey: ElementKey | null
  private _drawPoints: EventPoint[]
  constructor(
    public svg: SvgClass,
    public pathFactory: DrawFactory,
    private update: (svg: SvgClass) => void
  ) {
    /** Setup property */
    this._drawElementKey = null
    this._drawPoints = []

    /** Setup EventDrawHandler */
    this.start = this.start.bind(this)
    this.dot = this.dot.bind(this)
    this.end = this.end.bind(this)
  }

  private getDrawElement(): PathClass | undefined {
    return this._drawElementKey
      ? this.svg.getElement(this._drawElementKey)
      : undefined
  }

  public start(): void {
    const drawElement = this.pathFactory.createElement()

    this._drawElementKey = drawElement.key
    this.svg.addElement(drawElement)
  }

  public dot(po: EventPoint): void {
    const drawElement = this.getDrawElement()

    if (!drawElement) return

    this._drawPoints.push(po)

    this.pathFactory.updateElement(drawElement, this._drawPoints)
    this.svg.updateElement(drawElement)

    this.update(this.svg)
  }

  public end(): void {
    this._drawPoints = []
    this._drawElementKey = null
  }
}
