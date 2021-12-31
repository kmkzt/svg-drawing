import { Animation } from '@svg-drawing/core'
import { useCallback, useMemo } from 'react'
import type { UseAnimation } from '../types'

export const useAnimation: UseAnimation = ({ onChangeAnimation }) => {
  const instance = useMemo<ReturnType<UseAnimation>['instance']>(
    () => new Animation(),
    []
  )

  const setup = useCallback<ReturnType<UseAnimation>['setup']>(
    (frame, opts) => {
      instance.setup(frame, opts)
    },
    [instance]
  )

  const update = useCallback<ReturnType<UseAnimation>['update']>(
    (paths) => {
      instance.initialize(paths)
      onChangeAnimation(instance.toJson())
    },
    [instance, onChangeAnimation]
  )

  const clear = useCallback<ReturnType<UseAnimation>['clear']>(() => {
    onChangeAnimation(null)
  }, [onChangeAnimation])

  return {
    instance,
    setup,
    update,
    clear,
  }
}
