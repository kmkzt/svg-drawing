import { Svg } from '@svg-drawing/core'
import { useCallback, useMemo } from 'react'
import type { UseSvg } from '../types'
import type { RenderParams } from '@svg-drawing/core'

export const useSvg: UseSvg = (defaultSvgOption) => {
  const svg = useMemo(
    () => new Svg({ width: 0, height: 0, ...(defaultSvgOption || {}) }),
    [] // eslint-disable-line
  )

  const getInitialState = useCallback(
    (): RenderParams => ({
      svg: svg.toJson(),
      edit: undefined,
      animation: undefined,
    }),
    [svg]
  )

  return {
    svg,
    getInitialState,
  }
}
