import { BasicDrawFactory, DrawFactory, PathObject } from '@svg-drawing/core'
import { useMemo } from 'react'

export const useDrawFactory = (
  pathAttrs: PathObject,
  {
    curve,
    close,
  }: {
    curve: boolean
    close: boolean
  }
): DrawFactory =>
  useMemo<DrawFactory>(
    () => new BasicDrawFactory(pathAttrs, { curve, close }),
    [close, curve, pathAttrs]
  )
