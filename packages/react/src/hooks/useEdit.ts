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
import type { PointObject } from '@svg-drawing/core'

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
 *         {paths.map((path) => (
 *           <Path path={path} />
 *         ))}
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
    (ev) => {
      translatePathHandler.start(getPointFromEvent(ev))
    },
    [translatePathHandler]
  )

  const onResizeStart = useCallback<EditProps['onResizeStart']>(
    (ev, type) => {
      resizePathHandler.start({ type, point: getPointFromEvent(ev) })
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
      onCancelSelect: cancelSelect,
      onTranslateStart,
      onResizeStart,
      onSelectPaths: selectPaths,
    },
  }
}

const getPointFromEvent = (
  ev: React.MouseEvent<any> | React.TouchEvent<any>
): PointObject => {
  if ('touches' in ev) {
    const touche = ev.touches[0]
    return {
      x: touche.clientX,
      y: touche.clientY,
    }
  }
  return {
    x: ev.clientX,
    y: ev.clientY,
  }
}
