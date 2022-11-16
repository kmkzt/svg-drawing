import React, { useRef, useCallback } from 'react'
import { BackgroundRect } from './BackgroundRect'
import { EditLayer } from './EditLayer'
import { SvgProvider, useSvgContext } from './SvgContext'
import type { SvgProps } from '../types'

export const Svg = ({
  children,
  editProps,
  width,
  height,
  background,
  ...rest
}: SvgProps) => {
  return (
    <SvgProvider editProps={editProps}>
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
      {background && <BackgroundRect fill={background} />}
      {children}
      <EditLayer />
    </svg>
  )
}
