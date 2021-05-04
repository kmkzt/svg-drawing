import { useState, useCallback } from 'react'
import { EditPath } from '@svg-drawing/core'
import type {
  EditIndex,
  UseEditOptions,
  UseEdit,
  UseEditProperty,
} from './types'
import { useSvg } from '../svg/useSvg'

const initEditing: EditIndex = {
  path: undefined,
  command: undefined,
  value: undefined,
}

export const useEdit = <T extends HTMLElement>({
  sharedSvg,
}: UseEditOptions): UseEdit<T> => {
  const [ref, svgObj, { svg, update, resize }] = useSvg<T>({ sharedSvg })
  const [editing, setEditing] = useState<UseEditProperty['editing']>(
    initEditing
  )

  const select = useCallback<UseEditProperty['select']>((editIndex) => {
    setEditing(editIndex)
  }, [])

  const move = useCallback<UseEditProperty['move']>(
    (move) => {
      if (editing.path === undefined) return
      const path = svg.paths[editing.path]
      new EditPath(path).translate(move, {
        command: editing.command,
        value: editing.value,
      })
      update()
    },
    [svg, editing, update]
  )

  const edit = useCallback<UseEditProperty['edit']>(
    (arg) => {
      if (editing.path === undefined) return
      const path = svg.paths[editing.path]
      new EditPath(path).edit(arg)
      update()
    },
    [editing.path, svg.paths, update]
  )

  const cancel = useCallback<UseEditProperty['cancel']>(() => {
    setEditing(initEditing)
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
