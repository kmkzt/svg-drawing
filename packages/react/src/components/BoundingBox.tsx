import {
  dataBoundingBoxAttributes,
  dataBoundingBoxVertexAttributes,
} from '@svg-drawing/core'
import React from 'react'
import { useSvgContext } from './SvgContext'
import { EDIT_PATH_STYLE } from '../config/editPathStyle'
import type { Vertex } from '@svg-drawing/core'

export const BoundingBox = () => {
  const { editProps } = useSvgContext()

  if (!editProps?.boundingBox) return null

  const { position, size, selected, vertexes } = editProps.boundingBox

  return (
    <>
      <rect
        {...dataBoundingBoxAttributes}
        x={position.x}
        y={position.y}
        width={size.width}
        height={size.height}
        stroke={EDIT_PATH_STYLE.color.main}
        fill={
          selected
            ? EDIT_PATH_STYLE.fill.selected
            : EDIT_PATH_STYLE.fill.boundingBox
        }
      />
      {vertexes.map((vertex) => (
        <BoundingBoxVertex
          key={vertex.type}
          vertex={vertex}
          selected={selected}
        />
      ))}
    </>
  )
}

const BoundingBoxVertex = ({
  vertex,
  selected,
}: {
  vertex: Vertex
  selected: boolean
}) => (
  <circle
    {...dataBoundingBoxVertexAttributes(vertex.type)}
    key={vertex.type}
    cx={vertex.point.x}
    cy={vertex.point.y}
    r={EDIT_PATH_STYLE.point}
    stroke={EDIT_PATH_STYLE.color.main}
    fill={
      selected
        ? EDIT_PATH_STYLE.fill.selected
        : EDIT_PATH_STYLE.fill.boundingBox
    }
  />
)
