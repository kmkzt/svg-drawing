import { SvgEditing } from '@svg-drawing/core'
import { useEffect, useState } from 'react'
import type { UseEditEventHandler } from '../types'

export const useEditEventHandler: UseEditEventHandler = (
  ref,
  edit,
  { multipleSelectBindKey } = {}
) => {
  const [svgEditing] = useState(new SvgEditing(edit, { multipleSelectBindKey }))

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
