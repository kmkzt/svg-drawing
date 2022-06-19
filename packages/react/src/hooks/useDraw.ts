import { Drawing } from '@svg-drawing/core'
import { useCallback, useMemo } from 'react'
import { useRenderInterval } from './useRenderInterval'
import type { UseDraw } from '../types'

/**
 * ### Basic usage.
 *
 * ```ts
 * import { PencilHandler } from '@svg-drawing/core'
 * import {
 *   Svg,
 *   useDrawFactory,
 *   useDrawEventHandler,
 * } from '@svg-drawing/react'
 *
 * const DrawArea = () => {
 *   const svg = useSvg({ width: 500, height: 500 })
 *   const [svgObject, setSvgObject] = useState(svg.toJson())
 *
 *   const factory = useDrawFactory(
 *     { stroke: '#000', fill: 'none' },
 *     { curve: true, close: false }
 *   )
 *
 *   const draw = useDraw({
 *     svg,
 *     factory,
 *     onChangeSvg: setSvgObject,
 *   })
 *
 *   const ref = useRef(null)
 *   const handler = usePencilHandler(ref, draw, true)
 *
 *   return (
 *     <div ref={ref}>
 *       <Svg {...svgObject} />
 *     </div>
 *   )
 * }
 * ```
 */
export const useDraw: UseDraw = ({ factory, svg, onChangeSvg }) => {
  const render = useRenderInterval()

  const update = useCallback(() => {
    render(() => onChangeSvg(svg.toJson()))
  }, [render, onChangeSvg, svg])

  const draw = useMemo(
    () => new Drawing(svg, factory, update),
    [svg, factory, update]
  )

  const clear = useCallback(() => {
    const paths = svg.paths
    svg.paths = []
    update()
    return paths
  }, [svg, update])

  const undo = useCallback(() => {
    const path = svg.paths.pop()
    update()
    return path
  }, [svg.paths, update])

  return {
    draw,
    update,
    clear,
    undo,
  }
}
