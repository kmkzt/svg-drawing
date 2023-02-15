import {
  dataBoundingBoxAttributes,
  dataBoundingBoxVertexAttributes,
  dataPathAnchorPointAttributes,
} from '@svg-drawing/core'
import React from 'react'
import { Path } from './Path'
import { useSvgContext } from './SvgContext'
import { EDIT_PATH_STYLE } from '../config/editPathStyle'
import type { BoundingBoxProps } from '../types'
import type { PointObject, Vertex, EditPathObject } from '@svg-drawing/core'

export const EditLayer = () => {
  const { editProps } = useSvgContext()

  if (!editProps) return null

  const { boundingBox, editElements } = editProps

  return (
    <>
      {boundingBox && (
        <BoundingBox
          size={boundingBox.size}
          vertexes={boundingBox.vertexes}
          position={boundingBox.position}
          selected={boundingBox.selected}
        />
      )}
      {editElements &&
        editElements.map((editPath, i) => (
          <EditPath
            key={editPath.key}
            elementKey={editPath.key}
            attributes={editPath.attributes}
            anchorPoints={editPath.anchorPoints}
          />
        ))}
    </>
  )
}

const EditPath = ({
  elementKey,
  attributes,
  anchorPoints,
}: {
  elementKey: EditPathObject['key']
  attributes: EditPathObject['attributes']
  anchorPoints: EditPathObject['anchorPoints']
}) => (
  <g key={elementKey}>
    <Path
      {...attributes}
      elementKey={elementKey}
      strokeWidth={EDIT_PATH_STYLE.line}
      stroke={attributes?.stroke ? EDIT_PATH_STYLE.color.main : undefined}
      fill="none"
      strokeLinecap={attributes.strokeLinecap}
      strokeLinejoin={attributes.strokeLinejoin}
    />
    {anchorPoints.map(({ points, d }, commandIndex) => (
      <g key={commandIndex}>
        <path
          d={d}
          strokeWidth={EDIT_PATH_STYLE.line}
          stroke={EDIT_PATH_STYLE.color.main}
          fill={EDIT_PATH_STYLE.fill.default}
        />
        {points.map((po, k) => (
          <AnchorPoint
            key={k}
            point={po.value}
            pathKey={po.index.path}
            commandIndex={po.index.command}
            pointIndex={po.index.point}
            selected={po.selected}
          />
        ))}
      </g>
    ))}
  </g>
)

type AnchorPointProps = {
  point: PointObject
  pathKey: string
  commandIndex: number
  pointIndex: number
  selected?: boolean
}

const AnchorPoint = ({
  point,
  pathKey,
  commandIndex,
  pointIndex,
  selected,
}: AnchorPointProps) => {
  return (
    <circle
      {...dataPathAnchorPointAttributes({
        elementKey: pathKey,
        commandIndex,
        pointIndex,
      })}
      cx={point.x}
      cy={point.y}
      r={EDIT_PATH_STYLE.point}
      fill={
        selected ? EDIT_PATH_STYLE.color.selected : EDIT_PATH_STYLE.color.sub
      }
    />
  )
}

const BoundingBox = ({
  position,
  size,
  vertexes,
  selected,
}: BoundingBoxProps) => (
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

type BoundingBoxVertexProps = {
  vertex: Vertex
  selected: boolean
}

const BoundingBoxVertex = ({ vertex, selected }: BoundingBoxVertexProps) => (
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
