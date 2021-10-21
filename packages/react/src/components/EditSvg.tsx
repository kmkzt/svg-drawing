import {
  PointObject,
  FixedType,
  EditSvgObject,
  SelectIndex,
} from '@svg-drawing/core'
import React, { useCallback, HTMLAttributes, useRef } from 'react'
import { EditSvgProps } from '../types'

export const EditSvg = ({
  background,
  paths,
  width,
  height,
  editPaths,
  boundingBox,
  onTranslateStart,
  onResizeBoundingBoxStart,
  onCancelSelect,
  onSelectPaths,
  ...rest
}: EditSvgProps & HTMLAttributes<SVGSVGElement>) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const handleMoveStartPoint = useCallback(
    (selectIndex: Required<SelectIndex>) =>
      (
        ev:
          | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
          | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      ) => {
        onSelectPaths(selectIndex)
        onTranslateStart(getPointFromEvent(ev))
      },
    [onSelectPaths, onTranslateStart]
  )

  const handleMoveStartPath = useCallback(
    (path: number) =>
      (
        ev:
          | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
          | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      ) => {
        onSelectPaths({ path })
        onTranslateStart(getPointFromEvent(ev))
      },
    [onSelectPaths, onTranslateStart]
  )

  const handleCancel = useCallback(
    (ev: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
      if (!svgRef.current) return
      if (!svgRef.current.isSameNode(ev.target as Node)) return

      onCancelSelect()
    },
    [onCancelSelect]
  )

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      onMouseDown={handleCancel}
      onTouchStart={handleCancel}
      {...rest}
    >
      {background && (
        <rect
          style={{ pointerEvents: 'none' }}
          width={width}
          height={height}
          fill={background}
        />
      )}
      {boundingBox && (
        <EditBoundingBox
          {...boundingBox}
          onTranslateStart={onTranslateStart}
          onResizeBoundingBoxStart={onResizeBoundingBoxStart}
        />
      )}
      {paths.map(({ attributes }, pathIndex) => (
        <path
          key={pathIndex}
          {...attributes}
          onMouseDown={handleMoveStartPath(pathIndex)}
          onTouchStart={handleMoveStartPath(pathIndex)}
        />
      ))}
      {editPaths &&
        Object.entries(editPaths).map(([, { index, vertex, d }]) => (
          <g key={index}>
            <path
              d={d}
              strokeWidth={EDIT_CONFIG.line}
              stroke={EDIT_CONFIG.color.main}
              fill={EDIT_CONFIG.fill.boundingBox}
              onMouseDown={handleMoveStartPath(index)}
              onTouchStart={handleMoveStartPath(index)}
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
                  <circle
                    key={k}
                    cx={po.value.x}
                    cy={po.value.y}
                    onMouseDown={handleMoveStartPoint(po.index)}
                    onTouchStart={handleMoveStartPoint(po.index)}
                    r={EDIT_CONFIG.point}
                    style={{
                      fill: po.selected
                        ? EDIT_CONFIG.color.selected
                        : EDIT_CONFIG.color.sub,
                    }}
                  />
                ))}
              </g>
            ))}
          </g>
        ))}
    </svg>
  )
}

export const EditBoundingBox = ({
  x,
  y,
  width,
  height,
  vertex,
  selected,
  onTranslateStart,
  onResizeBoundingBoxStart,
}: Pick<EditSvgProps, 'onTranslateStart' | 'onResizeBoundingBoxStart'> &
  EditSvgObject['boundingBox']) => {
  const handleMovePathsStart = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      onTranslateStart(getPointFromEvent(ev))
    },
    [onTranslateStart]
  )

  const handleResizeStart = useCallback(
    (fixedType: FixedType) =>
      (
        ev:
          | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
          | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      ) => {
        onResizeBoundingBoxStart({
          fixedType,
          point: getPointFromEvent(ev),
        })
      },
    [onResizeBoundingBoxStart]
  )

  return (
    <>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={EDIT_CONFIG.color.main}
        fill={
          selected ? EDIT_CONFIG.fill.selected : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleMovePathsStart}
        onTouchStart={handleMovePathsStart}
      />
      {Object.entries(vertex).map(([key, point]) => (
        <circle
          key={key}
          cx={point.x}
          cy={point.y}
          r={EDIT_CONFIG.point}
          stroke={EDIT_CONFIG.color.main}
          fill={
            selected ? EDIT_CONFIG.fill.selected : EDIT_CONFIG.fill.boundingBox
          }
          onMouseDown={handleResizeStart(key as FixedType)}
          onTouchStart={handleResizeStart(key as FixedType)}
        />
      ))}
    </>
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
