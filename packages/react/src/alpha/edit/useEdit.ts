import { useState, useCallback, useMemo, useEffect } from 'react'
import { EditSvg, PointObject, Selecting } from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type {
  KeyboardMap,
  UseEditOptions,
  UseEdit,
  EditSvgAction,
  EditSvgProps,
  ResizeBoundingBoxBase,
} from '../types'
import { useMultipleSelect } from './useMultipleSelect'

export const useEdit: UseEdit = ({
  sharedSvg,
  multipleSelectBindKey,
}: UseEditOptions = {}) => {
  const [originObj, { svg, onUpdate, ...rest }] = useSvg({ sharedSvg })
  const editSvg = useMemo(() => new EditSvg(svg), [svg])

  const [moveBasePoint, setMoveBasePoint] = useState<PointObject | null>(null)
  const [resizeBoundingBoxBase, setResizeBasePoint] =
    useState<ResizeBoundingBoxBase | null>(null)
  const [editInfo, setEditInfo] = useState(editSvg.toJson({}))
  const [previewObj, setPreviewObj] = useState(svg.toJson())

  const editing = useMemo(
    () => Object.keys(editInfo.index).length !== 0,
    [editInfo.index]
  )

  const multipleSelect = useMultipleSelect(multipleSelectBindKey)

  useEffect(() => {
    if (!editing) return
    setPreviewObj(svg.toJson())
  }, [editing, svg])

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

  const onMovePathsPreview = useCallback(
    (move: PointObject) => {
      if (!editing) return
      const preview = editSvg.preview()
      preview.translate(move, editInfo.index)
      setEditInfo(preview.toJson(editInfo.index))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editing, editInfo.index]
  )

  const onMovePaths = useCallback(
    (movePoint: PointObject) => {
      if (!editing) return
      editSvg.translate(movePoint, editInfo.index)
      onSelectPaths(editInfo.index)
    },
    [editing, editSvg, editInfo.index, onSelectPaths]
  )

  const onResizeBoundingBoxStart = useCallback<
    EditSvgProps['onResizeBoundingBoxStart']
  >((resizeBoundingBoxBase) => {
    setResizeBasePoint(resizeBoundingBoxBase)
  }, [])

  const onResizeBoundingBox = useCallback(
    (arg: Parameters<EditSvg['resizeBoundingBox']>[0]) => {
      if (!editing) return
      editSvg.resizeBoundingBox(arg, editInfo.index)
      onSelectPaths(editInfo.index)
    },
    [editSvg, editing, editInfo.index, onSelectPaths]
  )

  const onResizeBoundingBoxPreview = useCallback(
    (arg: Parameters<EditSvg['resizeBoundingBox']>[0]) => {
      if (!editing) return
      const preview = editSvg.preview()

      preview.resizeBoundingBox(arg, editInfo.index)
      setEditInfo(preview.toJson(editInfo.index))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editing, editInfo.index]
  )

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

  const onMovePathsStart = useCallback<EditSvgProps['onMovePathsStart']>(
    (po, sel) => {
      if (sel) onSelectPaths(sel)
      setMoveBasePoint(po)
    },
    [onSelectPaths]
  )

  // move preview
  const handleMoveEdit = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!moveBasePoint) return
      const { x, y } = getPointFromEvent(ev)
      onMovePathsPreview({
        x: x - moveBasePoint.x,
        y: y - moveBasePoint.y,
      })
    },
    [moveBasePoint, onMovePathsPreview]
  )

  // move
  const handleMoveEnd = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!moveBasePoint) return
      const { x, y } = getPointFromEvent(ev)
      onMovePaths({
        x: x - moveBasePoint.x,
        y: y - moveBasePoint.y,
      })
      setMoveBasePoint(null)
    },
    [moveBasePoint, onMovePaths]
  )

  useEffect(() => {
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
  }, [handleMoveEnd, handleMoveEdit])

  const handleResizePreview = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!resizeBoundingBoxBase) return
      const { x, y } = getPointFromEvent(ev)
      const { fixedPosition, basePoint } = resizeBoundingBoxBase

      onResizeBoundingBoxPreview({
        fixedPosition,
        move: { x: x - basePoint.x, y: y - basePoint.y },
      })
    },
    [onResizeBoundingBoxPreview, resizeBoundingBoxBase]
  )

  // resize edit
  const handleResizeEnd = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!resizeBoundingBoxBase) return
      const { x, y } = getPointFromEvent(ev)
      const { fixedPosition, basePoint } = resizeBoundingBoxBase

      onResizeBoundingBox({
        fixedPosition,
        move: {
          x: x - basePoint.x,
          y: y - basePoint.y,
        },
      })
      setResizeBasePoint(null)
    },
    [onResizeBoundingBox, resizeBoundingBoxBase]
  )

  useEffect(() => {
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
  }, [handleResizeEnd, handleResizePreview])

  return [
    {
      ...svgProps,
      edit: editInfo,
      onSelectPaths,
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
