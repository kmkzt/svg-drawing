import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  EditSvg,
  EditSvgObject,
  PointObject,
  Selecting,
} from '@svg-drawing/core'
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

  const [editInfo, setEditInfo] = useState<EditSvgObject | null>(
    editSvg.toJson()
  )
  const [previewObj, setPreviewObj] = useState(svg.toJson())

  const [moving, setMoving] = useState(false)
  const [resizing, setResizing] = useState(false)

  const editing = useMemo(() => !!editInfo, [editInfo])

  const multipleSelect = useMultipleSelect(multipleSelectBindKey)

  const updateRender = useCallback((eSvg: EditSvg) => {
    setEditInfo(eSvg.toJson())
    setPreviewObj(eSvg.svg.toJson())
  }, [])

  const onSelectPaths = useCallback<EditSvgAction['onSelectPaths']>(
    (sel: Selecting | null = null) => {
      const updateSelecting =
        multipleSelect.current && editInfo ? { ...editInfo.index, ...sel } : sel
      editSvg.setupSelecting(updateSelecting)

      onUpdate()
      updateRender(editSvg)
    },
    [multipleSelect, editInfo, editSvg, onUpdate, updateRender]
  )

  const onMovePathsStart = useCallback<EditSvgProps['onMovePathsStart']>(
    (po, sel = null) => {
      if (sel) onSelectPaths(sel)
      editSvg.setupTranslateBsePoint(po)
      setMoving(true)
    },
    [editSvg, onSelectPaths]
  )

  const onMovePathsPreview = useCallback(
    (move: PointObject) => {
      const preview = editSvg.preview()
      preview.translate(move)

      updateRender(preview)
    },
    [editSvg, updateRender]
  )

  const onMovePaths = useCallback(
    (movePoint: PointObject) => {
      editSvg.translate(movePoint)
      editSvg.setupTranslateBsePoint(null)

      onSelectPaths(editInfo?.index ?? null)
    },
    [editInfo, editSvg, onSelectPaths]
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
      preview.resizeBoundingBox(arg)

      updateRender(preview)
    },
    [editSvg, updateRender]
  )

  const onResizeBoundingBox = useCallback(
    (arg: Parameters<EditSvg['resizeBoundingBox']>[0]) => {
      editSvg.resizeBoundingBox(arg)
      editSvg.setupResizeBoundingBox(null)

      onSelectPaths(editInfo?.index ?? null)
    },
    [editSvg, editInfo, onSelectPaths]
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
      editSvg.changeAttributes(arg)
      onSelectPaths(editInfo?.index ?? null)
    },
    [editSvg, editing, editInfo, onSelectPaths]
  )

  const onCancelSelect = useCallback<EditSvgAction['onCancelSelect']>(() => {
    editSvg.setupSelecting(null)

    updateRender(editSvg)
  }, [editSvg, updateRender])

  const onDeletePaths = useCallback<EditSvgAction['onDeletePaths']>(() => {
    editSvg.delete()
    onUpdate()
    onCancelSelect()
  }, [onCancelSelect, editSvg, onUpdate])

  const keyboardMap = useMemo<KeyboardMap>(() => {
    if (!editing) return {}
    return {
      ['Escape']: onCancelSelect,
      ['ArrowRight']: () => onMovePaths({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => onMovePaths({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => onMovePaths({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => onMovePaths({ x: 0, y: 0.5 }),
      ['Backspace']: onDeletePaths,
    }
  }, [editing, onCancelSelect, onDeletePaths, onMovePaths])

  const svgProps = useMemo(
    () => (editing ? previewObj : originObj),
    [editing, previewObj, originObj]
  )

  return [
    {
      ...svgProps,
      editIndex: editInfo?.index ?? null,
      editPaths: editInfo?.paths ?? null,
      boundingBox: editInfo?.boundingBox ?? null,
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
