import {
  dataCommandIndex,
  dataEditType,
  dataPathKey,
  dataPointIndex,
  dataVertexType,
} from '@svg-drawing/core'
import React, { useRef, useCallback } from 'react'
import { EditLayer } from './EditLayer'
import { SvgProvider, useSvgContext } from './SvgContext'
import type { SvgProps } from '../types'
import type { VertexType } from '@svg-drawing/core'

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
      if (!editProps) return

      const { boundingBox, onSelectPaths, onTranslateStart, onResizeStart } =
        editProps

      const el = ev.target as HTMLElement
      const editType = el.getAttribute(dataEditType)
      // DEBUG: console.info(ev.target, editType)

      // path
      if (editType === 'path') {
        const pathKey = el.getAttribute(dataPathKey)
        if (!pathKey) return
        onSelectPaths({ path: pathKey })
        onTranslateStart(ev)
        return
      }

      // point
      if (editType === 'point') {
        const pathKey = el.getAttribute(dataPathKey)
        const commandIndex = el.getAttribute(dataCommandIndex)
        const pointIndex = el.getAttribute(dataPointIndex)

        if (!pathKey) return
        if (commandIndex === null) return
        if (pointIndex === null) return

        onSelectPaths({
          path: pathKey,
          command: +commandIndex,
          point: +pointIndex,
        })
        onTranslateStart(ev)
      }

      // bounding-box
      if (editType === 'bounding-box') {
        if (!boundingBox?.pathKeys) return

        onSelectPaths(boundingBox?.pathKeys.map((key) => ({ path: key })))
        onTranslateStart(ev)
        return
      }

      // bounding-box-vertex
      if (editType === 'bounding-box-vertex') {
        const vertexType = el.getAttribute(dataVertexType)
        if (!vertexType) return

        onResizeStart(ev, vertexType as VertexType)

        return
      }

      if (svgRef.current?.isSameNode(el)) {
        editProps.onCancelSelect()
      }
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
