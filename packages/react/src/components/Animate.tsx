import React from 'react'
import { Path } from './Path'
import type { AnimatePathsProps } from '../types'

export const AnimatePaths = ({ paths, animatePaths }: AnimatePathsProps) => (
  <>
    {paths.map(({ key, attributes }) => {
      const animates = animatePaths?.[key] ?? []
      return (
        <Path key={key} pathKey={key} {...attributes}>
          {animates.map(({ type, attributes: animAttrs }, i) => (
            <animate key={i} {...animAttrs} />
          ))}
        </Path>
      )
    })}
  </>
)
