import { dataFrameAttributes } from '@svg-drawing/core'
import React, { forwardRef } from 'react'
import { EditLayer } from './EditLayer'
import { SvgProvider } from './SvgContext'
import type { SvgProps } from '../types'

export const Svg = forwardRef<SVGSVGElement, SvgProps>(
  (
    { children, editProps, width, height, background, animationProps, ...rest },
    ref
  ) => {
    return (
      <SvgProvider editProps={editProps} animationProps={animationProps}>
        <SvgElement
          ref={ref}
          width={width}
          height={height}
          background={background}
          {...rest}
        >
          {children}
        </SvgElement>
      </SvgProvider>
    )
  }
)

const SvgElement = forwardRef<SVGSVGElement, Omit<SvgProps, 'editProps'>>(
  ({ background, children, ...rest }, ref) => {
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
        <EditLayer>{children}</EditLayer>
      </svg>
    )
  }
)
