import { EditHandler } from '@svg-drawing/core'
import { useMemo } from 'react'
import { useEventHandler } from './useEventHandler'
import type { UseEditEventHandler } from '../types'

export const useEditHandler: UseEditEventHandler = (
  ref,
  edit,
  active,
  { multipleSelectBindKey } = {}
) => {
  const handler = useMemo(
    () => new EditHandler(edit, { multipleSelectBindKey }),
    [edit, multipleSelectBindKey]
  )

  useEventHandler({ ref, handler, active })
}
