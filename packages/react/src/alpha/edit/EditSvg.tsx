import React, { useCallback, useMemo, useState, useEffect } from 'react'
import {
  PathObject,
  PointObject,
  ControlPoint,
  ResizeEditType,
} from '@svg-drawing/core'
import { EditSvgProps } from './types'

type EditPointIndex = {
  path: number
  command: number
  point: number
}

type ResizeBasePoint = {
  type: ResizeEditType
} & PointObject

export const EditSvg = ({
  selecting,
  background,
  paths,
  width,
  height,
  boundingBox,
  selectPaths,
  onSelect: handleSelect,
  onMove: handleMove,
  onMovePreview: handleMovePreview,
  onResizeEdit: handleResizeEdit,
  ...rest
}: EditSvgProps) => {
  const [currentPosition, setCurrentPosition] = useState<PointObject | null>(
    null
  )

  const [
    resizeBasePoint,
    setResizeBasePoint,
  ] = useState<ResizeBasePoint | null>(null)

  const isSelectedBoundingBox = useMemo(() => {
    if (Object.keys(selecting).length < 1) return false
    return Object.keys(selecting).every((pKey: string) => {
      const selectingCommand = selecting[+pKey]
      return Object.keys(selectingCommand).length === 0
    })
  }, [selecting])

  const isSelectedPoint = useCallback(
    ({ path, command, point }: EditPointIndex): boolean => {
      if (!(path in selecting)) return false
      const selectingCommand = selecting[path]
      if (!(command in selectingCommand)) return false
      return selectingCommand[command].includes(point)
    },
    [selecting]
  )

  const handleMoveStart = useCallback(
    (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      setCurrentPosition(getPointFromEvent(ev))
    },
    []
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
      handleMoveStart(ev)
    },
    [handleMoveStart, handleSelect]
  )

  const handleMoveStartPath = useCallback(
    (i: number) => (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      handleSelect({
        [i]: {},
      })
      handleMoveStart(ev)
    },
    [handleMoveStart, handleSelect]
  )

  // move preview
  const handleMoveEdit = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!currentPosition) return
      const { x, y } = getPointFromEvent(ev)
      handleMovePreview({
        x: x - currentPosition.x,
        y: y - currentPosition.y,
      })
    },
    [currentPosition, handleMovePreview]
  )

  // move
  const handleMoveEnd = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!currentPosition) return
      const { x, y } = getPointFromEvent(ev)
      handleMove({
        x: x - currentPosition.x,
        y: y - currentPosition.y,
      })
      setCurrentPosition(null)
    },
    [currentPosition, handleMove]
  )

  const handleResizeStart = useCallback(
    (type: ResizeEditType) => (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      ev.preventDefault()
      const { x, y } = getPointFromEvent(ev)
      setResizeBasePoint({
        type,
        x,
        y,
      })
    },
    []
  )

  // resize edit
  const handleResizeEnd = useCallback(
    (ev: MouseEvent | TouchEvent) => {
      if (!resizeBasePoint) return
      const { x, y } = getPointFromEvent(ev)
      const { type, ...base } = resizeBasePoint

      handleResizeEdit(type, {
        x: x - base.x,
        y: y - base.y,
      })
      setResizeBasePoint(null)
    },
    [handleResizeEdit, resizeBasePoint]
  )

  useEffect(() => {
    // move
    window.addEventListener('mouseup', handleMoveEnd)
    window.addEventListener('touchcancel', handleMoveEnd)

    // movePreview
    window.addEventListener('mousemove', handleMoveEdit)
    window.addEventListener('touchmove', handleMoveEdit)

    // resizeEdit
    window.addEventListener('mouseup', handleResizeEnd)
    window.addEventListener('touchcancel', handleResizeEnd)

    return () => {
      // move
      window.removeEventListener('mouseup', handleMoveEnd)
      window.removeEventListener('touchcancel', handleMoveEnd)

      // movePreview
      window.removeEventListener('mousemove', handleMoveEdit)
      window.removeEventListener('touchmove', handleMoveEdit)

      // resizeEdit
      window.removeEventListener('mouseup', handleResizeEnd)
      window.removeEventListener('touchcancel', handleResizeEnd)
    }
  }, [handleMoveEnd, handleMoveEdit, handleResizeEnd])

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
        onMouseDown={handleMoveStart}
        onTouchStart={handleMoveStart}
      />
      {paths.map((pathAttr: PathObject, pathIndex) => (
        <path
          key={pathIndex}
          {...pathAttr}
          onMouseDown={handleMoveStartPath(pathIndex)}
          onTouchStart={handleMoveStartPath(pathIndex)}
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
              fill={EDIT_CONFIG.fill.boundingBox}
              onMouseDown={handleMoveStartPath(pathIndex)}
              onTouchStart={handleMoveStartPath(pathIndex)}
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
      <circle
        cx={boundingBox.min[0]}
        cy={boundingBox.min[1]}
        r={EDIT_CONFIG.point}
        stroke={EDIT_CONFIG.color.main}
        fill={
          isSelectedBoundingBox
            ? EDIT_CONFIG.fill.selected
            : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleResizeStart('LeftTop')}
        onTouchStart={handleResizeStart('LeftTop')}
      />
      <circle
        cx={boundingBox.max[0]}
        cy={boundingBox.min[1]}
        r={EDIT_CONFIG.point}
        stroke={EDIT_CONFIG.color.main}
        fill={
          isSelectedBoundingBox
            ? EDIT_CONFIG.fill.selected
            : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleResizeStart('RightTop')}
        onTouchStart={handleResizeStart('RightTop')}
      />
      <circle
        cx={boundingBox.min[0]}
        cy={boundingBox.max[1]}
        r={EDIT_CONFIG.point}
        stroke={EDIT_CONFIG.color.main}
        fill={
          isSelectedBoundingBox
            ? EDIT_CONFIG.fill.selected
            : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleResizeStart('LeftBottom')}
        onTouchStart={handleResizeStart('LeftBottom')}
      />
      <circle
        cx={boundingBox.max[0]}
        cy={boundingBox.max[1]}
        r={EDIT_CONFIG.point}
        stroke={EDIT_CONFIG.color.main}
        fill={
          isSelectedBoundingBox
            ? EDIT_CONFIG.fill.selected
            : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleResizeStart('RightBottom')}
        onTouchStart={handleResizeStart('RightBottom')}
      />
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
