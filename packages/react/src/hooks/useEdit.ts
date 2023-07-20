import { Editing } from '@svg-drawing/core'
import { useMemo } from 'react'
import { useRenderInterval } from './useRenderInterval'
import type { KeyboardMap, UseEdit } from '../types'

/**
 * ### Basic usage.
 *
 * ```ts
 * import { useEdit, Svg, Path } from '@svg-drawing/react'
 * import type { EditSvgObject } from '@svg-drawing/core'
 *
 * const EditExample = ({ sharedSvg }) => {
 *   const [{ width, height, background, paths }, onChangeSvg] = useState(
 *     sharedSvg.toJson()
 *   )
 *   const [editSvgObject, onChangeEdit] = useState<EditSvgObject | null>(
 *     null
 *   )
 *
 *   const { editProps } = useEdit({
 *     svg: sharedSvg,
 *     editSvgObject,
 *     onChangeEdit,
 *     onChangeSvg,
 *   })
 *
 *   return (
 *     <div
 *       style={{
 *         width,
 *         height,
 *         border: '1px solid #333',
 *         touchAction: 'none',
 *         boxSizing: 'border-box',
 *       }}
 *     >
 *       <Svg
 *         width={width}
 *         height={height}
 *         background={background}
 *         editProps={editProps}
 *       >
 *         {paths.map(({ key, attributes }) => (
 *           <Path key={key} pathKey={key} {...attributes} />
 *         ))}
 *       </Svg>
 *     </div>
 *   )
 * }
 * ```
 */
export const useEdit: UseEdit = ({ svg, onUpdate }) => {
  const render = useRenderInterval()

  const edit = useMemo(
    () =>
      new Editing(svg, ({ svg, edit }) => {
        render(() => {
          onUpdate({ svg, edit: edit ?? undefined })
        })
      }),
    [svg, onUpdate, render]
  )

  const keyboardMap = useMemo<KeyboardMap>(
    () => ({
      ['Escape']: () => edit.cancel(),
      ['ArrowRight']: () => edit.translate({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => edit.translate({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => edit.translate({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => edit.translate({ x: 0, y: 0.5 }),
      ['Backspace']: () => edit.deleteElements(),
    }),
    [edit]
  )

  return {
    edit,
    keyboardMap,
  }
}
