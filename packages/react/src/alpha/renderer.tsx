import React, { useCallback, useMemo, useState, useEffect } from 'react'
import {
  Path,
  PathObject,
  PointObject,
  ControlPoint,
  BoundingBox,
  EditPath as EditPathCore,
} from '@svg-drawing/core'
import {
  EditPathProps,
  EditSvgProps,
  SelectPathHandler,
  SvgProps,
  EditPathIndex,
} from './types'

export const Svg = ({
  background,
  paths,
  width,
  height,
  ...rest
}: SvgProps) => (
  <svg width={width} height={height} {...rest}>
    {background && <rect width={width} height={height} fill={background} />}
    {paths.map((pathAttr, i) => (
      <path key={i} {...pathAttr} />
    ))}
  </svg>
)

export const EditSvg = ({
  editing,
  onSelect: handleSelect,
  onMove: handleMove,
  onCancel: handleCancel,
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
          onCancel={handleCancel}
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

const EditPath = ({
  d,
  editingPath,
  onSelectPath: handleSelectPath,
  onMove: handleMove,
  onCancel: handleCancel,
  ...attrs
}: EditPathProps & PathObject) => {
  const [currentPosition, setCurrentPosition] = useState<PointObject | null>(
    null
  )
  const [moving, setMoving] = useState(false)

  const path = useMemo(() => {
    const p = new Path()
    if (d) p.parseCommandString(d)
    return p
  }, [d])
  const { controlPoints, boundingBox }: EditPathCore = useMemo(() => {
    return new EditPathCore(path)
  }, [path])

  const handleClickPath = useCallback(
    (ev: React.MouseEvent<HTMLOrSVGElement>) => {
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
      ev: React.MouseEvent<SVGRectElement | SVGPathElement | SVGCircleElement>
    ) => {
      handleSelectPath(commandIndex)
      setCurrentPosition({
        x: ev.clientX,
        y: ev.clientY,
      })
      setMoving(true)
    },
    [handleSelectPath]
  )
  const handleMoveEnd = useCallback(
    (ev: MouseEvent) => {
      if (!moving || !currentPosition) return
      setMoving(false)
      handleMove({
        x: ev.clientX - currentPosition.x,
        y: ev.clientY - currentPosition.y,
      })
    },
    [moving, currentPosition, handleMove]
  )

  useEffect(() => {
    window.addEventListener('mouseup', handleMoveEnd)
    return () => window.removeEventListener('mouseup', handleMoveEnd)
  }, [handleMoveEnd])
  if (!editingPath) return <path d={d} {...attrs} onClick={handleClickPath} />
  return (
    <>
      <path d={d} {...attrs} />
      <path
        d={d}
        onClick={handleClickPath}
        strokeWidth={EDIT_CONFIG.line}
        stroke={EDIT_CONFIG.color.main}
        fill={EDIT_CONFIG.fill.default}
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
        // onMouseMove={handleMoveBoundingBox}
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
