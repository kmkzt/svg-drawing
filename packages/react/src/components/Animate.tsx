import React from 'react'
import type { AnimatePathsProps } from '../types'

export const AnimatePaths = ({ paths, animatePaths }: AnimatePathsProps) => (
  <>
    {paths.map(({ key, attributes }, i) => {
      const animates = animatePaths?.[key] ?? []
      return (
        <path key={i} {...attributes}>
          {animates.map(({ type, attributes: animAttrs }, i) => (
            <animate key={i} {...animAttrs} />
          ))}
        </path>
      )
    })}
  </>
)
