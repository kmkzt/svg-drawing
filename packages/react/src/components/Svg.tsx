import React, { useRef, useCallback } from 'react'
import { EditLayer } from './EditLayer'
import { SvgProvider, useSvgContext } from './SvgContext'
import type { SvgProps } from '../types'

export const Svg = ({
  children,
  editProps,
  width,
  height,
  background,
  animationProps,
  ...rest
}: SvgProps) => {
  return (
    <SvgProvider editProps={editProps} animationProps={animationProps}>
      <SvgElement
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

const SvgElement = ({
  background,
  children,
  ...rest
}: Omit<SvgProps, 'editProps'>) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const { editProps } = useSvgContext()

  const onSelect = useCallback(
    (ev: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
      if (!editProps?.onCancelSelect) return
      if (!svgRef.current) return
      if (!svgRef.current.isSameNode(ev.target as Node)) return

      editProps.onCancelSelect()
    },
    [editProps]
  )

  return (
    <svg ref={svgRef} onMouseDown={onSelect} onTouchStart={onSelect} {...rest}>
      {background && (
        <rect
          style={{ pointerEvents: 'none' }}
          width="100%"
          height="100%"
          fill={background}
        />
      )}
      {children}
      <EditLayer />
    </svg>
  )
}
