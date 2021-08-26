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
  const [selecting, setSelecting] = useState<EditSvgProps['selecting']>({})
  const editing = useMemo(() => Object.keys(selecting).length !== 0, [
    selecting,
  ])
  const editSvg = useMemo(() => new EditSvg(svg), [svg])
  const [editInfo, setEditInfo] = useState(editSvg.toJson(selecting))
  const [previewObj, setPreviewObj] = useState(svg.toJson())

  const multipleSelect = useMultipleSelect(multipleSelectBindKey)
  useEffect(() => {
    if (!editing) return
    setPreviewObj(svg.toJson())
  }, [editing, svg])

  const onSelecting = useCallback<EditSvgProps['onSelecting']>(
    (sel: Selecting) => {
      const updateSelecting = multipleSelect.current
        ? { ...selecting, ...sel }
        : sel
      onUpdate()
      setSelecting(updateSelecting)
      setEditInfo(editSvg.toJson(updateSelecting))
      setPreviewObj(svg.toJson())
    },
    [editSvg, multipleSelect, selecting, svg, onUpdate]
  )

  const onMovePathsPreview = useCallback<EditSvgProps['onMovePathsPreview']>(
    (move) => {
      if (!editing) return
      const preview = editSvg.preview()
      preview.translate(move, selecting)
      setEditInfo(preview.toJson(selecting))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editing, selecting]
  )

  const onMovePaths = useCallback<EditSvgProps['onMovePaths']>(
    (movePoint) => {
      if (!editing) return
      editSvg.translate(movePoint, selecting)
      onSelecting(selecting)
    },
    [editSvg, editing, selecting, onSelecting]
  )

  const onResizePaths = useCallback<EditSvgProps['onResizePaths']>(
    (type, movePoint) => {
      if (!editing) return
      editSvg.resizeFixedPosition({ type, move: movePoint }, selecting)
      onSelecting(selecting)
    },
    [editSvg, editing, selecting, onSelecting]
  )

  const onResizePathsPreview = useCallback<
    EditSvgProps['onResizePathsPreview']
  >(
    (type, movePoint) => {
      if (!editing) return
      const preview = editSvg.preview()
      preview.resizeFixedPosition({ type, move: movePoint }, selecting)
      setEditInfo(preview.toJson(selecting))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editing, selecting]
  )

  const onChangeAttributes = useCallback<EditSvgAction['onChangeAttributes']>(
    (arg) => {
      if (!editing) return
      editSvg.changeAttributes(arg, selecting)
      onSelecting(selecting)
    },
    [editSvg, editing, selecting, onSelecting]
  )

  const onCancelSelecting = useCallback<
    EditSvgAction['onCancelSelecting']
  >(() => {
    setSelecting({})
    setEditInfo(editSvg.toJson({}))
    setPreviewObj(svg.toJson())
  }, [editSvg, svg])

  const onDeletePaths = useCallback<EditSvgAction['onDeletePaths']>(() => {
    if (!selecting) return
    editSvg.delete(selecting)
    onUpdate()
    onCancelSelecting()
  }, [onCancelSelecting, editSvg, selecting, onUpdate])

  const keyboardMap = useMemo<KeyboardMap>(() => {
    if (!selecting) return {}
    return {
      ['Escape']: onCancelSelecting,
      ['ArrowRight']: () => onMovePaths({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => onMovePaths({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => onMovePaths({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => onMovePaths({ x: 0, y: 0.5 }),
      ['Backspace']: onDeletePaths,
    }
  }, [selecting, onCancelSelecting, onDeletePaths, onMovePaths])

  const svgProps = useMemo(() => (editing ? previewObj : originObj), [
    editing,
    previewObj,
    originObj,
  ])
  return [
    ref,
    {
      ...svgProps,
      selecting,
      selectPaths: editInfo.selectPaths,
      boundingBox: editInfo.boundingBox,
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
