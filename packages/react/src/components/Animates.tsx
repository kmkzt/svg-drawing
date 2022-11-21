import React, { useMemo } from 'react'
import { useSvgContext } from './SvgContext'
import type { AnimatesProps } from '../types'

export const Animates = ({ pathKey }: AnimatesProps) => {
  const { animationProps } = useSvgContext()

  const animates = useMemo(
    () => animationProps?.getAnimates(pathKey),
    [animationProps, pathKey]
  )

  return (
    <>
      {animates?.map((animAttrs, i) => (
        <animate key={i} {...animAttrs} />
      ))}
    </>
  )
}
