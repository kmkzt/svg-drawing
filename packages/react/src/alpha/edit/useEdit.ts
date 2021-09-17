import {
  EditSvg,
  EditSvgObject,
  PointObject,
  Selecting,
  SvgEditing,
} from '@svg-drawing/core'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { usePressedKey } from '../keyboard/usePressedKey'
import { useSvg } from '../svg/useSvg'
import type {
  KeyboardMap,
  UseEditOptions,
  UseEdit,
  EditSvgAction,
  EditSvgProps,
} from '../types'

export const useEdit: UseEdit = ({
  sharedSvg,
  multipleSelectBindKey = 'shift',
}: UseEditOptions = {}) => {
  const [originObj, { svg, onUpdate, ...rest }] = useSvg({ sharedSvg })

  const svgEditing = useMemo(() => SvgEditing.init(svg), [svg])
  const [editInfo, setEditInfo] = useState<EditSvgObject | null>(
    svgEditing.editSvg.toJson()
  )
  const [previewObj, setPreviewObj] = useState(svg.toJson())

  useEffect(() => {
    svgEditing.setupUpdater((eSvg: EditSvg) => {
      setEditInfo(eSvg.toJson())
      setPreviewObj(eSvg.svg.toJson())
      onUpdate()
    })
  }, [onUpdate, svgEditing])
  useEffect(() => () => svgEditing.cleanup(), [svgEditing])

  const editing = useMemo(() => !!editInfo, [editInfo])
  const svgProps = useMemo(
    () => (editing ? previewObj : originObj),
    [editing, previewObj, originObj]
  )

  const multipleSelect = usePressedKey(multipleSelectBindKey)
  const onSelectPaths = useCallback<EditSvgAction['onSelectPaths']>(
    (sel: Selecting | null = null) => {
      const updateSelecting =
        multipleSelect.current && editInfo ? { ...editInfo.index, ...sel } : sel

      svgEditing.select(updateSelecting)
    },
    [multipleSelect, editInfo, svgEditing]
  )

  const onMovePathsStart = useCallback<EditSvgProps['onMovePathsStart']>(
    (po, sel) => {
      svgEditing.startTranslate(po, sel)
    },
    [svgEditing]
  )

  const onMovePaths = useCallback(
    (po: PointObject) => {
      svgEditing.translate(po)
    },
    [svgEditing]
  )

  const onResizeBoundingBoxStart = useCallback<
    EditSvgProps['onResizeBoundingBoxStart']
  >(
    (base) => {
      svgEditing.startResizeBoundingBox(base)
    },
    [svgEditing]
  )

  const onChangeAttributes = useCallback<EditSvgAction['onChangeAttributes']>(
    (arg) => {
      svgEditing.changeAttributes(arg)
    },
    [svgEditing]
  )

  const onCancelSelect = useCallback<EditSvgAction['onCancelSelect']>(() => {
    svgEditing.cancel()
  }, [svgEditing])

  const onDeletePaths = useCallback<EditSvgAction['onDeletePaths']>(() => {
    svgEditing.deletePaths()
  }, [svgEditing])

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
      onMovePaths,
      onDeletePaths,
      onSelectPaths,
      onCancelSelect,
      keyboardMap,
      ...rest,
    },
  ]
}
