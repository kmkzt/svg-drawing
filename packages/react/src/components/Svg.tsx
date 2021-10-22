import React from 'react'
import { BackgroundRect } from './BackgroundRect'
import type { SvgObject } from '@svg-drawing/core'
import type { HTMLAttributes } from 'react'

export const Svg = ({
  background,
  width,
  height,
  paths,
  ...rest
}: SvgObject & HTMLAttributes<SVGSVGElement>) => (
  <svg width={width} height={height} {...rest}>
    {background && <BackgroundRect fill={background} />}
    {paths.map(({ type, attributes }, i) => (
      <path key={i} {...attributes} />
    ))}
  </svg>
)
