import { useState, useCallback, useMemo } from 'react'
import { EditPath } from '@svg-drawing/core'
import type { UseEditOptions, UseEdit, UseEditProperty } from './types'
import { useSvg } from '../svg/useSvg'
import { KeyBindMap, useKeyBind } from '../keyboard'

export const useEdit = <T extends HTMLElement>({
  sharedSvg,
}: UseEditOptions = {}): UseEdit<T> => {
  const [ref, svgObj, { svg, update, ...rest }] = useSvg<T>({ sharedSvg })
  const [selecting, setSelecting] = useState<UseEditProperty['selecting']>(null)

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

  const deleteAction = useCallback<UseEditProperty['delete']>(() => {
    if (!selecting) return
    svg.deletePath(selecting.path)
    update()
    setSelecting(null)
  }, [selecting, svg, update])

  const cancel = useCallback<UseEditProperty['cancel']>(() => {
    setSelecting(null)
  }, [])

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
      select: setSelecting,
      move,
      changeAttributes,
      delete: deleteAction,
      cancel,
      ...rest,
    },
  ]
}
