import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  RefObject,
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
  SvgObject,
} from '@svg-drawing/core'
import type {
  DrawHandlerCallback,
  PathObject,
  PointObject,
} from '@svg-drawing/core'
import type { DrawOptions, EditIndex, UseDraw } from './types'

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

export const useSvg = <T extends HTMLElement>(): [
  RefObject<T>,
  SvgObject,
  { svg: Svg; update: () => void; resize: ResizeHandler }
] => {
  const renderRef = useRef<T>(null)
  const svg = useMemo(() => new Svg({ width: 0, height: 0 }), [])
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
    if (!renderRef.current) return
    resize.setElement(renderRef.current)
    resize.on()
    return () => resize.off()
  }, [resize])

  return [
    renderRef,
    svgObj,
    {
      svg,
      update,
      resize,
    },
  ]
}
export const useDraw = <T extends HTMLElement>({
  pathOptions,
  commandsConverter,
  drawHandler: CustomDrawHandler,
}: DrawOptions): UseDraw<T> => {
  const drawPathRef = useRef<Path | null>(null)
  const drawPointsRef = useRef<PointObject[]>([])
  const [editing, setEditing] = useState<EditIndex>(initEditing)
  const converter = useMemo<CommandsConverter>(
    () => commandsConverter ?? new BezierCurve().convert,
    [commandsConverter]
  )

  const [drawElRef, svgObj, { svg, update, resize }] = useSvg<T>()


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
  const draw = useRef<DrawHandler>(
    (() => {
      const Handler = CustomDrawHandler ?? PencilHandler
      return new Handler({
        el: drawElRef.current,
        start: handleDrawStart,
        move: handleDrawMove,
        end: handleDrawEnd,
      })
    })()
  )

  useEffect(() => {
    draw.current.start = handleDrawStart
    draw.current.move = handleDrawMove
    draw.current.end = handleDrawEnd
  }, [handleDrawStart, handleDrawMove, handleDrawEnd])

  const setDrawHandler = useCallback(
    (Handler: typeof DrawHandler) => {
      if (!drawElRef.current) return
      const drawEl = drawElRef.current
      const { width, height } = drawEl.getBoundingClientRect()
      svg.resize({ width, height })
      const isActive = draw.current.isActive
      draw.current.off()
      draw.current = new Handler({
        el: drawElRef.current,
        start: handleDrawStart,
        move: handleDrawMove,
        end: handleDrawEnd,
      })
      if (isActive) draw.current.on()
    },
    [handleDrawEnd, handleDrawMove, handleDrawStart, svg]
  )

  useEffect(() => {
    setDrawHandler(CustomDrawHandler ?? PencilHandler)
  }, [CustomDrawHandler]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!drawElRef.current) return
    draw.current.setElement(drawElRef.current)
    draw.current.on()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!drawElRef.current) return
    resize.setElement(drawElRef.current)
    resize.on()
    return () => resize.off()
  }, [resize])

  /**
   * Methods
   */
  const on = useCallback(() => {
    resize.on()
    draw.current.on()
  }, [resize])

  const off = useCallback(() => {
    resize.off()
    draw.current.off()
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
      draw: (() => draw.current)(),
      update,
      undo,
      clear,
      on,
      off,
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
