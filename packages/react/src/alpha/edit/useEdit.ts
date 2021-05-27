import { useState, useCallback, useMemo, useEffect } from 'react'
import { EditPath, EditSvg, Selecting } from '@svg-drawing/core'
import type { UseEditOptions, UseEdit, UseEditProperty } from './types'
import { useSvg } from '../svg/useSvg'
import { KeyBindMap, useKeyBind } from '../keyboard'

export const useEdit = <T extends HTMLElement>({
  sharedSvg,
}: UseEditOptions = {}): UseEdit<T> => {
  const [ref, svgObj, { svg, update, ...rest }] = useSvg<T>({ sharedSvg })
  const [selecting, setSelecting] = useState<UseEditProperty['selecting']>({})
  const editing = useMemo(() => Object.keys(selecting).length !== 0, [
    selecting,
  ])
  const editSvg = useMemo(() => new EditSvg(svg), [svg])
  const [editInfo, setEditInfo] = useState(editSvg.toJson(selecting))
  const [previewSvgObject, setPreviewSvgObject] = useState(svg.toJson())

  useEffect(() => {
    if (!editing) return
    setPreviewSvgObject(svg.toJson())
  }, [editing]) // eslint-disable-line

  const updateSelect = useCallback(
    (sel: Selecting = selecting) => {
      setSelecting(sel)
      setEditInfo(editSvg.toJson(sel))
    },
    [editSvg, selecting]
  )

  const movePreview = useCallback<UseEditProperty['movePreview']>(
    (move) => {
      if (!editing) return
      const preview = editSvg.preview()
      preview.translate(move, selecting)
      setEditInfo(preview.toJson(selecting))
      setPreviewSvgObject(preview.svg.toJson())
    },
    [editSvg, editing, selecting]
  )

  const move = useCallback<UseEditProperty['move']>(
    (movePoint) => {
      if (!editing) return
      editSvg.translate(movePoint, selecting)
      update()
      updateSelect()
    },
    [editSvg, editing, selecting, update, updateSelect]
  )

  const changeAttributes = useCallback<UseEditProperty['changeAttributes']>(
    (arg) => {
      if (!editing) return
      editSvg.changeAttributes(arg, selecting)
      update()
    },
    [editSvg, editing, selecting, update]
  )

  const deleteAction = useCallback<UseEditProperty['delete']>(() => {
    if (!selecting) return
    editSvg.delete(selecting)
    update()
    updateSelect({})
  }, [editSvg, selecting, update, updateSelect])

  const cancel = useCallback<UseEditProperty['cancel']>(() => {
    updateSelect({})
  }, [updateSelect])

  const keyBindMap = useMemo<KeyBindMap>(() => {
    if (!selecting) return {}
    return {
      ['Escape']: cancel,
      ['ArrowRight']: () => move({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => move({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => move({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => move({ x: 0, y: 0.5 }),
      ['Backspace']: deleteAction,
    }
  }, [selecting, cancel, deleteAction, move])
  useKeyBind(keyBindMap)

  return [
    ref,
    editing ? previewSvgObject : svgObj,
    {
      svg,
      selecting,
      selectPaths: editInfo.selectPaths,
      boundingBox: editInfo.boundingBox,
      update,
      select: updateSelect,
      move,
      movePreview,
      changeAttributes,
      delete: deleteAction,
      cancel,
      ...rest,
    },
  ]
}
