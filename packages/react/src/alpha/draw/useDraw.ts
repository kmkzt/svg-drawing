import { useCallback, useMemo } from 'react'
import { SvgDrawing } from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type { UseDraw, DrawAction, KeyboardMap } from '../types'

/**
 * @example
 *   import { PencilHandler } from '@svg-drawing/core'
 *   import { Svg, useDrawFactory, useDrawHandler } from '@svg-drawing/react'
 *
 *   const DrawArea = () => {
 *     const ref = useRef(null)
 *     const handler = useDrawHandler(ref, PencilHandler, true)
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
export const useDraw: UseDraw = ({ factory, handler, sharedSvg }) => {
  const [svgObj, { svg, onUpdate, ...rest }] = useSvg({
    sharedSvg,
  })
  const drawing = useMemo(
    () => new SvgDrawing(svg, factory, handler, onUpdate),
    [factory, handler, onUpdate, svg]
  )

  const onUndoDraw = useCallback<DrawAction['onUndoDraw']>(() => {
    drawing.undo()
  }, [drawing])

  /** @fixme Doesn't work!! */
  const keyboardMap = useMemo<KeyboardMap>(
    () => ({
      ['Escape']: drawing.drawEnd,
    }),
    [drawing.drawEnd]
  )

  return [
    svgObj,
    {
      svg,
      onUndoDraw,
      onUpdate,
      keyboardMap,
      ...rest,
    },
  ]
}
