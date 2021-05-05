import React, { useCallback, useMemo, useState, useEffect } from 'react'
import {
  Path,
  PathObject,
  PointObject,
  ControlPoint,
  EditPath as EditPathCore,
} from '@svg-drawing/core'
import {
  EditPathProps,
  EditPathIndex,
  EditSvgProps,
  SelectPathHandler,
} from './types'

export const EditSvg = ({
  editing,
  onSelect: handleSelect,
  onMove: handleMove,
  background,
  paths,
  width,
  height,
  ...rest
}: EditSvgProps) => {
  const handleSelectPath = useCallback(
    (pathIndex: number): SelectPathHandler => (arg) => {
      handleSelect({
        path: pathIndex,
        ...arg,
      })
    },
    [handleSelect]
  )

  return (
    <svg width={width} height={height} {...rest}>
      {background && <rect width={width} height={height} fill={background} />}
      {paths.map((pathAttr: PathObject, i) => (
        <EditPath
          key={i}
          {...(pathAttr as any)}
          editingPath={
            i === editing?.path
              ? {
                  command: editing?.command,
                  value: editing?.value,
                }
              : null
          }
          onMove={handleMove}
          onSelectPath={handleSelectPath(i)}
        />
      ))}
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

export const EditPath = ({
  d: originD,
  editingPath,
  onSelectPath: handleSelectPath,
  onMove: handleMove,
  ...attrs
}: EditPathProps & PathObject) => {
  const [currentPosition, setCurrentPosition] = useState<PointObject | null>(
    null
  )
  const [movePoint, setMovePoint] = useState<PointObject | null>(null)
  const [moving, setMoving] = useState(false)

  const path = useMemo(() => {
    const p = new Path()
    if (originD) p.parseCommandString(originD)
    return p
  }, [originD])
  const { controlPoints, boundingBox, d } = useMemo(() => {
    const editPath = new EditPathCore(path.clone())
    if (movePoint) editPath.translate(movePoint, editingPath ?? {})
    return {
      controlPoints: editPath.controlPoints,
      boundingBox: editPath.boundingBox,
      d: editPath.path.getCommandString(),
    }
  }, [path, movePoint, editingPath])

  const handleClickPath = useCallback(
    (
      _ev:
        | React.MouseEvent<HTMLOrSVGElement>
        | React.TouchEvent<HTMLOrSVGElement>
    ) => {
      setCurrentPosition(null)
      handleSelectPath({})
    },
    [handleSelectPath]
  )

  const isSelectedPoint = useCallback(
    (index: EditPathIndex): boolean => {
      if (!editingPath) return false
      return (
        editingPath.command === index.command &&
        editingPath.value === index.value
      )
    },
    [editingPath]
  )

  const isSelectedBoundingBox = useMemo(() => {
    if (!editingPath) return false
    return editingPath.command === undefined
  }, [editingPath])

  const handleMoveStart = useCallback(
    (commandIndex: EditPathIndex) => (
      ev:
        | React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
        | React.TouchEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      handleSelectPath(commandIndex)
      setCurrentPosition(getPointFromEvent(ev))
      setMoving(true)
    },
    [handleSelectPath]
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
  if (!editingPath) return <path d={d} {...attrs} onClick={handleClickPath} />
  return (
    <>
      <path d={d} {...attrs} />
      <path
        d={d}
        strokeWidth={EDIT_CONFIG.line}
        stroke={EDIT_CONFIG.color.main}
        fill={EDIT_CONFIG.fill.default}
        onClick={handleClickPath}
        onTouchStart={handleClickPath}
      />
      <rect
        {...boundingBox}
        stroke={EDIT_CONFIG.color.main}
        fill={
          isSelectedBoundingBox
            ? EDIT_CONFIG.fill.selected
            : EDIT_CONFIG.fill.boundingBox
        }
        onMouseDown={handleMoveStart({})}
        onTouchStart={handleMoveStart({})}
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
            const valueIndex = k * 2
            const editPathIndex = {
              command: commandIndex,
              value: valueIndex,
            }
            return (
              <circle
                key={k}
                cx={po.x}
                cy={po.y}
                onMouseDown={handleMoveStart(editPathIndex)}
                onTouchStart={handleMoveStart(editPathIndex)}
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
    </>
  )
}
