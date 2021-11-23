import { Animation } from '@svg-drawing/core'
import { useCallback, useMemo } from 'react'
import type { UseAnimation } from '../types'
import type { Path } from '@svg-drawing/core'

export const useAnimation: UseAnimation = ({ onChangeAnimation }) => {
  const instance = useMemo(() => new Animation(), [])

  const setup = useCallback<Animation['setup']>(
    (frame, opts) => {
      instance.setup(frame, opts)
    },
    [instance]
  )

  const update = useCallback(
    (paths: Path[]) => {
      instance.initialize(paths)
      onChangeAnimation(instance.toJson())
    },
    [instance, onChangeAnimation]
  )

  const clear = useCallback(() => {
    onChangeAnimation(null)
  }, [onChangeAnimation])

  return {
    instance,
    setup,
    update,
    clear,
  }
}
