import { useCallback, useRef, useEffect } from 'react'

const RENDER_INTERVAL = 30

type UpdateCallback = () => void

export const useRenderInterval = (
  ms: number | undefined = RENDER_INTERVAL
): ((update: UpdateCallback) => void) => {
  const updateCallback = useRef<UpdateCallback | null>(null)

  const render = useCallback((update: UpdateCallback) => {
    const reset = () => {
      updateCallback.current = null
    }

    updateCallback.current = () => {
      reset()
      update()
    }
  }, [])

  useEffect(() => {
    const stopId = setInterval(() => {
      updateCallback.current?.()
    }, ms)

    return () => clearInterval(stopId)
  }, [ms, render])

  return render
}
