import { useEffect } from 'react'
import type { UseDrawEventHandler } from '../types'

/**
 * @example
 *   import { PencilHandler } from '@svg-drawing/core'
 *
 *   const ref = useRef(null)
 *   const handler = useMemo(() => new PencilHandler(), [])
 *   useDrawEventHandler(ref, handler)
 *
 * @example <caption>Switch active status</caption>
 *   import { PencilHandler } from '@svg-drawing/core'
 *
 *   const ref = useRef(null)
 *   const [active, setActive] = useState(true)
 *   const handler = useMemo(() => new PencilHandler(), [])
 *   useDrawEventHandler(ref, handler, active)
 *
 * @example <caption>Switch pen and pencil handler</caption>
 *   import { PencilHandler, PenHandler } from '@svg-drawing/core'
 *
 *   const ref = useRef(null)
 *   const [type, setType] = useState('pencil')
 *   const handler = useMemo(() => {
 *     switch (type) {
 *       case 'pen':
 *         return new PenHandler()
 *       case 'pencil':
 *       default:
 *         return new PencilHandler()
 *     }
 *   }, [type])
 *   useDrawEventHandler(ref, handler)
 */
export const useDrawEventHandler = <E extends HTMLElement = HTMLElement>(
  ...[ref, handler, active = true]: Parameters<UseDrawEventHandler<E>>
) => {
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
}
