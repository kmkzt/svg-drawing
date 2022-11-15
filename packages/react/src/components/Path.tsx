import React, { useCallback } from 'react'
import { useSvgContext } from './SvgContext'
import type { PathObject } from '@svg-drawing/core'

type PathProps = {
  path: PathObject
}

export const Path = ({ path: { key, attributes } }: PathProps) => {
  const { editProps } = useSvgContext()

  const handleMoveStartPath = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      if (!editProps) return

      editProps.onSelectPaths({ path: key })
      editProps.onTranslateStart(ev)
    },
    [editProps, key]
  )
  return (
    <path
      {...attributes}
      onMouseDown={handleMoveStartPath}
      onTouchStart={handleMoveStartPath}
    />
  )
}
