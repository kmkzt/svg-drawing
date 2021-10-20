import { Animation, AnimateObject } from '@svg-drawing/animation'
import { useCallback, useState, useMemo } from 'react'
import type { Path } from '@svg-drawing/core'

type UseAnimation = (arg: { paths: Path[] }) => [
  AnimateObject | null,
  {
    update: () => void
    clear: () => void
    setup: Animation['setup']
  },
  Animation
]

export const useAnimation: UseAnimation = ({ paths }) => {
  const [animateObject, setAnimateObject] = useState<AnimateObject | null>(null)

  const animation = useMemo(() => new Animation(), [])

  const setup = useCallback<Animation['setup']>(
    (frame, opts) => {
      animation.setup(frame, opts)
    },
    [animation]
  )

  const update = useCallback(() => {
    animation.initialize(paths)
    setAnimateObject(animation.toJson())
  }, [animation, paths])

  const clear = useCallback(() => {
    setAnimateObject(null)
  }, [])

  return [
    animateObject,
    {
      setup,
      update,
      clear,
    },
    animation,
  ]
}
