import {
  dataPathAnchorPointAttributes,
  dataPathCommandAttributes,
} from '@svg-drawing/core'
import React from 'react'
import { Path } from './Path'
import { useSvgContext } from './SvgContext'
import { EDIT_PATH_STYLE } from '../config/editPathStyle'
import type {
  EditPathObject,
  ElementKey,
  EditCommandObject,
  AnchorPoint,
} from '@svg-drawing/core'

export const EditElements = () => {
  const { editProps } = useSvgContext()

  if (!editProps?.elements) return null

  return (
    <>
      {editProps.elements.map((editPath, i) => (
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
      strokeLinecap={attributes['stroke-linecap']}
      strokeLinejoin={attributes['stroke-linejoin']}
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
