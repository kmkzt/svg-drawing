import {
  dataCommandIndex,
  dataEditType,
  dataPathKey,
  dataPointIndex,
  dataVertexType,
} from '@svg-drawing/core'
import React from 'react'
import { Path } from './Path'
import { useSvgContext } from './SvgContext'
import { EDIT_PATH_STYLE } from '../config/editPathStyle'
import type { BoundingBoxProps, EditProps } from '../types'
import type { PointObject, Vertex, EditPathObject } from '@svg-drawing/core'

export const EditLayer = () => {
  const { editProps } = useSvgContext()

  if (!editProps) return null

  const { boundingBox, selectedOnlyPaths, editPaths } = editProps

  return (
    <>
      {boundingBox && (
        <BoundingBox
          selectedOnlyPaths={selectedOnlyPaths}
          boundingBox={boundingBox}
        />
      )}
      {editPaths &&
        editPaths.map((editPath, i) => (
          <EditPath key={i} editPath={editPath} />
        ))}
    </>
  )
}

type EditPathProps = {
  editPath: EditPathObject
}

const EditPath = ({ editPath: { path, anchorPoints } }: EditPathProps) => (
  <g key={path.key}>
    <Path
      {...path.attributes}
      pathKey={path.key}
      strokeWidth={EDIT_PATH_STYLE.line}
      stroke={path.attributes?.stroke ? EDIT_PATH_STYLE.color.main : undefined}
      fill={path.attributes?.fill ? 'transparent' : undefined}
      strokeLinecap={path.attributes.strokeLinecap}
      strokeLinejoin={path.attributes.strokeLinejoin}
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
      {...{
        [dataEditType]: 'point',
        [dataPathKey]: pathKey,
        [dataCommandIndex]: `${commandIndex}`,
        [dataPointIndex]: `${pointIndex}`,
      }}
      cx={point.x}
      cy={point.y}
      r={EDIT_PATH_STYLE.point}
      style={{
        fill: selected
          ? EDIT_PATH_STYLE.color.selected
          : EDIT_PATH_STYLE.color.sub,
      }}
    />
  )
}

const BoundingBox = ({
  boundingBox: { position, size, vertexes },
  selectedOnlyPaths,
}: BoundingBoxProps) => (
  <>
    <rect
      {...{
        [dataEditType]: 'bounding-box',
      }}
      x={position.x}
      y={position.y}
      width={size.width}
      height={size.height}
      stroke={EDIT_PATH_STYLE.color.main}
      fill={
        selectedOnlyPaths
          ? EDIT_PATH_STYLE.fill.selected
          : EDIT_PATH_STYLE.fill.boundingBox
      }
    />
    {vertexes.map((vertex) => (
      <BoundingBoxVertex
        key={vertex.type}
        vertex={vertex}
        selectedOnlyPaths={selectedOnlyPaths}
      />
    ))}
  </>
)

type BoundingBoxVertexProps = {
  vertex: Vertex
  selectedOnlyPaths: boolean
}

const BoundingBoxVertex = ({
  vertex,
  selectedOnlyPaths,
}: BoundingBoxVertexProps) => (
  <circle
    {...{
      [dataEditType]: 'bounding-box-vertex',
      [dataVertexType]: vertex.type,
    }}
    key={vertex.type}
    cx={vertex.point.x}
    cy={vertex.point.y}
    r={EDIT_PATH_STYLE.point}
    stroke={EDIT_PATH_STYLE.color.main}
    fill={
      selectedOnlyPaths
        ? EDIT_PATH_STYLE.fill.selected
        : EDIT_PATH_STYLE.fill.boundingBox
    }
  />
)
