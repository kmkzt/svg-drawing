import React, { useCallback } from 'react'
import type { EditPathsProps, BoundingBoxProps } from '../types'
import type {
  PointObject,
  FixedType,
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
        editPaths.map(({ path, vertex }) => (
          <g key={path.key}>
            <EditPath
              path={path}
              onSelectPaths={onSelectPaths}
              onTranslateStart={onTranslateStart}
            />
            {vertex.map(({ points, d }, commandIndex) => (
              <g key={commandIndex}>
                <path
                  d={d}
                  strokeWidth={EDIT_CONFIG.line}
                  stroke={EDIT_CONFIG.color.main}
                  fill={EDIT_CONFIG.fill.default}
                />
                {points.map((po, k) => (
                  <EditPoint
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

type EditPointProps = {
  point: PointObject
  selectIndex: SelectIndex
  selected?: boolean
  onSelectPaths: (selectIndex: SelectIndex) => void
  onTranslateStart: (point: PointObject) => void
}

const EditPoint = ({
  point,
  selectIndex,
  selected,
  onSelectPaths,
  onTranslateStart,
}: EditPointProps) => {
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
  boundingBox: { pathKeys, position, size, vertex },
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
      {entries(vertex).map(([fixedType, point]) => (
        <BoundingBoxVertex
          key={fixedType}
          fixedType={fixedType}
          point={point}
          selectedOnlyPaths={selectedOnlyPaths}
          onResizeStart={onResizeStart}
        />
      ))}
    </>
  )
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

const entries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>

type BoundingBoxVertexProps = {
  fixedType: FixedType
  point: PointObject
  selectedOnlyPaths: boolean
  onResizeStart: EditPathsProps['onResizeStart']
}

const BoundingBoxVertex = ({
  fixedType,
  point,
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
        fixedType,
        point: getPointFromEvent(ev),
      })
    },
    [fixedType, onResizeStart]
  )
  return (
    <circle
      key={fixedType}
      cx={point.x}
      cy={point.y}
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
