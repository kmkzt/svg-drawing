import React, { useCallback } from 'react'
import { Path } from './Path'
import { useSvgContext } from './SvgContext'
import { EDIT_PATH_STYLE } from '../config/editPathStyle'
import type { BoundingBoxProps, EditProps } from '../types'
import type {
  PointObject,
  Vertex,
  EditPathObject,
  SelectPointIndex,
} from '@svg-drawing/core'

export const EditLayer = () => {
  const { editProps } = useSvgContext()

  if (!editProps) return null

  const {
    boundingBox,
    selectedOnlyPaths,
    editPaths,
    onSelectPaths,
    onTranslateStart,
    onResizeStart,
  } = editProps

  return (
    <>
      {boundingBox && (
        <BoundingBox
          selectedOnlyPaths={selectedOnlyPaths}
          boundingBox={boundingBox}
          onSelectPaths={onSelectPaths}
          onTranslateStart={onTranslateStart}
          onResizeStart={onResizeStart}
        />
      )}
      {editPaths &&
        editPaths.map((editPath, i) => (
          <EditPath
            key={i}
            editPath={editPath}
            onSelectPaths={onSelectPaths}
            onTranslateStart={onTranslateStart}
          />
        ))}
    </>
  )
}

type EditPathProps = {
  editPath: EditPathObject
  onSelectPaths: EditProps['onSelectPaths']
  onTranslateStart: EditProps['onTranslateStart']
}

const EditPath = ({
  editPath: { path, anchorPoints },
  onSelectPaths,
  onTranslateStart,
}: EditPathProps) => (
  <g key={path.key}>
    <Path
      pathKey={path.key}
      {...path.attributes}
      strokeWidth={EDIT_PATH_STYLE.line}
      stroke={path.attributes?.stroke ? EDIT_PATH_STYLE.color.main : undefined}
      fill={path.attributes?.fill ? 'transparent' : undefined}
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
            selectPointIndex={po.index}
            selected={po.selected}
            onSelectPoint={onSelectPaths}
            onTranslateStart={onTranslateStart}
          />
        ))}
      </g>
    ))}
  </g>
)

type AnchorPointProps = {
  point: PointObject
  selectPointIndex: SelectPointIndex
  selected?: boolean
  onSelectPoint: EditProps['onSelectPaths']
  onTranslateStart: EditProps['onTranslateStart']
}

const AnchorPoint = ({
  point,
  selectPointIndex,
  selected,
  onSelectPoint: onSelectPoint,
  onTranslateStart,
}: AnchorPointProps) => {
  const handleMoveStartPoint = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      onSelectPoint(selectPointIndex)
      onTranslateStart(ev)
    },
    [onSelectPoint, onTranslateStart, selectPointIndex]
  )

  return (
    <circle
      cx={point.x}
      cy={point.y}
      onMouseDown={handleMoveStartPoint}
      onTouchStart={handleMoveStartPoint}
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
  boundingBox: { pathKeys, position, size, vertexes },
  selectedOnlyPaths,
  onSelectPaths,
  onTranslateStart,
  onResizeStart,
}: BoundingBoxProps) => {
  const handleMovePathsStart = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      onSelectPaths(pathKeys.map((key) => ({ path: key })))
      onTranslateStart(ev)
    },
    [onSelectPaths, onTranslateStart, pathKeys]
  )

  return (
    <>
      <rect
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
        onMouseDown={handleMovePathsStart}
        onTouchStart={handleMovePathsStart}
      />
      {vertexes.map((vertex) => (
        <BoundingBoxVertex
          key={vertex.type}
          vertex={vertex}
          selectedOnlyPaths={selectedOnlyPaths}
          onResizeStart={onResizeStart}
        />
      ))}
    </>
  )
}

type BoundingBoxVertexProps = {
  vertex: Vertex
  selectedOnlyPaths: boolean
  onResizeStart: EditProps['onResizeStart']
}

const BoundingBoxVertex = ({
  vertex,
  selectedOnlyPaths,
  onResizeStart,
}: BoundingBoxVertexProps) => {
  const handleResizeStart = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      onResizeStart(ev, vertex.type)
    },
    [vertex, onResizeStart]
  )
  return (
    <circle
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
      onMouseDown={handleResizeStart}
      onTouchStart={handleResizeStart}
    />
  )
}
