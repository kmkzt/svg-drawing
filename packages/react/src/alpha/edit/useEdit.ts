import { useState, useCallback, useMemo, useEffect } from 'react'
import { EditSvg, Selecting } from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type {
  KeyboardMap,
  UseEditOptions,
  UseEdit,
  EditSvgAction,
  EditSvgProps,
} from '../types'
import { useMultipleSelect } from './useMultipleSelect'

export const useEdit = <T extends HTMLElement>({
  sharedSvg,
  multipleSelectBindKey,
}: UseEditOptions = {}): UseEdit<T> => {
  const [ref, originObj, { svg, onUpdate, ...rest }] = useSvg<T>({ sharedSvg })
  const editSvg = useMemo(() => new EditSvg(svg), [svg])

  const [editInfo, setEditInfo] = useState(editSvg.toJson({}))
  const [previewObj, setPreviewObj] = useState(svg.toJson())

  const editing = useMemo(() => Object.keys(editInfo.index).length !== 0, [
    editInfo.index,
  ])

  const multipleSelect = useMultipleSelect(multipleSelectBindKey)

  useEffect(() => {
    if (!editing) return
    setPreviewObj(svg.toJson())
  }, [editing, svg])

  const onSelecting = useCallback<EditSvgProps['onSelecting']>(
    (sel: Selecting) => {
      const updateSelecting = multipleSelect.current
        ? { ...editInfo.index, ...sel }
        : sel
      onUpdate()
      setEditInfo(editSvg.toJson(updateSelecting))
      setPreviewObj(svg.toJson())
    },
    [multipleSelect, editInfo.index, onUpdate, editSvg, svg]
  )

  const onMovePathsPreview = useCallback<EditSvgProps['onMovePathsPreview']>(
    (move) => {
      if (!editing) return
      const preview = editSvg.preview()
      preview.translate(move, editInfo.index)
      setEditInfo(preview.toJson(editInfo.index))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editing, editInfo.index]
  )

  const onMovePaths = useCallback<EditSvgProps['onMovePaths']>(
    (movePoint) => {
      if (!editing) return
      editSvg.translate(movePoint, editInfo.index)
      onSelecting(editInfo.index)
    },
    [editing, editSvg, editInfo.index, onSelecting]
  )

  const onResizePaths = useCallback<EditSvgProps['onResizePaths']>(
    (type, movePoint) => {
      if (!editing) return
      editSvg.resizeFixedPosition({ type, move: movePoint }, editInfo.index)
      onSelecting(editInfo.index)
    },
    [editSvg, editing, editInfo.index, onSelecting]
  )

  const onResizePathsPreview = useCallback<
    EditSvgProps['onResizePathsPreview']
  >(
    (type, movePoint) => {
      if (!editing) return
      const preview = editSvg.preview()
      preview.resizeFixedPosition({ type, move: movePoint }, editInfo.index)
      setEditInfo(preview.toJson(editInfo.index))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editing, editInfo.index]
  )

  const onChangeAttributes = useCallback<EditSvgAction['onChangeAttributes']>(
    (arg) => {
      if (!editing) return
      editSvg.changeAttributes(arg, editInfo.index)
      onSelecting(editInfo.index)
    },
    [editSvg, editing, editInfo.index, onSelecting]
  )

  const onCancelSelecting = useCallback<
    EditSvgAction['onCancelSelecting']
  >(() => {
    setEditInfo(editSvg.toJson({}))
    setPreviewObj(svg.toJson())
  }, [editSvg, svg])

  const onDeletePaths = useCallback<EditSvgAction['onDeletePaths']>(() => {
    if (!editInfo.index) return
    editSvg.delete(editInfo.index)
    onUpdate()
    onCancelSelecting()
  }, [onCancelSelecting, editSvg, editInfo.index, onUpdate])

  const keyboardMap = useMemo<KeyboardMap>(() => {
    if (!editInfo.index) return {}
    return {
      ['Escape']: onCancelSelecting,
      ['ArrowRight']: () => onMovePaths({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => onMovePaths({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => onMovePaths({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => onMovePaths({ x: 0, y: 0.5 }),
      ['Backspace']: onDeletePaths,
    }
  }, [editInfo.index, onCancelSelecting, onDeletePaths, onMovePaths])

  const svgProps = useMemo(() => (editing ? previewObj : originObj), [
    editing,
    previewObj,
    originObj,
  ])

  return [
    ref,
    {
      ...svgProps,
      edit: editInfo,
      onSelecting,
      onMovePaths,
      onMovePathsPreview,
      onResizePaths,
      onResizePathsPreview,
    },
    {
      svg,
      onUpdate,
      onChangeAttributes,
      onDeletePaths,
      onCancelSelecting,
      keyboardMap,
      ...rest,
    },
  ]
}
