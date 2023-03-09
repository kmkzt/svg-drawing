import { Drawing } from '@svg-drawing/core'
import { useCallback, useMemo } from 'react'
import { useRenderInterval } from './useRenderInterval'
import type { UseDraw } from '../types'
import type { SvgObject } from '@svg-drawing/core'

/**
 * @example <caption>Basic usage</caption>
 *
 * ```ts
 * import { PencilHandler } from '@svg-drawing/core'
 * import {
 *   Svg,
 *   Path,
 *   useDrawFactory,
 *   useDrawEventHandler,
 * } from '@svg-drawing/react'
 *
 * const DrawArea = () => {
 *   const svg = useSvg({ width: 500, height: 500 })
 *   const [{ width, height, background, paths }, onChangeSvg] = useState(
 *     svg.toJson()
 *   )
 *
 *   const factory = useDrawFactory(
 *     { stroke: '#000', fill: 'none' },
 *     { curve: true, close: false }
 *   )
 *
 *   const draw = useDraw({
 *     svg,
 *     factory,
 *     onChangeSvg,
 *   })
 *
 *   const ref = useRef(null)
 *   const handler = usePencilHandler(ref, draw, true)
 *
 *   return (
 *     <div ref={ref}>
 *       <Svg width={width} height={height} background={background}>
 *         {paths.map(({ key, attributes }) => (
 *           <Path key={key} pathKey={pathKey} {...attributes} />
 *         ))}
 *       </Svg>
 *     </div>
 *   )
 * }
 * ```
 */
export const useDraw: UseDraw = ({ factory, svg, onChangeSvg }) => {
  const render = useRenderInterval()

  const update = useCallback(() => {
    onChangeSvg(svg.toJson())
  }, [onChangeSvg, svg])

  const drawingUpdater = useCallback(
    (svgObject: SvgObject) => {
      render(() => onChangeSvg(svgObject))
    },
    [render, onChangeSvg]
  )

  const draw = useMemo(
    () => new Drawing(svg, factory, drawingUpdater),
    [svg, factory, drawingUpdater]
  )

  const clear = useCallback(() => {
    const paths = svg.cloneElements()
    svg.setElements([])

    update()
    return paths
  }, [svg, update])

  const undo = useCallback(() => {
    const lastElement = svg.elements[svg.elements.length - 1].clone()
    svg.deleteElement(lastElement)

    update()
    return lastElement
  }, [svg, update])

  return {
    draw,
    update,
    clear,
    undo,
  }
}
