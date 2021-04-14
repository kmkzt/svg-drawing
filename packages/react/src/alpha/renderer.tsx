import React, { useCallback, useMemo, MouseEvent, useState } from 'react'
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
      console.log({
        path: pathIndex,
        ...arg,
      })
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
  fill: 'none',
} as const

const EditPath = ({
  d,
  editingPath,
  onSelectPath: handleSelectPath,
  onUpdate: handleUpdate,
  ...attrs
}: EditPathProps & PathObject) => {
  const [currentPosition, setCurrentPosition] = useState<PointObject | null>(
    null
  )

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
    (ev: MouseEvent<HTMLOrSVGElement>) => {
      setCurrentPosition(null)
      handleSelectPath({})
    },
    [handleSelectPath]
  )

  const handleMouseMoveCircle = useCallback(
    (ev: MouseEvent<SVGCircleElement>) => {
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
    (selector: EditPathIndex) => (ev: MouseEvent<SVGCircleElement>) => {
      handleSelectPath(selector)
      setCurrentPosition({
        x: ev.clientX,
        y: ev.clientY,
      })
    },
    [handleSelectPath]
  )

  const isEditing = useCallback(
    (index: EditPathIndex): boolean => {
      if (!editingPath) return false
      return (
        editingPath.command === index.command &&
        editingPath.value === index.value
      )
    },
    [editingPath]
  )

  if (!editingPath) return <path d={d} {...attrs} onClick={handleClickPath} />
  return (
    <>
      <path d={d} {...attrs} />
      <path
        d={d}
        onClick={handleClickPath}
        strokeWidth={EDIT_CONFIG.line}
        stroke={EDIT_CONFIG.color.main}
        fill={EDIT_CONFIG.fill}
      />
      <rect
        {...boundingBox}
        stroke={EDIT_CONFIG.color.main}
        fill={EDIT_CONFIG.fill}
      />
      {controlPoints.map(
        ({ point, prev, next, d }: ControlPoint, commandIndex) => (
          <g key={commandIndex}>
            <path
              d={d}
              strokeWidth={EDIT_CONFIG.line}
              stroke={EDIT_CONFIG.color.main}
              fill={EDIT_CONFIG.fill}
            />
            {[prev, next, point].map((po: PointObject | undefined, k) => {
              const valueIndex = k * 2
              const editPathIndex = {
                command: commandIndex,
                value: valueIndex,
              }
              return (
                po && (
                  <circle
                    key={k}
                    cx={po.x}
                    cy={po.y}
                    onMouseDown={handleSelectedCircle(editPathIndex)}
                    onMouseMove={
                      isEditing(editPathIndex)
                        ? handleMouseMoveCircle
                        : undefined
                    }
                    r={EDIT_CONFIG.point}
                    style={{
                      fill: isEditing(editPathIndex)
                        ? EDIT_CONFIG.color.selected
                        : EDIT_CONFIG.color.sub,
                    }}
                  />
                )
              )
            })}
          </g>
        )
      )}
    </>
  )
}
