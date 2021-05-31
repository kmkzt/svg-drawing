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
  onMovePreview: handleMovePreview,
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
  const [moving, setMoving] = useState(false)

  const isSelectedBoundingBox = useMemo(() => {
    if (Object.keys(selecting).length < 1) return false
    return Object.keys(selecting).every((pKey: string) => {
      const selectingCommand = selecting[+pKey]
      return Object.keys(selectingCommand).length === 0
    })
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
      return selectingCommand[command].includes(point)
    },
    [selecting]
  )

  const handleMoveStartPoint = useCallback(
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

  const handleMoveStartPath = useCallback(
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
      handleMovePreview({
        x: x - currentPosition.x,
        y: y - currentPosition.y,
      })
    },
    [currentPosition, handleMovePreview, moving]
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
        onMouseDown={handleMoveStartPath}
        onTouchStart={handleMoveStartPath}
      />
      {paths.map((pathAttr: PathObject, pathIndex) => (
        <path
          key={pathIndex}
          {...pathAttr}
          onClick={handleClickPath(pathIndex)}
          onTouchStart={handleClickPath(pathIndex)}
        />
      ))}
      {Object.entries(selectPaths).map(([key, editPath]) => {
        const pathIndex = +key
        const { controlPoints, d } = editPath
        return (
          <g key={pathIndex}>
            <path
              d={d}
              strokeWidth={EDIT_CONFIG.line}
              stroke={EDIT_CONFIG.color.main}
              fill={EDIT_CONFIG.fill.selected}
              onMouseDown={handleMoveStartPath}
              onTouchStart={handleMoveStartPath}
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
