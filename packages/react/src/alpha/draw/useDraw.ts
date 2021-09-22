import { SvgDrawing } from '@svg-drawing/core'
import { useCallback, useMemo } from 'react'
import { useSvg } from '../svg/useSvg'
import type { UseDraw, DrawAction } from '../types'

/**
 * @example
 *   import { PencilHandler } from '@svg-drawing/core'
 *   import {
 *     Svg,
 *     useDrawFactory,
 *     useDrawEventHandler,
 *   } from '@svg-drawing/react'
 *
 *   const DrawArea = () => {
 *     const ref = useRef(null)
 *     const handler = useDrawEventHandler(ref, PencilHandler, true)
 *
 *     const factory = useDrawFactory(
 *       { stroke: '#000', fill: 'none' },
 *       { curve: true, close: false }
 *     )
 *
 *     const [svgProps, draw] = useDraw({
 *       handler,
 *       factory,
 *     })
 *
 *     return (
 *       <div ref={ref}>
 *         <Svg {...svgProps} />
 *       </div>
 *     )
 *   }
 */
export const useDraw: UseDraw = ({ factory, handler, ...useSvgOption }) => {
  const [svgObj, { svg, onUpdate, ...rest }] = useSvg(useSvgOption)
  const drawing = useMemo(
    () => new SvgDrawing(svg, factory, handler, onUpdate),
    [factory, handler, onUpdate, svg]
  )

  const onUndoDraw = useCallback<DrawAction['onUndoDraw']>(
    () => drawing.undo(),
    [drawing]
  )

  return [
    svgObj,
    {
      svg,
      onUndoDraw,
      onUpdate,
      ...rest,
    },
  ]
}
