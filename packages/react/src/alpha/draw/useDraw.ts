import { useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Path,
  DrawHandler,
  PencilHandler,
  BezierCurve,
  CommandsConverter,
  throttle,
  DrawEventHandler,
} from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type { PathObject, PointObject } from '@svg-drawing/core'
import type { UseDrawOptions, UseDraw, DrawAction, KeyboardMap } from '../types'

const DRAW_DELAY = 20
const defaultPathOptions: PathObject = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const useDraw = <T extends HTMLElement>({
  active = true,
  pathOptions,
  commandsConverter,
  drawHandler: CustomDrawHandler,
  sharedSvg,
}: UseDrawOptions): UseDraw<T> => {
  const [elRef, svgObj, { svg, onUpdate, ...rest }] = useSvg<T>({
    sharedSvg,
  })
  const drawPathRef = useRef<Path | null>(null)
  const drawPointsRef = useRef<PointObject[]>([])
  const converter = useMemo<CommandsConverter>(
    () => commandsConverter ?? new BezierCurve().convert,
    [commandsConverter]
  )
  /**
   * Draw methods
   */
  const createDrawPath = useCallback((): Path => {
    drawPointsRef.current = []
    return new Path({
      ...defaultPathOptions,
      ...pathOptions,
    })
  }, [pathOptions])

  const updateCommands = useCallback(() => {
    if (!drawPathRef.current) return
    drawPathRef.current.commands = converter(drawPointsRef.current)
    onUpdate()
  }, [converter, onUpdate])

  const handleDrawStart = useCallback<DrawEventHandler['drawStart']>(() => {
    if (drawPathRef.current) return
    drawPathRef.current = createDrawPath()
    svg.addPath(drawPathRef.current)
  }, [createDrawPath, svg])

  const handleDrawMove = useMemo<DrawEventHandler['drawMove']>(() => {
    const move: DrawEventHandler['drawMove'] = (po) => {
      if (!drawPathRef.current) return
      drawPointsRef.current = [...drawPointsRef.current, po]
      updateCommands()
    }
    return throttle(move, DRAW_DELAY)
  }, [updateCommands])

  const handleDrawEnd = useCallback<DrawEventHandler['drawEnd']>(() => {
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

  const keyboardMap = useMemo<KeyboardMap>(() => {
    return {
      ['Escape']: handleDrawEnd,
    }
  }, [handleDrawEnd])

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
