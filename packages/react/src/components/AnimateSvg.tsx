import { AnimationObject } from '@svg-drawing/animation'
import React from 'react'
import { BackgroundRect } from './BackgroundRect'
import type { SvgObject } from '@svg-drawing/core'
import type { HTMLAttributes } from 'react'

export const AnimateSvg = ({
  background,
  width,
  height,
  paths,
  animatePaths,
  ...rest
}: SvgObject & {
  animatePaths?: AnimationObject
} & HTMLAttributes<SVGSVGElement>) => (
  <svg width={width} height={height} {...rest}>
    {background && <BackgroundRect fill={background} />}
    {paths.map(({ type, attributes }, i) => {
      const animates = animatePaths?.[`t${i}`] ?? []
      return (
        <path key={i} {...attributes}>
          {animates.map(({ type, attributes: animAttrs }, i) => (
            <animate key={i} {...animAttrs} />
          ))}
        </path>
      )
    })}
  </svg>
)
