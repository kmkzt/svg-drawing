import React, { useCallback } from 'react'
import type { EditPathsProps, BoundingBoxProps } from '../types'
import type {
  PointObject,
  Vertex,
  SelectIndex,
  PathObject,
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
        <EditPath
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
        editPaths.map(({ path, anchorPoints }) => (
          <g key={path.key}>
            <EditPath
              path={path}
              onSelectPaths={onSelectPaths}
              onTranslateStart={onTranslateStart}
            />
            {anchorPoints.map(({ points, d }, commandIndex) => (
              <g key={commandIndex}>
                <path
                  d={d}
                  strokeWidth={EDIT_CONFIG.line}
                  stroke={EDIT_CONFIG.color.main}
                  fill={EDIT_CONFIG.fill.default}
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
        ))}
    </>
  )
}

type EditPathProps = {
  path: PathObject
  onSelectPaths: (selectIndex: SelectIndex) => void
  onTranslateStart: (point: PointObject) => void
}

const EditPath = ({
  path: { key, attributes },
  onSelectPaths,
  onTranslateStart,
}: EditPathProps) => {
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
      r={EDIT_CONFIG.point}
      style={{
        fill: selected ? EDIT_CONFIG.color.selected : EDIT_CONFIG.color.sub,
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
        stroke={EDIT_CONFIG.color.main}
        fill={
          selectedOnlyPaths
            ? EDIT_CONFIG.fill.selected
            : EDIT_CONFIG.fill.boundingBox
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
      r={EDIT_CONFIG.point}
      stroke={EDIT_CONFIG.color.main}
      fill={
        selectedOnlyPaths
          ? EDIT_CONFIG.fill.selected
          : EDIT_CONFIG.fill.boundingBox
      }
      onMouseDown={handleResizeStart}
      onTouchStart={handleResizeStart}
    />
  )
}

const EDIT_CONFIG = {
  line: 1,
  point: 3,
  color: {
    main: '#09f',
    sub: '#f90',
    selected: '#f00',
  },
  fill: {
    default: 'none',
    boundingBox: 'rgba(0,0,0,0)',
    selected: 'rgba(0,0,0,0.1)',
  },
} as const

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
