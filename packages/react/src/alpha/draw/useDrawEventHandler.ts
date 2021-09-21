import { useEffect, useMemo } from 'react'
import type { UseDrawEventHandler } from '../types'
import type { DrawEventHandler } from '@svg-drawing/core'

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
export const useDrawEventHandler = <
  D extends DrawEventHandler = any,
  E extends HTMLElement = HTMLElement
>(
  ...[ref, Handler, active = true]: Parameters<UseDrawEventHandler<D, E>>
): D => {
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

  return handler as D
}
