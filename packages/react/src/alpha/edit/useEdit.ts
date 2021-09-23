import {
  EditSvg,
  EditSvgObject,
  PointObject,
  SvgEditing,
  SvgObject,
} from '@svg-drawing/core'
import { useState, useCallback, useMemo, useEffect } from 'react'
import { usePressedKey } from '../keyboard/usePressedKey'
import { useSvg } from '../svg/useSvg'
import type {
  KeyboardMap,
  UseEdit,
  EditSvgAction,
  EditSvgProps,
} from '../types'

/** @todo Fix onClear and onResize. */
export const useEdit: UseEdit = ({
  multipleSelectBindKey = 'Shift',
  ...useSvgOption
} = {}) => {
  const [
    origin,
    { svg, onUpdate, onClear: onClearOrigin, onResize: onResizeOrigin },
  ] = useSvg(useSvgOption)

  const [{ editInfo, preview }, setEditObj] = useState<{
    editInfo: EditSvgObject | null
    preview: SvgObject
  }>({
    editInfo: null,
    preview: svg.toJson(),
  })

  const core = useMemo(
    () =>
      new SvgEditing(new EditSvg(svg), (eSvg: EditSvg) => {
        setEditObj({
          editInfo: eSvg.toJson(),
          preview: eSvg.svg.toJson(),
        })
        onUpdate()
      }),
    [onUpdate, svg]
  )

  useEffect(() => () => core.cleanup(), [core])

  const editing = useMemo(() => !!editInfo, [editInfo])

  const svgProps = useMemo(
    () => (editing ? preview : origin),
    [editing, preview, origin]
  )

  const multipleSelect = usePressedKey(multipleSelectBindKey)

  const onSelectPaths = useCallback<EditSvgProps['onSelectPaths']>(
    (sel) => core.select(sel, multipleSelect.current),
    [core, multipleSelect]
  )

  const onTranslateStart = useCallback<EditSvgProps['onTranslateStart']>(
    (po) => core.startTranslate(po),
    [core]
  )

  const onTranslate = useCallback(
    (po: PointObject) => {
      core.translate(po)
    },
    [core]
  )

  const onResizeBoundingBoxStart = useCallback<
    EditSvgProps['onResizeBoundingBoxStart']
  >(
    (base) => {
      core.startResizeBoundingBox(base)
    },
    [core]
  )

  const onChangeAttributes = useCallback<EditSvgAction['onChangeAttributes']>(
    (arg) => {
      core.changeAttributes(arg)
    },
    [core]
  )

  const onCancelSelect = useCallback<EditSvgProps['onCancelSelect']>(() => {
    core.cancel()
  }, [core])

  const onDeletePaths = useCallback<EditSvgAction['onDeletePaths']>(() => {
    core.deletePaths()
  }, [core])

  const onClear = useCallback<EditSvgAction['onClear']>(() => {
    core.cancel()
    onClearOrigin()
    setEditObj({
      editInfo: core.editSvg.toJson(),
      preview: core.editSvg.svg.toJson(),
    })
  }, [core, onClearOrigin])

  const onResize = useCallback<EditSvgAction['onResize']>(
    (arg) => {
      onResizeOrigin(arg)
      setEditObj({
        editInfo: core.editSvg.toJson(),
        preview: core.editSvg.svg.toJson(),
      })
    },
    [core.editSvg, onResizeOrigin]
  )

  const keyboardMap = useMemo<KeyboardMap>(() => {
    if (!editing) return {}
    return {
      ['Escape']: onCancelSelect,
      ['ArrowRight']: () => onTranslate({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => onTranslate({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => onTranslate({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => onTranslate({ x: 0, y: 0.5 }),
      ['Backspace']: onDeletePaths,
    }
  }, [editing, onCancelSelect, onDeletePaths, onTranslate])

  return [
    {
      ...svgProps,
      editPaths: editInfo?.paths ?? null,
      boundingBox: editInfo?.boundingBox ?? null,
      onSelectPaths,
      onTranslateStart,
      onResizeBoundingBoxStart,
      onCancelSelect,
    },
    {
      svg,
      keyboardMap,
      onUpdate,
      onChangeAttributes,
      onTranslate,
      onDeletePaths,
      onClear,
      onResize,
    },
  ]
}
