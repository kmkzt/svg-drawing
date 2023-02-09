import { EditEventHandler } from '@svg-drawing/core'
import { useEffect, useMemo } from 'react'
import type { UseEditEventHandler } from '../types'

export const useEditEventHandler: UseEditEventHandler = (
  ref,
  edit,
  { multipleSelectBindKey } = {}
) => {
  const editEventHandler = useMemo(
    () => new EditEventHandler(edit, { multipleSelectBindKey }),
    [edit, multipleSelectBindKey]
  )

  // Setup listener
  useEffect(() => {
    const el = ref.current
    if (!el) return

    editEventHandler.setup(el)

    return () => {
      editEventHandler.cleanup()
    }
  }, [ref, editEventHandler])
}
