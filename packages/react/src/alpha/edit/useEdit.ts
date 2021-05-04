import { useState, useCallback, useMemo } from 'react'
import { EditPath, Path } from '@svg-drawing/core'
import type {
  EditIndex,
  UseEditOptions,
  UseEdit,
  UseEditProperty,
} from './types'
import { useSvg } from '../svg/useSvg'

export const useEdit = <T extends HTMLElement>({
  sharedSvg,
}: UseEditOptions): UseEdit<T> => {
  const [ref, svgObj, { svg, update, resize }] = useSvg<T>({ sharedSvg })
  const [editing, setEditing] = useState<UseEditProperty['editing']>(null)

  const select = useCallback<UseEditProperty['select']>((editIndex) => {
    setEditing(editIndex)
  }, [])

  const editPath: EditPath | null = useMemo(() => {
    if (!editing) return null
    if (typeof editing.path !== 'number') return null
    const path = svg.paths[editing.path] ?? null
    if (!path) return null
    return new EditPath(path)
  }, [editing, svg.paths])

  const move = useCallback<UseEditProperty['move']>(
    (move) => {
      if (!editPath) return
      editPath.translate(move, {
        command: editing?.command,
        value: editing?.value,
      })
      update()
    },
    [editPath, editing, update]
  )

  const edit = useCallback<UseEditProperty['edit']>(
    (arg) => {
      if (!editPath) return
      editPath.edit(arg)
      update()
    },
    [editPath, update]
  )

  const cancel = useCallback<UseEditProperty['cancel']>(() => {
    setEditing(null)
  }, [])
  return [
    ref,
    svgObj,
    {
      svg,
      update,
      resize,
      editing,
      select,
      move,
      edit,
      cancel,
    },
  ]
}
