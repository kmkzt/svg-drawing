import { dataEditType, dataPathKey } from '@svg-drawing/core'
import React from 'react'
import { Animates } from './Animates'
import type { PathObject } from '@svg-drawing/core'
import type { ReactNode, SVGProps } from 'react'

type PathProps = {
  pathKey: PathObject['key']
  children?: ReactNode
} & SVGProps<SVGPathElement>

export const Path = ({ pathKey, children, ...attrs }: PathProps) => (
  <path
    {...{
      [dataEditType]: 'path',
      [dataPathKey]: pathKey,
    }}
    {...attrs}
  >
    {children ?? <Animates pathKey={pathKey} />}
  </path>
)
