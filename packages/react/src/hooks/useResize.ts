import { ResizeHandler } from '@svg-drawing/core'
import { useEffect, useMemo } from 'react'
import { useEventHandler } from './useEventHandler'
import type { UseResize } from '../types'

export const useResize: UseResize = (ref, onResize, active = true) => {
  const handler = useMemo<ResizeHandler>(() => new ResizeHandler(), [])

  useEffect(() => {
    handler.setHandler(onResize)
  }, [onResize, handler, active])

  useEventHandler({ ref, handler, active })
}
