import { useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Path,
  DrawHandler,
  PencilHandler,
  throttle,
  DrawMove,
  DrawStart,
  BasicPathFactory,
  PathFactory,
} from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type { PointObject } from '@svg-drawing/core'
import type { UseDrawOptions, UseDraw, DrawAction, KeyboardMap } from '../types'

const DRAW_DELAY = 20

const defaultPathFactory = new BasicPathFactory({
  stroke: 'black',
  fill: 'none',
})

export const useDraw = <T extends HTMLElement>({
  active = true,
  pathOptions,
  pathFactory: argPathFactory,
  drawHandler: CustomDrawHandler,
  sharedSvg,
}: UseDrawOptions): UseDraw<T> => {
  const [elRef, svgObj, { svg, onUpdate, ...rest }] = useSvg<T>({
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

  /**
   * Setup DrawHandler
   */
  const handler = useRef<DrawHandler>(
    (() => {
      const Handler = CustomDrawHandler ?? PencilHandler
      return new Handler(elRef.current)
    })()
  )

  useEffect(() => {
    handler.current.setHandler({
      drawStart: handleDrawStart,
      drawMove: handleDrawMove,
      drawEnd: handleDrawEnd,
    })
  }, [handler, handleDrawStart, handleDrawMove, handleDrawEnd])

  const setDrawHandler = useCallback(
    (Handler: typeof DrawHandler) => {
      if (!elRef.current) return
      const drawEl = elRef.current
      const { width, height } = drawEl.getBoundingClientRect()
      svg.resize({ width, height })
      handler.current.off()

      handler.current = new Handler(elRef.current)
      handler.current.setHandler({
        drawStart: handleDrawStart,
        drawMove: handleDrawMove,
        drawEnd: handleDrawEnd,
      })

      if (active) handler.current.on()
    },
    [elRef, handleDrawEnd, handleDrawMove, handleDrawStart, svg, active]
  )

  useEffect(() => {
    setDrawHandler(CustomDrawHandler ?? PencilHandler)
  }, [CustomDrawHandler]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const drawInstance = handler.current
    if (!elRef.current) {
      drawInstance.off()
      return
    }

    drawInstance.setElement(elRef.current)

    if (active) drawInstance.on()
  }, [elRef.current]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!active) return

    const drawInstance = handler.current
    drawInstance.on()
    return () => drawInstance.off()
  }, [active])

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
    elRef,
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
