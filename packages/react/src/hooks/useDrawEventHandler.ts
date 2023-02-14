import { PencilHandler, PenHandler } from '@svg-drawing/core'
import { useEffect, useMemo } from 'react'
import type { UseDrawEventHandler } from '../types'
import type { DrawEventHandler } from '@svg-drawing/core'
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
    if (!ref.current) return

    // Setup
    const el = ref.current
    handler.setElement(el)
    if (active) handler.setup()

    return () => handler.cleanup()
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
  const handler = useMemo(() => new PencilHandler(drawing), [drawing])

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
  const handler = useMemo(() => new PenHandler(drawing), [drawing])

  useDrawEventHandler({ ref, handler: handler, active })
}
