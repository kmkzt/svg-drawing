import React from 'react'
import { BackgroundRect } from './BackgroundRect'
import type { SvgProps } from '../types'

export const Svg = ({
  background,
  width,
  height,
  paths,
  ...rest
}: SvgProps) => (
  <svg width={width} height={height} {...rest}>
    {background && <BackgroundRect fill={background} />}
    {paths.map(({ type, attributes }, i) => (
      <path key={i} {...attributes} />
    ))}
  </svg>
)
