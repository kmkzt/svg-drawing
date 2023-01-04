import { Drawing } from './drawing/drawing'
import { PencilHandler } from './drawing/eventHandler'
import { BasicDrawFactory } from './drawing/factory'
import { SvgRenderer } from './renderer/svgRenderer'
import { Svg } from './svg/svg'
import type {
  DrawingOption,
  DrawEventHandler,
  SvgClass,
  DrawingClass,
  PathClass,
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
  private handler: DrawEventHandler
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

    this.update = this.update.bind(this)

    this.svg = new Svg({ width, height, background })

    this.factory = new BasicDrawFactory(
      {
        stroke: penColor ?? '#000',
        strokeWidth: penWidth || penWidth === 0 ? String(penWidth) : '1',
        fill: fill ?? 'none',
      },
      { curve, close }
    )

    this.drawing = new Drawing(this.svg, this.factory, this.update)

    const pencilHandler = new PencilHandler(this.drawing, el)
    this.handler = pencilHandler
    pencilHandler.changeDelay(delay)
    this.handler.on()
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

  public toJson(): SvgObject {
    return this.svg.toJson()
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
    this.update()
    return paths
  }

  public undo(): ElementClass | undefined {
    const lastElement = this.svg.elements[this.svg.elements.length - 1].clone()
    this.svg.deleteElement(lastElement)

    this.update()
    return lastElement
  }

  private update(): void {
    this.renderer.update({ svg: this.svg.toJson() })
  }
}
