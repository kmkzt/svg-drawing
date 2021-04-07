import React, {
  useCallback,
  useMemo,
  MouseEventHandler,
  MouseEvent,
} from 'react'
import { Path, Command } from '@svg-drawing/core/lib/svg'
import { PathObject, PointObject, SvgObject } from '@svg-drawing/core/lib/types'
import {
  ControlPoint,
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
  const commands: Command[] = useMemo(() => {
    if (!d) return []
    const path = new Path()
    path.parseCommandString(d)
    return path.commands
  }, [d])

  const controlPoint: ControlPoint[] = useMemo(() => {
    const result: ControlPoint[] = []
    for (let i = 0; i < commands.length; i += 1) {
      const curr = commands[i]
      const next = commands[i + 1]
      const outlinePoints = [
        curr.cr?.toJson(),
        curr.point?.toJson(),
        next?.cl?.toJson(),
      ].filter(Boolean) as PointObject[]
      result.push({
        point: curr.point?.toJson(),
        prev: curr.cl?.toJson(),
        next: curr.cr?.toJson(),
        d: genOutline(outlinePoints),
      })
    }
    return result
  }, [commands])

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
