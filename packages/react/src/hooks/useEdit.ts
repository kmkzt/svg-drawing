import {
  EditSvg,
  Editing,
  TranslatePathHandler,
  ResizePathHandler,
} from '@svg-drawing/core'
import { useCallback, useMemo, useEffect } from 'react'
import { usePressedKey } from './usePressedKey'
import { useRenderInterval } from './useRenderInterval'
import type { UseEdit, EditSvgAction, EditProps } from '../types'

/**
 * ### Basic usage.
 *
 * ```ts
 * import { useEdit, Svg, EditPaths } from '@svg-drawing/react'
 * import type { EditSvgObject } from '@svg-drawing/core'
 *
 * const EditExample = ({ sharedSvg }) => {
 *   const [{ paths, ...svgProps }, onChangeSvg] = useState(
 *     sharedSvg.toJson()
 *   )
 *   const [editSvgObject, onChangeEdit] = useState<EditSvgObject | null>(
 *     null
 *   )
 *
 *   const { editProps, cancelSelect } = useEdit({
 *     svg: sharedSvg,
 *     editSvgObject,
 *     onChangeEdit,
 *     onChangeSvg,
 *   })
 *
 *   return (
 *     <div
 *       style={{
 *         border: '1px solid #333',
 *         width: 500,
 *         height: 500,
 *         touchAction: 'none',
 *         boxSizing: 'border-box',
 *       }}
 *     >
 *       <Svg {...svgProps} onSelectSvg={cancelSelect}>
 *         <EditPaths paths={paths} {...editProps} />
 *       </Svg>
 *     </div>
 *   )
 * }
 * ```
 */
export const useEdit: UseEdit = ({
  multipleSelectBindKey = 'Shift',
  editSvgObject,
  svg,
  onChangeEdit,
  onChangeSvg,
}) => {
  const editSvg = useMemo(() => new EditSvg(svg), [svg])

  const render = useRenderInterval()

  const update = useCallback(() => {
    render(() => {
      onChangeEdit(editSvg.toJson())
      onChangeSvg(editSvg.svg.toJson())
    })
  }, [editSvg, onChangeEdit, onChangeSvg, render])

  const edit = useMemo(
    () =>
      new Editing(editSvg, (eSvg: EditSvg) => {
        render(() => {
          onChangeEdit(eSvg.toJson())
          onChangeSvg(eSvg.svg.toJson())
        })
      }),
    [editSvg, onChangeEdit, onChangeSvg, render]
  )

  const translatePathHandler = useMemo(
    () => new TranslatePathHandler(edit),
    [edit]
  )
  useEffect(() => () => translatePathHandler.end(), [translatePathHandler])

  const resizePathHandler = useMemo(() => new ResizePathHandler(edit), [edit])
  useEffect(() => () => resizePathHandler.end(), [resizePathHandler])

  const multipleSelect = usePressedKey(multipleSelectBindKey)

  const selectPaths = useCallback<EditSvgAction['selectPaths']>(
    (sel) => edit.select(sel, multipleSelect.current),
    [edit, multipleSelect]
  )

  const changeAttributes = useCallback<EditSvgAction['changeAttributes']>(
    (arg) => {
      edit.changeAttributes(arg)
    },
    [edit]
  )

  const cancelSelect = useCallback<EditSvgAction['cancelSelect']>(() => {
    edit.cancel()
  }, [edit])

  const deletePaths = useCallback<EditSvgAction['deletePaths']>(() => {
    edit.deletePaths()
  }, [edit])

  const translate = useCallback<EditSvgAction['translate']>(
    (po) => {
      edit.translate(po)
    },
    [edit]
  )

  const onTranslateStart = useCallback<EditProps['onTranslateStart']>(
    (po) => {
      translatePathHandler.start(po)
    },
    [translatePathHandler]
  )

  const onResizeStart = useCallback<EditProps['onResizeStart']>(
    (base) => {
      resizePathHandler.start(base)
    },
    [resizePathHandler]
  )

  const keyboardMap = useMemo<EditSvgAction['keyboardMap']>(
    () => ({
      ['Escape']: cancelSelect,
      ['ArrowRight']: () => translate({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => translate({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => translate({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => translate({ x: 0, y: 0.5 }),
      ['Backspace']: deletePaths,
    }),
    [cancelSelect, deletePaths, translate]
  )

  const { editPaths, boundingBox, selectedOnlyPaths } = useMemo(
    () => ({
      editPaths: editSvgObject?.paths ?? null,
      boundingBox: editSvgObject?.boundingBox ?? null,
      selectedOnlyPaths: editSvgObject?.selectedOnlyPaths ?? false,
    }),
    [editSvgObject]
  )

  return {
    edit,
    keyboardMap,
    update,
    selectPaths,
    cancelSelect,
    changeAttributes,
    translate,
    deletePaths,
    editProps: {
      editPaths,
      boundingBox,
      selectedOnlyPaths,
      onTranslateStart,
      onResizeStart,
      onSelectPaths: selectPaths,
    },
  }
}
