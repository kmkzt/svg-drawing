import React from 'react'
import { Path } from './Path'
import type { AnimatePathsProps } from '../types'

export const AnimatePaths = ({ paths, animatePaths }: AnimatePathsProps) => (
  <>
    {paths.map((path) => {
      const animates = animatePaths?.[path.key] ?? []
      return (
        <Path key={path.key} path={path}>
          {animates.map(({ type, attributes: animAttrs }, i) => (
            <animate key={i} {...animAttrs} />
          ))}
        </Path>
      )
    })}
  </>
)
