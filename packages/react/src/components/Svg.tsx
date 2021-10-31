import React, { useRef, useCallback } from 'react'
import { BackgroundRect } from './BackgroundRect'
import type { SvgProps } from '../types'

export const Svg = ({
  onSelectSvg,
  background,
  children,
  ...rest
}: SvgProps) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const onSelect = useCallback(
    (ev: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
      if (!svgRef.current) return
      if (!svgRef.current.isSameNode(ev.target as Node)) return

      onSelectSvg?.()
    },
    [onSelectSvg]
  )

  return (
    <svg ref={svgRef} onMouseDown={onSelect} onTouchStart={onSelect} {...rest}>
      {background && <BackgroundRect fill={background} />}
      {children}
    </svg>
  )
}
