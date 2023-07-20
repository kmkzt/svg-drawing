import React, { useMemo } from 'react'
import { useSvgContext } from './SvgContext'
import type { AnimatesProps } from '../types'

export const Animates = ({ elementKey }: AnimatesProps) => {
  const { animationProps } = useSvgContext()

  const animates = useMemo(
    () => (elementKey ? animationProps?.getAnimates(elementKey) : undefined),
    [animationProps, elementKey]
  )

  return (
    <>
      {animates?.map((animAttrs, i) => (
        <animate key={i} {...animAttrs} />
      ))}
    </>
  )
}
