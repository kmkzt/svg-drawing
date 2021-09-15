import { useState, useCallback, useMemo, useEffect } from 'react'
import { EditSvg, PointObject, Selecting } from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type {
  KeyboardMap,
  UseEditOptions,
  UseEdit,
  EditSvgAction,
  EditSvgProps,
} from '../types'
import { useMultipleSelect } from './useMultipleSelect'

/** @todo Move event handler to core package */
export const useEdit: UseEdit = ({
  sharedSvg,
  multipleSelectBindKey,
}: UseEditOptions = {}) => {
  const [originObj, { svg, onUpdate, ...rest }] = useSvg({ sharedSvg })
  const editSvg = useMemo(() => new EditSvg(svg), [svg])

  const [editInfo, setEditInfo] = useState(editSvg.toJson({}))
  const [previewObj, setPreviewObj] = useState(svg.toJson())

  const [moving, setMoving] = useState(false)
  const [resizing, setResizing] = useState(false)

  const editing = useMemo(
    () => Object.keys(editInfo.index).length !== 0,
    [editInfo.index]
  )

  const multipleSelect = useMultipleSelect(multipleSelectBindKey)

  const onSelectPaths = useCallback<EditSvgAction['onSelectPaths']>(
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

  const onMovePathsStart = useCallback<EditSvgProps['onMovePathsStart']>(
    (po, sel) => {
      if (sel) onSelectPaths(sel)
      editSvg.setupTranslateBsePoint(po)
      setMoving(true)
    },
    [editSvg, onSelectPaths]
  )

  const onMovePathsPreview = useCallback(
    (move: PointObject) => {
      const preview = editSvg.preview()
      preview.translate(move, editInfo.index)
      setEditInfo(preview.toJson(editInfo.index))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editInfo.index]
  )

  const onMovePaths = useCallback(
    (movePoint: PointObject) => {
      editSvg.translate(movePoint, editInfo.index)
      editSvg.setupTranslateBsePoint(null)

      onSelectPaths(editInfo.index)
    },
    [editSvg, editInfo.index, onSelectPaths]
  )

  useEffect(() => {
    if (!moving || !editing) {
      return
    }
    const handleMoveEdit = (ev: MouseEvent | TouchEvent) => {
      onMovePathsPreview(getPointFromEvent(ev))
    }

    const handleMoveEnd = (ev: MouseEvent | TouchEvent) => {
      onMovePaths(getPointFromEvent(ev))
      setMoving(false)
    }

    // move
    addEventListener('mouseup', handleMoveEnd)
    addEventListener('touchcancel', handleMoveEnd)

    // movePreview
    addEventListener('mousemove', handleMoveEdit)
    addEventListener('touchmove', handleMoveEdit)
    return () => {
      // move
      removeEventListener('mouseup', handleMoveEnd)
      removeEventListener('touchcancel', handleMoveEnd)

      // movePreview
      removeEventListener('mousemove', handleMoveEdit)
      removeEventListener('touchmove', handleMoveEdit)
    }
  }, [editing, moving, onMovePaths, onMovePathsPreview])

  const onResizeBoundingBoxStart = useCallback<
    EditSvgProps['onResizeBoundingBoxStart']
  >(
    (base) => {
      editSvg.setupResizeBoundingBox(base)
      setResizing(true)
    },
    [editSvg]
  )

  const onResizeBoundingBoxPreview = useCallback(
    (arg: Parameters<EditSvg['resizeBoundingBox']>[0]) => {
      const preview = editSvg.preview()
      preview.resizeBoundingBox(arg, editInfo.index)

      setEditInfo(preview.toJson(editInfo.index))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editInfo.index]
  )

  const onResizeBoundingBox = useCallback(
    (arg: Parameters<EditSvg['resizeBoundingBox']>[0]) => {
      editSvg.resizeBoundingBox(arg, editInfo.index)
      editSvg.setupResizeBoundingBox(null)

      onSelectPaths(editInfo.index)
    },
    [editSvg, editInfo.index, onSelectPaths]
  )

  useEffect(() => {
    if (!resizing || !editing) {
      return
    }

    const handleResizePreview = (ev: MouseEvent | TouchEvent) => {
      onResizeBoundingBoxPreview(getPointFromEvent(ev))
    }

    const handleResizeEnd = (ev: MouseEvent | TouchEvent) => {
      onResizeBoundingBox(getPointFromEvent(ev))
      setResizing(false)
    }

    // resizeEdit
    addEventListener('mouseup', handleResizeEnd)
    addEventListener('touchcancel', handleResizeEnd)

    // resizePreview
    addEventListener('mousemove', handleResizePreview)
    addEventListener('touchmove', handleResizePreview)

    return () => {
      // resizeEdit
      removeEventListener('mouseup', handleResizeEnd)
      removeEventListener('touchcancel', handleResizeEnd)

      // resizePreview
      removeEventListener('mousemove', handleResizePreview)
      removeEventListener('touchmove', handleResizePreview)
    }
  }, [resizing, onResizeBoundingBox, onResizeBoundingBoxPreview, editing])

  const onChangeAttributes = useCallback<EditSvgAction['onChangeAttributes']>(
    (arg) => {
      if (!editing) return
      editSvg.changeAttributes(arg, editInfo.index)
      onSelectPaths(editInfo.index)
    },
    [editSvg, editing, editInfo.index, onSelectPaths]
  )

  const onCancelSelect = useCallback<EditSvgAction['onCancelSelect']>(() => {
    setEditInfo(editSvg.toJson({}))
    setPreviewObj(svg.toJson())
  }, [editSvg, svg])

  const onDeletePaths = useCallback<EditSvgAction['onDeletePaths']>(() => {
    if (!editInfo.index) return
    editSvg.delete(editInfo.index)
    onUpdate()
    onCancelSelect()
  }, [onCancelSelect, editSvg, editInfo.index, onUpdate])

  const keyboardMap = useMemo<KeyboardMap>(() => {
    if (!editInfo.index) return {}
    return {
      ['Escape']: onCancelSelect,
      ['ArrowRight']: () => onMovePaths({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => onMovePaths({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => onMovePaths({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => onMovePaths({ x: 0, y: 0.5 }),
      ['Backspace']: onDeletePaths,
    }
  }, [editInfo.index, onCancelSelect, onDeletePaths, onMovePaths])

  const svgProps = useMemo(
    () => (editing ? previewObj : originObj),
    [editing, previewObj, originObj]
  )

  return [
    {
      ...svgProps,
      editIndex: editInfo.index,
      editPaths: editInfo.paths,
      boundingBox: editInfo.boundingBox,
      onMovePathsStart,
      onResizeBoundingBoxStart,
    },
    {
      svg,
      onUpdate,
      onChangeAttributes,
      onDeletePaths,
      onSelectPaths,
      onCancelSelect,
      onResizeBoundingBox,
      keyboardMap,
      ...rest,
    },
  ]
}

const getPointFromEvent = (
  ev: MouseEvent | TouchEvent | PointerEvent
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
