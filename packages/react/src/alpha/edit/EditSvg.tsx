import { PointObject, FixedType, EditSvgObject } from '@svg-drawing/core'
import React, { useCallback, HTMLAttributes } from 'react'
import { EditSvgProps } from '../types'

type EditPointIndex = {
  path: number
  command: number
  point: number
}

export const EditSvg = ({
  background,
  paths,
  width,
  height,
  editPaths: selectedPaths,
  boundingBox,
  onTranslateStart,
  onResizeBoundingBoxStart,
  ...rest
}: EditSvgProps & HTMLAttributes<SVGSVGElement>) => {
  const handleMoveStartPoint = useCallback(
    ({ path, command, point }: EditPointIndex) =>
      (
        ev:
          | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
          | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      ) =>
        onTranslateStart(getPointFromEvent(ev), {
          [path]: {
            [command]: [point],
          },
        }),
    [onTranslateStart]
  )

  const handleMoveStartPath = useCallback(
    (i: number) =>
      (
        ev:
          | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
          | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      ) => {
        onTranslateStart(getPointFromEvent(ev), {
          [i]: {},
        })
      },
    [onTranslateStart]
  )
  return (
    <svg width={width} height={height} {...rest}>
      {background && <rect width={width} height={height} fill={background} />}
      {boundingBox && (
        <EditBoundingBox
          {...boundingBox}
          onTranslateStart={onTranslateStart}
          onResizeBoundingBoxStart={onResizeBoundingBoxStart}
        />
      )}
      {paths.map((pathAttr, pathIndex) => (
        <path
          key={pathIndex}
          {...pathAttr}
          onMouseDown={handleMoveStartPath(pathIndex)}
          onTouchStart={handleMoveStartPath(pathIndex)}
        />
      ))}
      {selectedPaths &&
        Object.entries(selectedPaths).map(([key, editPath]) => {
          const pathIndex = +key
          const { controlPoints, d } = editPath
          return (
            <g key={pathIndex}>
              <path
                d={d}
                strokeWidth={EDIT_CONFIG.line}
                stroke={EDIT_CONFIG.color.main}
                fill={EDIT_CONFIG.fill.boundingBox}
                onMouseDown={handleMoveStartPath(pathIndex)}
                onTouchStart={handleMoveStartPath(pathIndex)}
              />
              {controlPoints.map(({ points, d }, commandIndex) => (
                <g key={commandIndex}>
                  <path
                    d={d}
                    strokeWidth={EDIT_CONFIG.line}
                    stroke={EDIT_CONFIG.color.main}
                    fill={EDIT_CONFIG.fill.default}
                  />
                  {points.map((po, k) => {
                    const editPathIndex = {
                      path: pathIndex,
                      command: commandIndex,
                      point: k * 2,
                    }
                    return (
                      <circle
                        key={k}
                        cx={po.value.x}
                        cy={po.value.y}
                        onMouseDown={handleMoveStartPoint(editPathIndex)}
                        onTouchStart={handleMoveStartPoint(editPathIndex)}
                        r={EDIT_CONFIG.point}
                        style={{
                          fill: po.selected
                            ? EDIT_CONFIG.color.selected
                            : EDIT_CONFIG.color.sub,
                        }}
                      />
                    )
                  })}
                </g>
              ))}
            </g>
          )
        })}
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
