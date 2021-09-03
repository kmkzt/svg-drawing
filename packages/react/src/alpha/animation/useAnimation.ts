import { useCallback, useRef } from 'react'
import { Animation } from '@svg-drawing/animation'
import { Svg } from '@svg-drawing/core/lib'

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

      const animation = new Animation(sharedSvg)
      animation.setAnimation(...arg)

      const animationSvg = animation.toElement()
      targetRef.current.replaceChild(
        animationSvg,
        targetRef.current.childNodes[0]
      )
    },
    [sharedSvg]
  )

  return setupAnimation
}
