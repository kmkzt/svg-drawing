import { Animation } from '@svg-drawing/animation'
import { useCallback, useRef } from 'react'
import type { Svg } from '@svg-drawing/core'

export const useAnimation = ({
  ms,
  sharedSvg,
  background,
}: {
  ms: number
  sharedSvg: Svg
  background: string
}): Animation['setAnimation'] => {
  const targetRef = useRef<HTMLDivElement | null>(null)

  const setupAnimation = useCallback(
    (...arg: Parameters<Animation['setAnimation']>) => {
      if (!targetRef.current) return

      const animation = new Animation({ ms })
      animation.setAnimation(...arg)
      animation.initialize(sharedSvg)

      const animationSvg = animation.toElement()
      targetRef.current.replaceChild(
        animationSvg,
        targetRef.current.childNodes[0]
      )
    },
    [ms, sharedSvg]
  )

  return setupAnimation
}
