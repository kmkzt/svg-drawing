import { PencilHandler, PenHandler } from '@svg-drawing/core'
import { useCallback, useEffect, useMemo } from 'react'
import type { UseDrawEventHandler } from '../types'
import type { DrawEventHandler, DrawingClass } from '@svg-drawing/core'
import type { RefObject } from 'react'

/**
 * @example <caption>useDrawEventHandler</caption>
 *
 * ```ts
 * const ref = useRef(null)
 * const handler = useSetupHandler(setup, drawing)
 *
 * UseDrawEventHandler({ ref, handler })
 * ```
 */
export const useDrawEventHandler = <E extends HTMLElement = HTMLElement>({
  ref,
  handler,
  active = true,
}: {
  ref: RefObject<E>
  handler: DrawEventHandler
  active?: boolean
}) => {
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

/**
 * @example
 *
 * ```ts
 * import { usePencilHandler } from '@svg-drawing/react'
 *
 * const draw = useDraw({...}) const ref = uesRef<HTMLElement>(null)
 *
 * usePencilHandler(ref, draw)
 * ```
 *
 * @example <caption>Switch active status</caption>
 *
 * ```ts
 * import { usePencilHandler } from '@svg-drawing/react'
 *
 * const draw = useDraw(opts) const ref = uesRef<HTMLElement>(null)
 * const [active, setActive] = useState(true)
 *
 * usePencilHandler(ref, draw, active)
 * ```
 */
export const usePencilHandler: UseDrawEventHandler = (ref, drawing, active) => {
  const handler = useMemo(() => new PencilHandler(drawing), []) // eslint-disable-line react-hooks/exhaustive-deps

  useDrawEventHandler({ ref, handler, active })
}

/**
 * @example
 *
 * ```ts
 * import { usePenHandler } from '@svg-drawing/react'
 *
 * const draw = useDraw({...}) const ref = uesRef<HTMLElement>(null)
 *
 * usePenHandler(ref, draw)
 * ```
 *
 * @example <caption>Switch active status</caption>
 *
 * ```ts
 * import { usePenHandler } from '@svg-drawing/react'
 *
 * const draw = useDraw(opts)
 * const ref = useRef(null)
 * const [active, setActive] = useState(true)
 *
 * usePenHandler(ref, draw, active)
 * ```
 */
export const usePenHandler: UseDrawEventHandler = (ref, drawing, active) => {
  const handler = useMemo(() => new PenHandler(drawing), []) // eslint-disable-line react-hooks/exhaustive-deps

  useDrawEventHandler({ ref, handler: handler, active })
}
