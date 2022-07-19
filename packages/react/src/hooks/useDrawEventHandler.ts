import { PencilHandler, PenHandler } from '@svg-drawing/core'
import { useCallback, useEffect, useMemo } from 'react'
import type { UseDrawEventHandler } from '../types'
import type { DrawEventHandler, DrawingClass } from '@svg-drawing/core'
import type { RefObject } from 'react'

/**
 * ### Switch pen or pencil.
 *
 * ```ts
 * const type = useState<'pen' | 'pencil'>('pen')
 * const setup = useCallback(
 *   (draw) => {
 *     switch (type) {
 *       case 'pen':
 *         return new PenHandler(draw)
 *       case 'pencil':
 *       default:
 *         return new PencilHandler(draw)
 *     }
 *   },
 *   [type]
 * )
 *
 * const handler = useSetupHandler(setup, drawing)
 * ```
 */
export const useSetupHandler = (
  setup: (draw: DrawingClass) => DrawEventHandler,
  draw: DrawingClass
): DrawEventHandler => {
  const handler = useMemo(() => setup(draw), [setup]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    handler.setDrawing(draw)
  }, [draw, handler])

  return handler
}

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
  const setup = useCallback((draw: DrawingClass) => new PencilHandler(draw), [])

  const handler = useSetupHandler(setup, drawing)

  useDrawEventHandler({ ref, handler: handler, active })
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
  const setup = useCallback((draw: DrawingClass) => new PenHandler(draw), [])

  const handler = useSetupHandler(setup, drawing)

  useDrawEventHandler({ ref, handler: handler, active })
}
