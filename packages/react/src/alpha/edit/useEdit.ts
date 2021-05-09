import { useState, useCallback, useMemo } from 'react'
import { EditPath } from '@svg-drawing/core'
import type { UseEditOptions, UseEdit, UseEditProperty } from './types'
import { useSvg } from '../svg/useSvg'
import { KeyBindMap, useKeyBind } from '../keyboard'

export const useEdit = <T extends HTMLElement>({
  sharedSvg,
}: UseEditOptions = {}): UseEdit<T> => {
  const [ref, svgObj, { svg, update, resize }] = useSvg<T>({ sharedSvg })
  const [selecting, setEditing] = useState<UseEditProperty['selecting']>(null)
  const select = useCallback<UseEditProperty['select']>((selectIndex) => {
    setEditing(selectIndex)
  }, [])

  const editPath: EditPath | null = useMemo(() => {
    if (!selecting) return null
    const path = svg.paths[selecting.path] ?? null
    if (!path) return null
    return new EditPath(path)
  }, [selecting, svg.paths])

  const move = useCallback<UseEditProperty['move']>(
    (move) => {
      if (!editPath) return
      editPath.translate(move, {
        command: selecting?.command,
        value: selecting?.value,
      })
      update()
    },
    [editPath, selecting, update]
  )

  const changeAttributes = useCallback<UseEditProperty['changeAttributes']>(
    (arg) => {
      if (!editPath) return
      editPath.edit(arg)
      update()
    },
    [editPath, update]
  )

  const deletePath = useCallback<UseEditProperty['deletePath']>(() => {
    if (!selecting) return
    svg.deletePath(selecting.path)
    update()
    setEditing(null)
  }, [selecting, svg, update])

  const cancel = useCallback<UseEditProperty['cancel']>(() => {
    setEditing(null)
  }, [])

  const keyBindMap = useMemo<KeyBindMap>(() => {
    if (!selecting) return {}
    return {
      ['Escape']: cancel,
      ['Tab']: () => {
        const { path } = selecting
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
  }, [selecting, cancel, deletePath, select, svg.paths.length, move])
  useKeyBind(keyBindMap)

  return [
    ref,
    svgObj,
    {
      svg,
      update,
      resize,
      selecting,
      select,
      move,
      changeAttributes,
      deletePath,
      cancel,
    },
  ]
}
