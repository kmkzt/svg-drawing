import { useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Path,
  DrawHandler,
  PencilHandler,
  BezierCurve,
  CommandsConverter,
  throttle,
} from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type {
  DrawHandlerOption,
  PathObject,
  PointObject,
} from '@svg-drawing/core'
import type { UseDrawOptions, UseDraw } from './types'

const DRAW_DELAY = 20
const defaultPathOptions: PathObject = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const useDraw = <T extends HTMLElement>({
  pathOptions,
  commandsConverter,
  drawHandler: CustomDrawHandler,
  sharedSvg,
}: UseDrawOptions): UseDraw<T> => {
  const [elRef, svgObj, { svg, update, resize, clear }] = useSvg<T>({
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
    update()
  }, [converter, update])

  const handleDrawStart = useCallback<DrawHandlerOption['start']>(() => {
    if (drawPathRef.current) return
    drawPathRef.current = createDrawPath()
    svg.addPath(drawPathRef.current)
  }, [createDrawPath, svg])

  const handleDrawMove = useMemo<DrawHandlerOption['move']>(() => {
    const move: DrawHandlerOption['move'] = (po) => {
      if (!drawPathRef.current) return
      drawPointsRef.current = [...drawPointsRef.current, po]
      updateCommands()
    }
    return throttle(move, DRAW_DELAY)
  }, [updateCommands])

  const handleDrawEnd = useCallback<DrawHandlerOption['end']>(() => {
    drawPathRef.current = null
  }, [])

  /**
   * Setup DrawHandler
   */
  const handler = useRef<DrawHandler>(
    (() => {
      const Handler = CustomDrawHandler ?? PencilHandler
      return new Handler({
        el: elRef.current,
        start: handleDrawStart,
        move: handleDrawMove,
        end: handleDrawEnd,
      })
    })()
  )

  useEffect(() => {
    handler.current.start = handleDrawStart
    handler.current.move = handleDrawMove
    handler.current.end = handleDrawEnd
  }, [handleDrawStart, handleDrawMove, handleDrawEnd])

  const setDrawHandler = useCallback(
    (Handler: typeof DrawHandler) => {
      if (!elRef.current) return
      const drawEl = elRef.current
      const { width, height } = drawEl.getBoundingClientRect()
      svg.resize({ width, height })
      const isActive = handler.current.isActive
      handler.current.off()
      handler.current = new Handler({
        el: elRef.current,
        start: handleDrawStart,
        move: handleDrawMove,
        end: handleDrawEnd,
      })
      if (isActive) handler.current.on()
    },
    [elRef, handleDrawEnd, handleDrawMove, handleDrawStart, svg]
  )

  useEffect(() => {
    setDrawHandler(CustomDrawHandler ?? PencilHandler)
  }, [CustomDrawHandler]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!elRef.current) return
    const drawInstance = handler.current
    drawInstance.setElement(elRef.current)
    drawInstance.on()
    return () => drawInstance.off()
  }, [elRef.current]) // eslint-disable-line react-hooks/exhaustive-deps

  const on = useCallback(() => {
    handler.current.on()
  }, [])

  const off = useCallback(() => {
    handler.current.off()
  }, [])
  const undo = useCallback(() => {
    svg.paths.pop()
    update()
  }, [svg, update])

  return [
    elRef,
    svgObj,
    {
      svg,
      resize,
      handler: (() => handler.current)(),
      update,
      undo,
      clear,
      on,
      off,
    },
  ]
}
