import { dataFrameAttributes } from '@svg-drawing/core'
import React, { forwardRef } from 'react'
import { BoundingBox } from './BoundingBox'
import { EditElements } from './EditElements'
import { Path } from './Path'
import { SvgProvider } from './SvgContext'
import type { SvgProps } from '../types'

export const Svg = forwardRef<SVGSVGElement, SvgProps>(
  (
    { width, height, background, elements, editProps, animationProps, ...rest },
    ref
  ) => {
    return (
      <SvgProvider editProps={editProps} animationProps={animationProps}>
        <SvgElement
          ref={ref}
          width={width}
          height={height}
          background={background}
          elements={elements}
          {...rest}
        />
      </SvgProvider>
    )
  }
)

const SvgElement = forwardRef<SVGSVGElement, Omit<SvgProps, 'editProps'>>(
  ({ background, children, elements, ...rest }, ref) => {
    return (
      <svg ref={ref} {...dataFrameAttributes} {...rest}>
        {background && (
          <rect
            style={{ pointerEvents: 'none' }}
            width="100%"
            height="100%"
            fill={background}
          />
        )}
        <BoundingBox />
        {elements.map(({ key, attributes }) => (
          <Path key={key} elementKey={key} {...attributes} />
        ))}
        <EditElements />
      </svg>
    )
  }
)
