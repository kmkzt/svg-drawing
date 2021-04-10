import React, {
  useCallback,
  useMemo,
  MouseEventHandler,
  MouseEvent,
} from 'react'
import { Path } from '@svg-drawing/core/lib/svg'
import { EditPath as EditPathCore } from '@svg-drawing/core/lib/edit'
import {
  PathObject,
  PointObject,
  SvgObject,
  ControlPoint,
} from '@svg-drawing/core/lib/types'
import {
  EditCommandIndex,
  EditPathEventHandler,
  EditSvgEventHandler,
  SelectCommandHandler,
  UpdateCommandHandler,
} from './types'

export const RenderSvg = ({
  background,
  paths,
  editing,
  onSelectPath: handleSelectPath,
  onUpdatePath: handleUpdatePath,
  ...size
}: SvgObject & EditSvgEventHandler) => {
  const handleClickPath = useCallback(
    (pathIndex: number): MouseEventHandler => (ev) => {
      ev.preventDefault()
      handleSelectPath({
        path: pathIndex,
      })
    },
    [handleSelectPath]
  )

  const handleSelectCommand = useCallback(
    (pathIndex: number): SelectCommandHandler => (arg) => {
      handleSelectPath({
        path: pathIndex,
        ...arg,
      })
    },
    [handleSelectPath]
  )

  const handleUpdateCommand = useCallback(
    (pathIndex: number): UpdateCommandHandler => ({ index, point }) => {
      handleUpdatePath({
        index: {
          path: pathIndex,
          ...index,
        },
        point,
      })
    },
    [handleUpdatePath]
  )

  return (
    <svg {...size}>
      {background && <rect {...size} fill={background} />}
      {paths.map((pathAttr: PathObject, i) =>
        i === editing?.path ? (
          <EditPath
            key={i}
            {...(pathAttr as any)}
            editing={{
              command: editing?.command,
              value: editing?.value,
            }}
            onUpdateCommand={handleUpdateCommand(i)}
            onSelectCommand={handleSelectCommand(i)}
          />
        ) : (
          <path key={i} {...pathAttr} onClick={handleClickPath(i)} />
        )
      )}
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

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

export const EditPath = ({
  d,
  editing,
  onUpdateCommand: handleUpdateCommand,
  onSelectCommand: handleSelectCommand,
  ...attrs
}: EditPathEventHandler & PathObject) => {
  const editPath: EditPathCore = useMemo(() => {
    const p = new Path()
    if (d) p.parseCommandString(d)
    return new EditPathCore(p)
  }, [d])

  const controlPoint: ControlPoint[] = useMemo(() => editPath.controlPoint(), [
    editPath,
  ])

  const handleClickPath = useCallback(
    (_ev: MouseEvent<HTMLOrSVGElement>) => {
      handleSelectCommand({})
    },
    [handleSelectCommand]
  )

  const handleMouseMovePoint = useCallback(
    (
      index: Required<EditCommandIndex>
    ): MouseEventHandler<HTMLOrSVGElement> => (ev) => {
      handleUpdateCommand({
        index,
        point: {
          x: ev.clientX,
          y: ev.clientY,
        },
      })
    },
    [handleUpdateCommand]
  )

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
      {controlPoint.map(({ point, prev, next, d }: ControlPoint, i) => (
        <g key={i}>
          <path
            d={d}
            strokeWidth={EDIT_CONFIG.line}
            stroke={editing?.command === i ? '#f00' : EDIT_CONFIG.color.main}
            fill={EDIT_CONFIG.fill}
          />
          {[prev, next, point].map(
            (po: PointObject | undefined, k) =>
              po && (
                <circle
                  key={k}
                  cx={po.x}
                  cy={po.y}
                  onMouseMove={handleMouseMovePoint({
                    command: i,
                    value: k * 2,
                  })}
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
