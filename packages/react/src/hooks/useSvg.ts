import { Svg } from '@svg-drawing/core'
import { useMemo } from 'react'
import type { UseSvg } from '../types'

export const useSvg: UseSvg = (defaultSvgOption) =>
  useMemo(
    () => new Svg({ width: 0, height: 0, ...(defaultSvgOption || {}) }),
    [] // eslint-disable-line
  )
