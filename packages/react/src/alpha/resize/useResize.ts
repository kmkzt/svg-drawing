import { useEffect, useMemo } from 'react'
import { ResizeHandler } from '@svg-drawing/core'
import { UseResize } from '../types'

export const useResize: UseResize = (ref, onResize) => {
  /**
   * Setup ResizeHandler
   */
  const resizeListener = useMemo<ResizeHandler>(() => new ResizeHandler(), [])

  useEffect(() => {
    if (!ref.current) return

    resizeListener.setElement(ref.current)
    resizeListener.setHandler(onResize)
    resizeListener.on()

    return () => resizeListener.off()
  }, [onResize, resizeListener, ref])

  return resizeListener
}
