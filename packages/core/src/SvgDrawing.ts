import { Drawing } from './drawing/drawing'
import { BasicDrawFactory } from './drawing/factory'
import { PencilHandler } from './event/pencilHandler'
import { SvgRenderer } from './renderer/svgRenderer'
import { Svg } from './svg/svg'
import type {
  DrawingOption,
  EventHandler,
  SvgClass,
  DrawingClass,
  SvgObject,
  EventPoint,
  ElementClass,
} from './types'

/**
 * ### Setup SvgDrawing
 *
 * ```ts
 * import { SvgDrawing } from '@svg-drawing/core'
 *
 * const el = document.getElementById('draw-area')
 * new SvgDrawing(el)
 * ```
 *
 * ### Set draw options.
 *
 * ```ts
 * // It is default value
 * const options = {
 *   penColor: '#000',
 *   penWidth: 1,
 *   curve: true,
 *   close: false,
 *   delay: 0,
 *   fill: 'none',
 *   background: undefined,
 * }
 *
 * new SvgDrawing(el, options)
 * ```
 */
export class SvgDrawing {
  private svg: SvgClass
  private drawing: DrawingClass
  private factory: BasicDrawFactory
  private handler: EventHandler<HTMLElement>
  private renderer: SvgRenderer
  constructor(
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

    this.renderer = new SvgRenderer(el, { background })

    this.svg = new Svg({ width, height, background })

    this.factory = new BasicDrawFactory(
      {
        stroke: penColor ?? '#000',
        strokeWidth: penWidth || penWidth === 0 ? String(penWidth) : '1',
        fill: fill ?? 'none',
      },
      { curve, close }
    )

    this.drawing = new Drawing(this.svg, this.factory, this.renderer.render)

    const pencilHandler = new PencilHandler(this.drawing)
    this.handler = pencilHandler
    pencilHandler.changeDelay(delay)
    this.handler.setup(el)
  }

  public toJson(): SvgObject {
    return this.svg.toJson()
  }

  public drawStart(): void {
    this.drawing.start()
  }

  public drawMove(po: EventPoint): void {
    this.drawing.dot(po)
  }

  public drawEnd(): void {
    this.drawing.end()
  }

  public changeCurve(curve: boolean): void {
    this.factory.changeCurve(curve)
  }

  public changeClose(close: boolean): void {
    this.factory.changeClose(close)
  }

  public clear() {
    const paths = this.svg.elements
    this.svg.setElements([])
    this.renderer.render({ svg: this.svg.toJson() })
    return paths
  }

  public undo(): ElementClass | undefined {
    const lastElement = this.svg.elements[this.svg.elements.length - 1].clone()
    this.svg.deleteElement(lastElement)

    this.renderer.render({ svg: this.svg.toJson() })
    return lastElement
  }
}
