import React from 'react'
import type { PathsProps } from '..'

export const Paths = ({ paths }: PathsProps) => (
  <>
    {paths.map(({ type, attributes }, i) => (
      <path key={i} {...attributes} />
    ))}
  </>
)
