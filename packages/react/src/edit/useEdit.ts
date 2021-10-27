import { EditSvg, PointObject, SvgEditing } from '@svg-drawing/core'
import { useCallback, useMemo, useEffect } from 'react'
import { usePressedKey } from '../keyboard/usePressedKey'
import type { KeyboardMap, UseEdit, EditSvgAction } from '../types'

/** @todo Fix onClear and onResize. */
export const useEdit: UseEdit = ({
  multipleSelectBindKey = 'Shift',
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

  const onSelectPaths = useCallback<EditSvgAction['onSelectPaths']>(
    (sel) => edit.select(sel, multipleSelect.current),
    [edit, multipleSelect]
  )

  const onTranslateStart = useCallback<EditSvgAction['onTranslateStart']>(
    (po) => edit.startTranslate(po),
    [edit]
  )

  const onTranslate = useCallback(
    (po: PointObject) => {
      edit.translate(po)
    },
    [edit]
  )

  const onResizeBoundingBoxStart = useCallback<
    EditSvgAction['onResizeBoundingBoxStart']
  >(
    (base) => {
      edit.startResizeBoundingBox(base)
    },
    [edit]
  )

  const onChangeAttributes = useCallback<EditSvgAction['onChangeAttributes']>(
    (arg) => {
      edit.changeAttributes(arg)
    },
    [edit]
  )

  const onCancelSelect = useCallback<EditSvgAction['onCancelSelect']>(() => {
    edit.cancel()
  }, [edit])

  const onDeletePaths = useCallback<EditSvgAction['onDeletePaths']>(() => {
    edit.deletePaths()
  }, [edit])

  const keyboardMap = useMemo<KeyboardMap>(
    () => ({
      ['Escape']: onCancelSelect,
      ['ArrowRight']: () => onTranslate({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => onTranslate({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => onTranslate({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => onTranslate({ x: 0, y: 0.5 }),
      ['Backspace']: onDeletePaths,
    }),
    [onCancelSelect, onDeletePaths, onTranslate]
  )

  return {
    edit,
    keyboardMap,
    update,
    onSelectPaths,
    onTranslateStart,
    onResizeBoundingBoxStart,
    onCancelSelect,
    onChangeAttributes,
    onTranslate,
    onDeletePaths,
  }
}
