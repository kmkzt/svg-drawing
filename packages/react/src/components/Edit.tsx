import React, { useCallback } from 'react'
import { EDIT_PATH_STYLE } from '../config/editPathStyle'
import type { EditPathsProps, BoundingBoxProps } from '../types'
import type {
  PointObject,
  Vertex,
  SelectIndex,
  PathObject,
  EditPathObject,
} from '@svg-drawing/core'

export const EditPaths = ({
  paths,
  editPaths,
  boundingBox,
  selectedOnlyPaths,
  onTranslateStart,
  onResizeStart,
  onSelectPaths,
}: EditPathsProps) => {
  return (
    <>
      {paths.map((pathObject) => (
        <Path
          key={pathObject.key}
          path={pathObject}
          onSelectPaths={onSelectPaths}
          onTranslateStart={onTranslateStart}
        />
      ))}
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

type PathProps = {
  path: PathObject
  onSelectPaths: (selectIndex: SelectIndex) => void
  onTranslateStart: (point: PointObject) => void
}

const Path = ({
  path: { key, attributes },
  onSelectPaths,
  onTranslateStart,
}: PathProps) => {
  const handleMoveStartPath = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      onSelectPaths({ path: key })
      onTranslateStart(getPointFromEvent(ev))
    },
    [key, onSelectPaths, onTranslateStart]
  )
  return (
    <path
      {...attributes}
      onMouseDown={handleMoveStartPath}
      onTouchStart={handleMoveStartPath}
    />
  )
}

type EditPathProps = {
  editPath: EditPathObject
  onSelectPaths: (selectIndex: SelectIndex) => void
  onTranslateStart: (point: PointObject) => void
}

const EditPath = ({
  editPath: { path, anchorPoints },
  onSelectPaths,
  onTranslateStart,
}: EditPathProps) => (
  <g key={path.key}>
    <Path
      path={path}
      onSelectPaths={onSelectPaths}
      onTranslateStart={onTranslateStart}
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
            selectIndex={po.index}
            selected={po.selected}
            onSelectPaths={onSelectPaths}
            onTranslateStart={onTranslateStart}
          />
        ))}
      </g>
    ))}
  </g>
)

type AnchorPointProps = {
  point: PointObject
  selectIndex: SelectIndex
  selected?: boolean
  onSelectPaths: (selectIndex: SelectIndex) => void
  onTranslateStart: (point: PointObject) => void
}

const AnchorPoint = ({
  point,
  selectIndex,
  selected,
  onSelectPaths,
  onTranslateStart,
}: AnchorPointProps) => {
  const handleMoveStartPoint = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      onSelectPaths(selectIndex)
      onTranslateStart(getPointFromEvent(ev))
    },
    [onSelectPaths, onTranslateStart, selectIndex]
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
      onTranslateStart(getPointFromEvent(ev))
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
  onResizeStart: EditPathsProps['onResizeStart']
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
      onResizeStart({
        type: vertex.type,
        point: getPointFromEvent(ev),
      })
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

const getPointFromEvent = (
  ev: React.MouseEvent<any> | React.TouchEvent<any>
): PointObject => {
  if ('touches' in ev) {
    const touche = ev.touches[0]
    return {
      x: touche.clientX,
      y: touche.clientY,
    }
  }
  return {
    x: ev.clientX,
    y: ev.clientY,
  }
}
