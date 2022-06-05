import { Drawing } from './drawing/drawing'
import { BasicDrawFactory } from './drawing/factory'
import { PencilHandler } from './eventHandler/drawEventHandler'
import { Renderer } from './renderer'
import { Svg } from './svg/svg'
import { isAlmostSameNumber } from './utils'
import type {
  DrawingOption,
  DrawEventHandler,
  SvgClass,
  DrawingClass,
  PathClass,
  ResizeCallback,
  SvgObject,
  EventPoint,
} from './types'

/**
 * @example
 *   import { SvgDrawing } from '@svg-drawing/core'
 *
 *   const el = document.getElementById('draw')
 *
 *   new SvgDrawing(el)
 *
 *   // Options
 *   new SvgDrawing(el, {
 *     curve: true,
 *     close: false,
 *     penColor: '#00f',
 *     penWidth: 10,
 *     fill: '#F00',
 *     background: '#ff0',
 *   })
 */
export class SvgDrawing {
  private svg: SvgClass
  private drawing: DrawingClass
  private factory: BasicDrawFactory
  private handler: DrawEventHandler
  private renderer: Renderer
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

    this.renderer = new Renderer(el, { background })

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

  public clear(): PathClass[] {
    const paths = this.svg.paths
    this.svg.paths = []
    this.update()
    return paths
  }

  public undo(): PathClass | undefined {
    const path = this.svg.paths.pop()
    this.update()
    return path
  }

  private update(): void {
    this.renderer.update({ svg: this.svg.toJson() })
  }

  public resize({ width, height }: Parameters<ResizeCallback>[0]) {
    if (isAlmostSameNumber(this.svg.width, width)) return

    this.svg.resize({ width, height })
    this.update()
  }
}
