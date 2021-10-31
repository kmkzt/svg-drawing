import { useCallback, useRef, useEffect } from 'react'

const RENDER_INTERVAL = 30

type UpdateCallback = () => void

export const useRenderInterval = (
  ms: number | undefined = RENDER_INTERVAL
): ((update: UpdateCallback) => void) => {
  const updateCallback = useRef<null | (() => void)>(null)

  const render = useCallback((update: UpdateCallback) => {
    updateCallback.current = () => {
      updateCallback.current = null
      update()
    }
  }, [])

  useEffect(() => {
    const stopId = setInterval(() => {
      if (!updateCallback.current) return

      updateCallback.current()
    }, ms)

    return () => clearInterval(stopId)
  }, [ms, render])

  return render
}
