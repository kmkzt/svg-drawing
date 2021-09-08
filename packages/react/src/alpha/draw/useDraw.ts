import { useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Path,
  throttle,
  DrawMove,
  DrawStart,
  BasicPathFactory,
  PathFactory,
} from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type { PointObject } from '@svg-drawing/core'
import type { UseDraw, DrawAction, KeyboardMap } from '../types'

const DRAW_DELAY = 20

const defaultPathFactory = new BasicPathFactory({
  stroke: 'black',
  fill: 'none',
})

/**
 * @todo Fix drawHandler type. change to DrawEventHandler
 */
export const useDraw: UseDraw = ({
  pathOptions,
  pathFactory: argPathFactory,
  drawHandler,
  sharedSvg,
}) => {
  const [svgObj, { svg, onUpdate, ...rest }] = useSvg({
    sharedSvg,
  })
  const drawPathRef = useRef<Path | null>(null)
  const drawPointsRef = useRef<PointObject[]>([])

  const pathFactory = useMemo<PathFactory>(
    () => argPathFactory ?? defaultPathFactory,
    [argPathFactory]
  )

  /**
   * Draw methods
   */
  const createDrawPath = useCallback((): Path => {
    drawPointsRef.current = []

    pathFactory.setPathAttributes(pathOptions)
    return pathFactory.create()
  }, [pathFactory, pathOptions])

  const updateCommands = useCallback(() => {
    if (!drawPathRef.current) return

    drawPathRef.current.commands = pathFactory.createCommand(
      drawPointsRef.current
    )

    onUpdate()
  }, [onUpdate, pathFactory])

  const handleDrawStart = useCallback<DrawStart>(() => {
    if (drawPathRef.current) return

    drawPathRef.current = createDrawPath()
    svg.addPath(drawPathRef.current)
  }, [createDrawPath, svg])

  const handleDrawMove = useMemo<DrawMove>(() => {
    const move: DrawMove = (po) => {
      if (!drawPathRef.current) return

      drawPointsRef.current = [...drawPointsRef.current, po]
      updateCommands()
    }

    return throttle(move, DRAW_DELAY)
  }, [updateCommands])

  const handleDrawEnd = useCallback<DrawStart>(() => {
    drawPathRef.current = null
  }, [])

  useEffect(() => {
    drawHandler.setHandler({
      drawStart: handleDrawStart,
      drawMove: handleDrawMove,
      drawEnd: handleDrawEnd,
    })
  }, [drawHandler, handleDrawStart, handleDrawMove, handleDrawEnd])

  const onUndoDraw = useCallback<DrawAction['onUndoDraw']>(() => {
    svg.paths.pop()
    onUpdate()
  }, [svg, onUpdate])

  const keyboardMap = useMemo<KeyboardMap>(
    () => ({
      ['Escape']: handleDrawEnd,
    }),
    [handleDrawEnd]
  )

  return [
    svgObj,
    {
      svg,
      onUndoDraw,
      onUpdate,
      keyboardMap,
      ...rest,
    },
  ]
}
