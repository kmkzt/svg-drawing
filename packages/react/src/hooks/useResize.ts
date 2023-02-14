import { ResizeHandler } from '@svg-drawing/core'
import { useEffect, useMemo } from 'react'
import type { UseResize } from '../types'

export const useResize: UseResize = (ref, onResize, active = true) => {
  const resizeListener = useMemo<ResizeHandler>(() => new ResizeHandler(), [])

  useEffect(() => {
    const cleanup = () => resizeListener.cleanup()

    if (!ref.current) return cleanup

    const el = ref.current
    resizeListener.setElement(el)
    resizeListener.setHandler(onResize)
    if (active) resizeListener.setup()

    return cleanup
  }, [onResize, resizeListener, ref, active])
}
