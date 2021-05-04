import { useState, useCallback, useMemo, useEffect } from 'react'
import { EditPath } from '@svg-drawing/core'
import type { UseEditOptions, UseEdit, UseEditProperty } from './types'
import { useSvg } from '../svg/useSvg'
import { KeyBindMap, useKeyBind } from '../keyboard'

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

  const deletePath = useCallback<UseEditProperty['delete']>(() => {
    if (!editing) return
    svg.deletePath(editing.path)
    setEditing(null)
  }, [editing, svg])

  const cancel = useCallback<UseEditProperty['cancel']>(() => {
    setEditing(null)
  }, [])

  const keyBindMap = useMemo<KeyBindMap>(() => {
    if (!editing) return {}
    return {
      ['Escape']: cancel,
      ['Tab']: () => {
        const { path } = editing
        if (typeof path === 'number') {
          select({
            path: svg.paths.length - 1 > path ? path + 1 : 0,
          })
        }
      },
      ['ArrowRight']: () => move({ x: 0.5, y: 0 }),
      ['ArrowLeft']: () => move({ x: -0.5, y: 0 }),
      ['ArrowUp']: () => move({ x: 0, y: -0.5 }),
      ['ArrowDown']: () => move({ x: 0, y: 0.5 }),
      ['Backspace']: deletePath,
    }
  }, [editing, cancel, deletePath, select, svg.paths.length, move])
  useKeyBind(keyBindMap)

  useEffect(() => {
    const handleMouseDown = (ev: MouseEvent) => {
      if (!ev.target) return
      if (!ref.current?.contains(ev.target as Node)) cancel()
    }
    window.addEventListener('mousedown', handleMouseDown)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [cancel, ref])

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
      deletePath,
      cancel,
    },
  ]
}
