import { BasicPathFactory, PathFactory, PathObject } from '@svg-drawing/core'
import { useMemo } from 'react'

export const usePathFactory = (
  pathAttrs: PathObject,
  {
    curve,
    close,
  }: {
    curve: boolean
    close: boolean
  }
): PathFactory =>
  useMemo<PathFactory>(
    () => new BasicPathFactory(pathAttrs, { curve, close }),
    [close, curve, pathAttrs]
  )
