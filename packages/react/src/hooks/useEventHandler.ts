import { useEffect } from 'react'
import type { EventHandler } from '@svg-drawing/core'
import type { RefObject } from 'react'

/**
 * @example <caption>useEventHandler</caption>
 *
 * ```ts
 * const ref = useRef(null)
 * const handler = useSetupHandler(setup, drawing)
 *
 * useEventHandler({ ref, handler })
 * ```
 */
export const useEventHandler = <E extends HTMLElement = HTMLElement>({
  ref,
  handler,
  active = true,
}: {
  ref: RefObject<E>
  handler: EventHandler<E>
  active?: boolean
}) => {
  useEffect(() => {
    if (!ref.current || !active) return

    // Setup
    const el = ref.current
    handler.setup(el)

    return () => handler.cleanup()
  }, [active, handler, ref])
}
