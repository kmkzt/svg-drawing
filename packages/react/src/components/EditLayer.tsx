import {
  dataBoundingBoxAttributes,
  dataBoundingBoxVertexAttributes,
  dataPathAnchorPointAttributes,
  dataPathCommandAttributes,
} from '@svg-drawing/core'
import React from 'react'
import { Path } from './Path'
import { useSvgContext } from './SvgContext'
import { EDIT_PATH_STYLE } from '../config/editPathStyle'
import type { BoundingBoxProps } from '../types'
import type {
  Vertex,
  EditPathObject,
  ElementKey,
  EditCommandObject,
  AnchorPoint,
} from '@svg-drawing/core'

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
            commands={editPath.commands}
          />
        ))}
    </>
  )
}

const EditAnchorPoint = ({
  elementKey,
  anchorPoints,
  outline,
}: {
  elementKey: ElementKey
  anchorPoints: AnchorPoint[]
  outline: string | undefined
}) => (
  <g>
    {anchorPoints.map((anchorPoint, i) => (
      <EditPoint key={i} elementKey={elementKey} anchorPoint={anchorPoint} />
    ))}
    {outline ? (
      <path
        d={outline}
        strokeWidth={EDIT_PATH_STYLE.line}
        stroke={EDIT_PATH_STYLE.color.main}
        fill={EDIT_PATH_STYLE.fill.default}
      />
    ) : null}
  </g>
)

const EditCommand = ({
  elementKey,
  command: { index, value, selected, anchorPoints, outline },
}: {
  elementKey: ElementKey
  command: EditCommandObject
}) => (
  <g>
    <circle
      {...dataPathCommandAttributes({ elementKey, commandIndex: index })}
      r={EDIT_PATH_STYLE.point}
      cx={value.x}
      cy={value.y}
      fill={
        selected ? EDIT_PATH_STYLE.color.selected : EDIT_PATH_STYLE.color.sub
      }
    />
    {selected ? (
      <EditAnchorPoint
        elementKey={elementKey}
        outline={outline}
        anchorPoints={anchorPoints}
      />
    ) : null}
  </g>
)

const EditPath = ({
  elementKey,
  attributes,
  commands,
}: {
  elementKey: EditPathObject['key']
  attributes: EditPathObject['attributes']
  commands: EditPathObject['commands']
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
    {commands.map((command, i) => (
      <EditCommand key={i} elementKey={elementKey} command={command} />
    ))}
  </g>
)

const EditPoint = ({
  elementKey,
  anchorPoint: { index, selected, value },
}: {
  elementKey: ElementKey
  anchorPoint: AnchorPoint
}) => (
  <circle
    {...dataPathAnchorPointAttributes({
      elementKey,
      commandIndex: index.command,
      pointIndex: index.point,
    })}
    cx={value.x}
    cy={value.y}
    r={EDIT_PATH_STYLE.point}
    fill={selected ? EDIT_PATH_STYLE.color.selected : EDIT_PATH_STYLE.color.sub}
  />
)

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
