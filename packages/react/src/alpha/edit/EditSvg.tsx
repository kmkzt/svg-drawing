import React, { useCallback, useMemo, useState, useEffect } from 'react'
import {
  PathObject,
  PointObject,
  ControlPoint,
  EditSvgObject,
} from '@svg-drawing/core'
import { EditSvgProps } from './types'

type EditPointIndex = {
  path: number
  command: number
  point: number
}
export const EditSvg = ({
  selecting,
  onSelect: handleSelect,
  onMove: handleMove,
  background,
  paths,
  width,
  height,
  boundingBox,
  selectPaths,
  ...rest
}: EditSvgProps) => {
  const [currentPosition, setCurrentPosition] = useState<PointObject | null>(
    null
  )
  const [movePoint, setMovePoint] = useState<PointObject | null>(null)
  const [moving, setMoving] = useState(false)

  const isSelectedBoundingBox = useMemo(() => {
    if (Object.keys(selecting).length < 2) return false
    return true
  }, [selecting])

  const handleClickPath = useCallback(
    (i: number) => (
      _ev:
        | React.MouseEvent<HTMLOrSVGElement>
        | React.TouchEvent<HTMLOrSVGElement>
    ) => {
      setCurrentPosition(null)
      handleSelect({
        [i]: {},
      })
    },
    [handleSelect]
  )

  const isSelectedPoint = useCallback(
    ({ path, command, point }: EditPointIndex): boolean => {
      if (!(path in selecting)) return false
      const selectingCommand = selecting[path]
      if (!(command in selectingCommand)) return false
      return point in selectingCommand[command]
    },
    [selecting]
  )

  const handleMovePointStart = useCallback(
    ({ path, command, point }: EditPointIndex) => (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      handleSelect({
        [path]: {
          [command]: [point],
        },
      })
      setCurrentPosition(getPointFromEvent(ev))
      setMoving(true)
    },
    [handleSelect]
  )

  const handleMoveBoundingBoxStart = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      setCurrentPosition(getPointFromEvent(ev))
      setMoving(true)
    },
    []
  )
  const handleMoveEdit = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!moving || !currentPosition) return
      const { x, y } = getPointFromEvent(ev)
      setMovePoint({
        x: x - currentPosition.x,
        y: y - currentPosition.y,
      })
    },
    [currentPosition, moving]
  )
  const handleMoveEnd = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!moving || !currentPosition) return
      const { x, y } = getPointFromEvent(ev)
      handleMove({
        x: x - currentPosition.x,
        y: y - currentPosition.y,
      })
      setMoving(false)
      setMovePoint(null)
    },
    [moving, currentPosition, handleMove]
  )

  useEffect(() => {
    window.addEventListener('mouseup', handleMoveEnd)
    window.addEventListener('mousemove', handleMoveEdit)
    window.addEventListener('touchcancel', handleMoveEnd)
    window.addEventListener('touchmove', handleMoveEdit)
    return () => {
      window.removeEventListener('mouseup', handleMoveEnd)
      window.removeEventListener('mousemove', handleMoveEdit)
      window.removeEventListener('touchcancel', handleMoveEnd)
      window.removeEventListener('touchmove', handleMoveEdit)
    }
  }, [handleMoveEnd, handleMoveEdit])

  return (
    <svg width={width} height={height} {...rest}>
      {background && <rect width={width} height={height} fill={background} />}
      <rect
        x={boundingBox.min[0]}
        y={boundingBox.min[1]}
        width={boundingBox.max[0] - boundingBox.min[0]}
        height={boundingBox.max[1] - boundingBox.min[1]}
        stroke={EDIT_CONFIG.color.main}
        fill={
          isSelectedBoundingBox
            ? EDIT_CONFIG.fill.selected
            : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleMoveBoundingBoxStart}
        onTouchStart={handleMoveBoundingBoxStart}
      />
      {paths.map((pathAttr: PathObject, pathIndex) => {
        const editPath = selectPaths[pathIndex]

        if (!editPath) {
          return (
            <path
              key={pathIndex}
              {...pathAttr}
              onClick={handleClickPath(pathIndex)}
              onTouchStart={handleClickPath(pathIndex)}
            />
          )
        }
        const { controlPoints, d } = editPath
        return (
          <g key={pathIndex}>
            <path {...pathAttr} />
            <path
              d={d}
              strokeWidth={EDIT_CONFIG.line}
              stroke={EDIT_CONFIG.color.main}
              fill={EDIT_CONFIG.fill.default}
              onClick={handleClickPath(pathIndex)}
              onTouchStart={handleClickPath(pathIndex)}
            />
            {controlPoints.map(({ points, d }: ControlPoint, commandIndex) => (
              <g key={commandIndex}>
                <path
                  d={d}
                  strokeWidth={EDIT_CONFIG.line}
                  stroke={EDIT_CONFIG.color.main}
                  fill={EDIT_CONFIG.fill.default}
                />
                {points.map((po: PointObject, k) => {
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
                      onMouseDown={handleMovePointStart(editPathIndex)}
                      onTouchStart={handleMovePointStart(editPathIndex)}
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
  ev:
    | MouseEvent
    | TouchEvent
    | PointerEvent
    | React.MouseEvent<any>
    | React.TouchEvent<any>
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
