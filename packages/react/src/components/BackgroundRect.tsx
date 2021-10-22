import React from 'react'
import type { SvgObject } from '@svg-drawing/core'

export const BackgroundRect = ({ fill }: { fill: SvgObject['background'] }) => (
  <rect
    style={{ pointerEvents: 'none' }}
    width="100%"
    height="100%"
    fill={fill}
  />
)
