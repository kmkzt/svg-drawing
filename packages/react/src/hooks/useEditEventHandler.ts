import { EditEventHandler } from '@svg-drawing/core'
import { useMemo } from 'react'
import { useEventHandler } from './useEventHandler'
import type { UseEditEventHandler } from '../types'

export const useEditEventHandler: UseEditEventHandler = (
  ref,
  edit,
  active,
  { multipleSelectBindKey } = {}
) => {
  const handler = useMemo(
    () => new EditEventHandler(edit, { multipleSelectBindKey }),
    [edit, multipleSelectBindKey]
  )

  useEventHandler({ ref, handler, active })
}
