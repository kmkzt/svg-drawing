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
  onUpdate: handleUpdate,
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
          onUpdate={handleUpdate}
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
  onUpdate: handleUpdate,
  onCancel: handleCancel,
  ...attrs
}: EditPathProps & PathObject) => {
  const [currentPosition, setCurrentPosition] = useState<PointObject | null>(
    null
  )
  const [moveBoundingBox, setMoveBoundingBox] = useState(false)

  const editPath: EditPathCore = useMemo(() => {
    const p = new Path()
    if (d) p.parseCommandString(d)
    return new EditPathCore(p)
  }, [d])

  const controlPoints: ControlPoint[] = useMemo(() => editPath.controlPoints, [
    editPath,
  ])

  const boundingBox: BoundingBox = useMemo(() => editPath.boundingBox, [
    editPath,
  ])

  const handleClickPath = useCallback(
    (ev: React.MouseEvent<HTMLOrSVGElement>) => {
      setCurrentPosition(null)
      handleSelectPath({})
    },
    [handleSelectPath]
  )

  const handleMouseMoveCircle = useCallback(
    (ev: React.MouseEvent<SVGCircleElement>) => {
      if (!currentPosition) return
      handleUpdate({
        x: ev.clientX - currentPosition.x,
        y: ev.clientY - currentPosition.y,
      })
      setCurrentPosition({
        x: ev.clientX,
        y: ev.clientY,
      })
    },
    [currentPosition, handleUpdate]
  )

  const handleSelectedCircle = useCallback(
    (selector: EditPathIndex) => (ev: React.MouseEvent<SVGCircleElement>) => {
      handleSelectPath(selector)
      setCurrentPosition({
        x: ev.clientX,
        y: ev.clientY,
      })
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

  const handleMoveStartBoundingBox = useCallback(
    (ev: React.MouseEvent<SVGRectElement>) => {
      handleSelectPath({})
      setCurrentPosition({
        x: ev.clientX,
        y: ev.clientY,
      })
      setMoveBoundingBox(true)
    },
    [handleSelectPath]
  )
  const handleMoveEndBoundingBox = useCallback(
    (ev: MouseEvent) => {
      if (!moveBoundingBox || !isSelectedBoundingBox || !currentPosition) return
      setMoveBoundingBox(false)
      handleUpdate({
        x: ev.clientX - currentPosition.x,
        y: ev.clientY - currentPosition.y,
      })
    },
    [moveBoundingBox, isSelectedBoundingBox, currentPosition, handleUpdate]
  )

  useEffect(() => {
    window.addEventListener('mouseup', handleMoveEndBoundingBox)
    return () => window.removeEventListener('mouseup', handleMoveEndBoundingBox)
  }, [handleMoveEndBoundingBox])
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
        onMouseDown={handleMoveStartBoundingBox}
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
                onMouseDown={handleSelectedCircle(editPathIndex)}
                onMouseMove={
                  isSelectedPoint(editPathIndex)
                    ? handleMouseMoveCircle
                    : undefined
                }
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
