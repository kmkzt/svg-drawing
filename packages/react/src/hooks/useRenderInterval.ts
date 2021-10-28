import { useCallback, useRef, useEffect } from 'react'

const RENDER_INTERVAL = 30

export const useRenderInterval = (
  render: () => void,
  ms: number | undefined = RENDER_INTERVAL
): (() => void) => {
  const shouldUpdateRef = useRef<boolean>(false)

  const update = useCallback(() => {
    shouldUpdateRef.current = true
  }, [])

  useEffect(() => {
    const stopId = setInterval(() => {
      if (!shouldUpdateRef.current) return

      shouldUpdateRef.current = false
      render()
    }, ms)

    return () => clearInterval(stopId)
  }, [ms, render])

  return update
}
