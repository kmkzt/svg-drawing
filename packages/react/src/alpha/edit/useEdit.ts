import { useState, useCallback, useMemo } from 'react'
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
  const [editSvgObject, setEditSvgObject] = useState(editSvg.toJson(selecting))

  const updateSelect = useCallback(
    (sel: Selecting = selecting) => {
      setSelecting(sel)
      setEditSvgObject(editSvg.toJson(sel))
    },
    [editSvg, selecting]
  )
  const move = useCallback<UseEditProperty['move']>(
    (move) => {
      if (!editing) return
      editSvg.translate(move, selecting)
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
    svgObj,
    {
      svg,
      update,
      selecting,
      select: updateSelect,
      move,
      changeAttributes,
      delete: deleteAction,
      cancel,
      boundingBox: editSvgObject.boundingBox,
      selectPaths: editSvgObject.selectPaths,
      ...rest,
    },
  ]
}
