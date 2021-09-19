import {
  EditSvg,
  EditSvgObject,
  PointObject,
  Selecting,
  SvgEditing,
  SvgObject,
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

/** @todo Fix onClear and onResize. */
export const useEdit: UseEdit = ({
  sharedSvg,
  multipleSelectBindKey = 'Shift',
}: UseEditOptions = {}) => {
  const [origin, { svg, onUpdate, ...rest }] = useSvg({ sharedSvg })

  const [{ editInfo, preview }, setEditObj] = useState<{
    editInfo: EditSvgObject | null
    preview: SvgObject
  }>({
    editInfo: null,
    preview: svg.toJson(),
  })

  const core = useMemo(() => SvgEditing.init(svg), [svg])
  useEffect(() => {
    core.setupUpdater((eSvg: EditSvg) => {
      setEditObj({
        editInfo: eSvg.toJson(),
        preview: eSvg.svg.toJson(),
      })
      onUpdate()
    })
  }, [onUpdate, core])
  useEffect(() => () => core.cleanup(), [core])

  const editing = useMemo(() => !!editInfo, [editInfo])
  const svgProps = useMemo(
    () => (editing ? preview : origin),
    [editing, preview, origin]
  )

  const multipleSelect = usePressedKey(multipleSelectBindKey)
  const getUpdateSelecting = useCallback(
    (sel: Selecting): Selecting =>
      editInfo && multipleSelect.current ? { ...editInfo.index, ...sel } : sel,
    [editInfo, multipleSelect]
  )

  const onSelectPaths = useCallback<EditSvgAction['onSelectPaths']>(
    (sel: Selecting) => {
      core.select(getUpdateSelecting(sel))
    },
    [core, getUpdateSelecting]
  )

  const onTranslateStart = useCallback<EditSvgProps['onTranslateStart']>(
    (po, sel) => {
      core.startTranslate(po, sel ? getUpdateSelecting(sel) : undefined)
    },
    [getUpdateSelecting, core]
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

  const onCancelSelect = useCallback<EditSvgAction['onCancelSelect']>(() => {
    core.cancel()
  }, [core])

  const onDeletePaths = useCallback<EditSvgAction['onDeletePaths']>(() => {
    core.deletePaths()
  }, [core])

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
      onTranslateStart,
      onResizeBoundingBoxStart,
    },
    {
      svg,
      onUpdate,
      onChangeAttributes,
      onTranslate,
      onDeletePaths,
      onSelectPaths,
      onCancelSelect,
      keyboardMap,
      ...rest,
    },
  ]
}
