import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  HTMLAttributes,
} from 'react'
import { PointObject, FixedPositionType, BoundingBox } from '@svg-drawing/core'
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
  edit: { index: selecting, boundingBox, paths: selectedPaths },
  onMovePathsStart,
  onResizeBoundingBoxStart,
  ...rest
}: EditSvgProps & HTMLAttributes<SVGSVGElement>) => {
  const isSelectedPoint = useCallback(
    ({ path, command, point }: EditPointIndex): boolean => {
      if (!(path in selecting)) return false
      const selectingCommand = selecting[path]
      if (!(command in selectingCommand)) return false
      return selectingCommand[command].includes(point)
    },
    [selecting]
  )

  const selectedBoundingBox = useMemo(() => {
    if (Object.keys(selecting).length < 1) return false
    return Object.keys(selecting).every((pKey: string) => {
      const selectingCommand = selecting[+pKey]
      return Object.keys(selectingCommand).length === 0
    })
  }, [selecting])

  const handleMoveStartPoint = useCallback(
    ({ path, command, point }: EditPointIndex) =>
      (
        ev:
          | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
          | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      ) =>
        onMovePathsStart(getPointFromEvent(ev), {
          [path]: {
            [command]: [point],
          },
        }),
    [onMovePathsStart]
  )

  const handleMoveStartPath = useCallback(
    (i: number) =>
      (
        ev:
          | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
          | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      ) => {
        onMovePathsStart(getPointFromEvent(ev), {
          [i]: {},
        })
      },
    [onMovePathsStart]
  )
  return (
    <svg width={width} height={height} {...rest}>
      {background && <rect width={width} height={height} fill={background} />}
      <EditBoundingBox
        selected={selectedBoundingBox}
        min={boundingBox.min}
        max={boundingBox.max}
        onMovePathsStart={onMovePathsStart}
        onResizeBoundingBoxStart={onResizeBoundingBoxStart}
      />
      {paths.map((pathAttr, pathIndex) => (
        <path
          key={pathIndex}
          {...pathAttr}
          onMouseDown={handleMoveStartPath(pathIndex)}
          onTouchStart={handleMoveStartPath(pathIndex)}
        />
      ))}
      {Object.entries(selectedPaths).map(([key, editPath]) => {
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
                      cx={po.x}
                      cy={po.y}
                      onMouseDown={handleMoveStartPoint(editPathIndex)}
                      onTouchStart={handleMoveStartPoint(editPathIndex)}
                      r={EDIT_CONFIG.point}
                      style={{
                        fill: isSelectedPoint(editPathIndex)
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
  selected,
  min,
  max,
  onMovePathsStart,
  onResizeBoundingBoxStart,
}: Pick<EditSvgProps, 'onMovePathsStart' | 'onResizeBoundingBoxStart'> & {
  selected: boolean
  min: BoundingBox['min']
  max: BoundingBox['max']
}) => {
  const handleMovePathsStart = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      onMovePathsStart(getPointFromEvent(ev))
    },
    [onMovePathsStart]
  )

  const handleResizeStart = useCallback(
    (fixedPosition: FixedPositionType) =>
      (
        ev:
          | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
          | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
      ) => {
        ev.preventDefault()
        onResizeBoundingBoxStart({
          fixedPosition,
          basePoint: getPointFromEvent(ev),
        })
      },
    [onResizeBoundingBoxStart]
  )

  return (
    <>
      <rect
        x={min[0]}
        y={min[1]}
        width={max[0] - min[0]}
        height={max[1] - min[1]}
        stroke={EDIT_CONFIG.color.main}
        fill={
          selected ? EDIT_CONFIG.fill.selected : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleMovePathsStart}
        onTouchStart={handleMovePathsStart}
      />
      <circle
        cx={min[0]}
        cy={min[1]}
        r={EDIT_CONFIG.point}
        stroke={EDIT_CONFIG.color.main}
        fill={
          selected ? EDIT_CONFIG.fill.selected : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleResizeStart('LeftTop')}
        onTouchStart={handleResizeStart('LeftTop')}
      />
      <circle
        cx={max[0]}
        cy={min[1]}
        r={EDIT_CONFIG.point}
        stroke={EDIT_CONFIG.color.main}
        fill={
          selected ? EDIT_CONFIG.fill.selected : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleResizeStart('RightTop')}
        onTouchStart={handleResizeStart('RightTop')}
      />
      <circle
        cx={min[0]}
        cy={max[1]}
        r={EDIT_CONFIG.point}
        stroke={EDIT_CONFIG.color.main}
        fill={
          selected ? EDIT_CONFIG.fill.selected : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleResizeStart('LeftBottom')}
        onTouchStart={handleResizeStart('LeftBottom')}
      />
      <circle
        cx={max[0]}
        cy={max[1]}
        r={EDIT_CONFIG.point}
        stroke={EDIT_CONFIG.color.main}
        fill={
          selected ? EDIT_CONFIG.fill.selected : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleResizeStart('RightBottom')}
        onTouchStart={handleResizeStart('RightBottom')}
      />
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
