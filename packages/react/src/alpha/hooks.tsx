import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react'
import {
  Svg,
  Path,
  DrawHandler,
  PencilHandler,
  ResizeHandler,
  EditPath,
  BezierCurve,
  CommandsConverter,
  throttle,
  isAlmostSameNumber,
  ResizeHandlerCallback,
} from '@svg-drawing/core'
import type {
  DrawHandlerCallback,
  PathObject,
  PointObject,
} from '@svg-drawing/core'
import type { DrawingOptions, EditIndex, UseDrawing } from './types'

const RENDER_INTERVAL = 0
const DRAW_DELAY = 20
const defaultPathOptions: PathObject = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}
const initEditing: EditIndex = {
  path: undefined,
  command: undefined,
  value: undefined,
}
export const useDrawing = <T extends HTMLElement>({
  pathOptions,
  commandsConverter,
  drawHandler: CustomDrawHandler,
}: DrawingOptions): UseDrawing<T> => {
  const drawElRef = useRef<T>(null)
  const svg = useMemo(() => new Svg({ width: 0, height: 0 }), [])
  const drawPathRef = useRef<Path | null>(null)
  const drawPointsRef = useRef<PointObject[]>([])
  const [editing, setEditing] = useState<EditIndex>(initEditing)
  const converter = useMemo<CommandsConverter>(
    () => commandsConverter ?? new BezierCurve().convert,
    [commandsConverter]
  )

  const [svgObj, setSvgObj] = useState(svg.toJson())

  /**
   * A variable called shouldUpdateRef manages whether to update to reduce the number of times setState is executed.
   */
  const shouldUpdateRef = useRef<boolean>(false)
  const update = useCallback(() => {
    shouldUpdateRef.current = true
  }, [])
  useLayoutEffect(() => {
    const stopId = setInterval(() => {
      if (!shouldUpdateRef.current) return
      shouldUpdateRef.current = false
      setSvgObj(svg.toJson())
    }, RENDER_INTERVAL)
    return () => clearInterval(stopId)
  }, [svg])

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

  const handleDrawStart = useCallback<DrawHandlerCallback['start']>(() => {
    if (drawPathRef.current) return
    drawPathRef.current = createDrawPath()
    svg.addPath(drawPathRef.current)
  }, [createDrawPath, svg])

  const handleDrawMove = useMemo<DrawHandlerCallback['move']>(() => {
    const move: DrawHandlerCallback['move'] = (po) => {
      if (!drawPathRef.current) return
      drawPointsRef.current = [...drawPointsRef.current, po]
      updateCommands()
    }
    return throttle(move, DRAW_DELAY)
  }, [updateCommands])

  const handleDrawEnd = useCallback<DrawHandlerCallback['end']>(() => {
    drawPathRef.current = null
  }, [])

  /**
   * Setup DrawHandler
   */
  const drawHandlerRef = useRef<DrawHandler | null>(null)

  useEffect(() => {
    if (!drawHandlerRef.current) return
    drawHandlerRef.current.start = handleDrawStart
    drawHandlerRef.current.move = handleDrawMove
    drawHandlerRef.current.end = handleDrawEnd
  }, [handleDrawStart, handleDrawMove, handleDrawEnd])

  const setDrawHandler = useCallback(
    (Handler: typeof DrawHandler) => {
      if (!drawElRef.current) return
      const drawEl = drawElRef.current
      const { width, height } = drawEl.getBoundingClientRect()
      svg.resize({ width, height })
      drawHandlerRef.current = new Handler({
        el: drawElRef.current,
        start: handleDrawStart,
        move: handleDrawMove,
        end: handleDrawEnd,
      })
      drawHandlerRef.current.on()
    },
    [handleDrawEnd, handleDrawMove, handleDrawStart, svg]
  )

  useEffect(() => {
    if (drawHandlerRef.current) drawHandlerRef.current.off()
    setDrawHandler(CustomDrawHandler ?? PencilHandler)
  }, [CustomDrawHandler, setDrawHandler]) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Setup ResizeHandler
   */
  const resizeCallback = useCallback<ResizeHandlerCallback['resize']>(
    ({ width, height }) => {
      if (isAlmostSameNumber(svg.width, width)) return
      svg.resize({ width, height })
      shouldUpdateRef.current = true
    },
    [svg]
  )
  const resize = useMemo<ResizeHandler>(
    () => new ResizeHandler({ resize: resizeCallback }),
    []
  )
  useEffect(() => {
    if (!drawElRef.current) return
    resize.setElement(drawElRef.current)
    resize.on()
    return () => resize.off()
  }, [resize])

  /**
   * Methods
   */
  const start = useCallback(() => {
    resize.on()
    if (drawHandlerRef.current) drawHandlerRef.current.on()
  }, [resize])

  const stop = useCallback(() => {
    resize.off()
    if (drawHandlerRef.current) drawHandlerRef.current.on()
  }, [resize])

  const clear = useCallback(() => {
    svg.paths = []
    update()
  }, [svg, update])

  const undo = useCallback(() => {
    svg.paths.pop()
    update()
  }, [svg, update])

  const onSelect = useCallback((editIndex: EditIndex) => {
    setEditing(editIndex)
  }, [])

  const onMove = useCallback(
    (move: PointObject) => {
      if (editing.path === undefined) return
      const path = svg.paths[editing.path]
      new EditPath(path).translate(move, {
        command: editing.command,
        value: editing.value,
      })
      update()
    },
    [svg, editing, update]
  )

  const onEdit = useCallback(
    (arg: PathObject) => {
      if (editing.path === undefined) return
      const path = svg.paths[editing.path]
      new EditPath(path).edit(arg)
      update()
    },
    [editing.path, svg.paths, update]
  )

  const onCancel = useCallback(() => {
    setEditing(initEditing)
  }, [])

  return [
    drawElRef,
    svgObj,
    {
      svg,
      resize,
      draw: drawHandlerRef,
      update,
      undo,
      clear,
      start,
      stop,
      editProps: {
        editing,
        onSelect,
        onMove,
        onEdit,
        onCancel,
      },
    },
  ]
}
