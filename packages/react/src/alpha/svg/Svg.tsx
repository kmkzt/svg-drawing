import React from 'react'
import type { SvgProps } from './types'

export const Svg = ({
  background,
  paths,
  width,
  height,
  ...rest
}: SvgProps) => (
  <svg width={width} height={height} {...rest}>
    {background && <rect width={width} height={height} fill={background} />}
    {paths.map((pathAttr, i) => (
      <path key={i} {...pathAttr} />
    ))}
  </svg>
)
