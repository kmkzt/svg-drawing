import { useEffect, useMemo } from 'react'
import { UseDrawEventHandler } from '../types'

/**
 * @example
 *   import { PencilHandler } from '@svg-drawing/core'
 *
 *   const ref = useRef(null)
 *   const drawHandler = useDrawEventHandler(ref, PencilHandler)
 *
 * @example <caption>Switch active status</caption>
 *   import { PencilHandler } from '@svg-drawing/core'
 *
 *   const ref = useRef(null)
 *   const [active, setActive] = useState(true)
 *   const drawHandler = useDrawEventHandler(ref, PencilHandler, active)
 */
export const useDrawEventHandler: UseDrawEventHandler = (
  ref,
  Handler,
  active = true
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
