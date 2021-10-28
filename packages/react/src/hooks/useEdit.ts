import { EditSvg, SvgEditing } from '@svg-drawing/core'
import { useCallback, useMemo, useEffect } from 'react'
import { usePressedKey } from './usePressedKey'
import type { UseEdit, EditSvgAction, EditProps } from '../types'

/** @todo Fix onClear and onResize. */
export const useEdit: UseEdit = ({
  multipleSelectBindKey = 'Shift',
  editSvgObject,
  svg,
  onChangeEdit,
  onChangeSvg,
}) => {
  const editSvg = useMemo(() => new EditSvg(svg), [svg])

  const update = useCallback(() => {
    onChangeEdit(editSvg.toJson())
    onChangeSvg(editSvg.svg.toJson())
  }, [editSvg, onChangeEdit, onChangeSvg])

  const edit = useMemo(
    () =>
      new SvgEditing(editSvg, (eSvg: EditSvg) => {
        onChangeEdit(eSvg.toJson())
        onChangeSvg(eSvg.svg.toJson())
      }),
    [editSvg, onChangeEdit, onChangeSvg]
  )

  useEffect(() => () => edit.cleanup(), [edit])

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
    (po) => edit.startTranslate(po),
    [edit]
  )

  const onResizeBoundingBoxStart = useCallback<
    EditProps['onResizeBoundingBoxStart']
  >(
    (base) => {
      edit.startResizeBoundingBox(base)
    },
    [edit]
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

  const { editPaths, boundingBox } = useMemo(
    () => ({
      editPaths: editSvgObject?.paths ?? null,
      boundingBox: editSvgObject?.boundingBox ?? null,
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
    editSvgProps: {
      editPaths,
      boundingBox,
      onTranslateStart,
      onResizeBoundingBoxStart,
      onSelectPaths: selectPaths,
      onCancelSelect: cancelSelect,
    },
  }
}
