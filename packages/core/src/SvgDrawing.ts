import { Drawing } from './drawing'
import { BasicDrawFactory } from './drawing/factory'
import { PencilHandler } from './drawing/handler'
import { Renderer } from './renderer'
import { Svg } from './svg'
import type { DrawingOption } from './types'

/**
 * @example
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
 */
export class SvgDrawing {
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

    return new Drawing(
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
      (svg) => new Renderer(el, { background }).update({ svg: svg.toJson() })
    )
  }
}
