import { useState, useCallback, useMemo, useEffect } from 'react'
import { EditSvg, Selecting } from '@svg-drawing/core'
import type { UseEditOptions, UseEdit, UseEditProperty } from './types'
import { useSvg } from '../svg/useSvg'
import { KeyBindMap, useKeyBind } from '../keyboard'

export const useEdit = <T extends HTMLElement>({
  sharedSvg,
}: UseEditOptions = {}): UseEdit<T> => {
  const [ref, originObj, { svg, update, ...rest }] = useSvg<T>({ sharedSvg })
  const [selecting, setSelecting] = useState<UseEditProperty['selecting']>({})
  const editing = useMemo(() => Object.keys(selecting).length !== 0, [
    selecting,
  ])
  const editSvg = useMemo(() => new EditSvg(svg), [svg])
  const [editInfo, setEditInfo] = useState(editSvg.toJson(selecting))
  const [previewObj, setPreviewObj] = useState(svg.toJson())

  useEffect(() => {
    if (!editing) return
    setPreviewObj(svg.toJson())
  }, [editing, svg])

  const updateSelect = useCallback(
    (sel: Selecting = selecting) => {
      update()
      setSelecting(sel)
      setEditInfo(editSvg.toJson(sel))
      setPreviewObj(svg.toJson())
    },
    [editSvg, selecting, svg, update]
  )

  const movePreview = useCallback<UseEditProperty['movePreview']>(
    (move) => {
      if (!editing) return
      const preview = editSvg.preview()
      preview.translate(move, selecting)
      setEditInfo(preview.toJson(selecting))
      setPreviewObj(preview.svg.toJson())
    },
    [editSvg, editing, selecting]
  )

  const move = useCallback<UseEditProperty['move']>(
    (movePoint) => {
      if (!editing) return
      editSvg.translate(movePoint, selecting)
      updateSelect()
    },
    [editSvg, editing, selecting, updateSelect]
  )

  const resizeEdit = useCallback<UseEditProperty['resizeEdit']>(
    (type, move) => {
      if (!editing) return
      editSvg.resizeEdit({ type, move }, selecting)
      updateSelect()
    },
    [editSvg, editing, selecting, updateSelect]
  )

  const changeAttributes = useCallback<UseEditProperty['changeAttributes']>(
    (arg) => {
      if (!editing) return
      editSvg.changeAttributes(arg, selecting)
      updateSelect()
    },
    [editSvg, editing, selecting, updateSelect]
  )

  const deleteAction = useCallback<UseEditProperty['delete']>(() => {
    if (!selecting) return
    editSvg.delete(selecting)
    updateSelect({})
  }, [editSvg, selecting, updateSelect])

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

  const svgObj = useMemo(() => (editing ? previewObj : originObj), [
    editing,
    previewObj,
    originObj,
  ])
  return [
    ref,
    svgObj,
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
      resizeEdit,
      cancel,
      ...rest,
    },
  ]
}
