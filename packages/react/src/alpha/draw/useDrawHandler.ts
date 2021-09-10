import { useEffect, useMemo } from 'react'
import { DrawHandler } from '@svg-drawing/core'
import { UseDrawHandler } from '../types'

/**
 * @example
 *   import { PencilHandler } from '@svg-drawing/core'
 *
 *   const ref = useRef(null)
 *   const drawHandler = useDrawHandler(ref, PencilHandler, true)
 */
export const useDrawHandler: UseDrawHandler = (
  ref,
  Handler: typeof DrawHandler,
  active: boolean
) => {
  const handler = useMemo(() => new Handler(), [Handler])

  useEffect(() => {
    const cleanup = () => handler.off()

    // Fallback
    if (!ref.current) {
      return cleanup
    }

    // Setup
    const el = ref.current
    handler.setElement(el)
    if (active) handler.on()

    return cleanup
  }, [active, handler, ref])

  return handler
}
