import { useEffect, useMemo } from 'react'
import { DrawHandler } from '@svg-drawing/core'
import { UseDrawHandler } from '../types'

/**
 * @todo Fix drawHandler type. change to DrawEventHandler
 */
export const useDrawHandler: UseDrawHandler = (
  ref,
  Handler: typeof DrawHandler,
  active: boolean
) => {
  const handler = useMemo(() => new Handler(), [Handler])

  // Setup
  useEffect(() => {
    const el = ref.current
    if (!el) {
      handler.off()
      return
    }

    handler.setElement(el)

    if (active) handler.on()
    else handler.off()
  }, [active, handler, ref])

  // Clean up
  useEffect(() => {
    return () => handler.off()
  }, [handler])

  return handler
}
