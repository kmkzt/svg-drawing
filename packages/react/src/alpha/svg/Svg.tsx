import React from 'react'
import type { SvgObject } from '@svg-drawing/core'
import type { HTMLAttributes } from 'react'

export const Svg = ({
  background,
  paths,
  width,
  height,
  ...rest
}: SvgObject & HTMLAttributes<SVGSVGElement>) => (
  <svg width={width} height={height} {...rest}>
    {background && <rect width={width} height={height} fill={background} />}
    {paths.map((pathAttr, i) => (
      <path key={i} {...pathAttr} />
    ))}
  </svg>
)
