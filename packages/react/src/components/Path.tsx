import React, { useCallback } from 'react'
import { useSvgContext } from './SvgContext'
import type { PathObject } from '@svg-drawing/core'
import type { ReactNode } from 'react'

type PathProps = {
  pathKey: PathObject['key']
  children?: ReactNode
} & PathObject['attributes']

export const Path = ({
  pathKey,
  children,
  d,
  fill,
  stroke,
  strokeWidth,
  strokeLineCap,
  strokeLinejoin,
  ...attrs
}: PathProps) => {
  const { editProps } = useSvgContext()

  const handleMoveStartPath = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      if (!editProps) return

      editProps.onSelectPaths({ path: pathKey })
      editProps.onTranslateStart(ev)
    },
    [editProps, pathKey]
  )
  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin={strokeLinejoin as any}
      strokeLinecap={strokeLineCap as any}
      {...attrs}
      onMouseDown={handleMoveStartPath}
      onTouchStart={handleMoveStartPath}
    >
      {children}
    </path>
  )
}
