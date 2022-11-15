import React from 'react'
import { EditLayer } from './EditLayer'
import { Path } from './Path'
import type { PathsProps } from '../types'

export const Paths = ({ paths }: PathsProps) => {
  return (
    <>
      {paths.map((pathObject) => (
        <Path key={pathObject.key} path={pathObject} />
      ))}
      <EditLayer />
    </>
  )
}
