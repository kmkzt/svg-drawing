import React, { useCallback, useMemo, MouseEvent, useState } from 'react'
import { Path } from '@svg-drawing/core/lib/svg'
import { EditPath as EditPathCore } from '@svg-drawing/core/lib/edit'
import {
  PathObject,
  PointObject,
  ControlPoint,
  BoundingBox,
} from '@svg-drawing/core/lib/types'
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
    },
    [currentPosition, handleUpdate]
  )

  const handleSelectedCircle = useCallback(
    (selector: EditPathIndex) => (ev: MouseEvent<SVGCircleElement>) => {
      setCurrentPosition({
        x: ev.clientX,
        y: ev.clientY,
      })
      handleSelectPath(selector)
    },
    [handleSelectPath]
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
      {controlPoints.map(({ point, prev, next, d }: ControlPoint, i) => (
        <g key={i}>
          <path
            d={d}
            strokeWidth={EDIT_CONFIG.line}
            stroke={editingPath.command === i ? '#f00' : EDIT_CONFIG.color.main}
            fill={EDIT_CONFIG.fill}
          />
          {[prev, next, point].map(
            (po: PointObject | undefined, k) =>
              po && (
                <circle
                  key={k}
                  cx={po.x}
                  cy={po.y}
                  onMouseDown={handleSelectedCircle({
                    command: i,
                    value: k * 2,
                  })}
                  onMouseMove={
                    editingPath.value === k * 2
                      ? handleMouseMoveCircle
                      : undefined
                  }
                  r={EDIT_CONFIG.point}
                  style={{
                    fill: EDIT_CONFIG.color.sub,
                  }}
                />
              )
          )}
        </g>
      ))}
    </>
  )
}
