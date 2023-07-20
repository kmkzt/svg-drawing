import { BasicDrawFactory } from '@svg-drawing/core'
import { useMemo } from 'react'
import type { DrawFactory, PathAttributes } from '@svg-drawing/core'

export const useDrawFactory = (
  pathAttrs: PathAttributes,
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
