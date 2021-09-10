import { useEffect, useMemo } from 'react'
import { UseDrawHandler } from '../types'

/**
 * @example
 *   import { PencilHandler } from '@svg-drawing/core'
 *
 *   const ref = useRef(null)
 *   const drawHandler = useDrawHandler(ref, PencilHandler)
 *
 * @example <caption>Switch active status</caption>
 *   import { PencilHandler } from '@svg-drawing/core'
 *
 *   const ref = useRef(null)
 *   const [active, setActive] = useState(true)
 *   const drawHandler = useDrawHandler(ref, PencilHandler, active)
 */
export const useDrawHandler: UseDrawHandler = (ref, Handler, active = true) => {
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
