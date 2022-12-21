import { dataEditType, dataPathKey } from '@svg-drawing/core'
import React from 'react'
import { Animates } from './Animates'
import type { PathObject } from '@svg-drawing/core'
import type { ReactNode, SVGProps } from 'react'

type PathProps = {
  elementKey?: PathObject['key']
  children?: ReactNode
} & SVGProps<SVGPathElement>

export const Path = ({ elementKey, children, ...attrs }: PathProps) => (
  <path
    {...(elementKey && {
      [dataEditType]: 'path',
      [dataPathKey]: elementKey,
    })}
    {...attrs}
  >
    {children ?? <Animates elementKey={elementKey} />}
  </path>
)
