import { PencilHandler, PenHandler } from '@svg-drawing/core'
import { useMemo } from 'react'
import { useEventHandler } from './useEventHandler'
import type { UseDrawEventHandler } from '../types'

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

  useEventHandler({ ref, handler, active })
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

  useEventHandler({ ref, handler: handler, active })
}
