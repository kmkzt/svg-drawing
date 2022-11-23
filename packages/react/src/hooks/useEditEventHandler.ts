import {
  TranslatePathHandler,
  ResizePathHandler,
  dataEditType,
  dataPathKey,
  dataVertexType,
  dataCommandIndex,
  dataPointIndex,
} from '@svg-drawing/core'
import { useCallback, useMemo, useEffect } from 'react'
import { usePressedKey } from './usePressedKey'
import type { UseEditEventHandler } from '../types'
import type { VertexType, SelectIndex } from '@svg-drawing/core'

export const useEditEventHandler: UseEditEventHandler = (
  ref,
  edit,
  { multipleSelectBindKey = 'ShiftKey' } = {}
) => {
  const translatePathHandler = useMemo(
    () => new TranslatePathHandler(edit),
    [edit]
  )
  const resizePathHandler = useMemo(() => new ResizePathHandler(edit), [edit])

  const multipleSelect = usePressedKey(multipleSelectBindKey)

  const selectPaths = useCallback(
    (sel: SelectIndex) => edit.select(sel, multipleSelect.current),
    [edit, multipleSelect]
  )

  const editHandler = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      const el = ev.target as HTMLElement
      const editType = el.getAttribute(dataEditType)
      // DEBUG: console.info(ev.target, editType)

      // path
      if (editType === 'path') {
        const pathKey = el.getAttribute(dataPathKey)
        if (!pathKey) return
        selectPaths({ path: pathKey })
        translatePathHandler.start(ev)
        return
      }

      // point
      if (editType === 'point') {
        const pathKey = el.getAttribute(dataPathKey)
        const commandIndex = el.getAttribute(dataCommandIndex)
        const pointIndex = el.getAttribute(dataPointIndex)

        if (!pathKey) return
        if (commandIndex === null) return
        if (pointIndex === null) return

        selectPaths({
          path: pathKey,
          command: +commandIndex,
          point: +pointIndex,
        })
        translatePathHandler.start(ev)
      }

      // bounding-box
      if (editType === 'bounding-box') {
        edit.selectBoundingBox()
        translatePathHandler.start(ev)
        return
      }

      // bounding-box-vertex
      if (editType === 'bounding-box-vertex') {
        const vertexType = el.getAttribute(dataVertexType)
        if (!vertexType) return

        resizePathHandler.start(ev, vertexType as VertexType)

        return
      }

      if (editType === 'frame') {
        edit.cancel()
      }
    },
    [edit, resizePathHandler, selectPaths, translatePathHandler]
  )

  // Setup listener
  useEffect(() => {
    const el = ref.current

    if (!el) return

    el.addEventListener('mousedown', editHandler)
    el.addEventListener('touchstart', editHandler)

    return () => {
      el.removeEventListener('mousedown', editHandler)
      el.removeEventListener('touchstart', editHandler)
    }
  }, [editHandler, ref])

  // Cleanup
  useEffect(
    () => () => {
      resizePathHandler.end()
      translatePathHandler.end()
    },
    [resizePathHandler, translatePathHandler]
  )
}
