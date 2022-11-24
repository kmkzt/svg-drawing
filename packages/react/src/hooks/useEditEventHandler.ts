import { SvgEditing } from '@svg-drawing/core'
import { useEffect, useMemo } from 'react'
import type { UseEditEventHandler } from '../types'

export const useEditEventHandler: UseEditEventHandler = (
  ref,
  edit,
  { multipleSelectBindKey } = {}
) => {
  const svgEditing = useMemo(
    () => new SvgEditing(edit, { multipleSelectBindKey }),
    [edit, multipleSelectBindKey]
  )

  // Setup listener
  useEffect(() => {
    const el = ref.current
    if (!el) return

    svgEditing.start(el)

    return () => {
      svgEditing.end()
    }
  }, [ref, svgEditing])
}
