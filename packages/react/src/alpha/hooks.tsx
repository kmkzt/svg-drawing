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
} from '@svg-drawing/core'
import type {
  DrawHandlerOption,
  ResizeHandlerOption,
  PathObject,
  PointObject,
} from '@svg-drawing/core'
import type {
  DrawOptions,
  EditIndex,
  EditOptions,
  SvgOptions,
  UseDraw,
  UseEdit,
  UseEditProperty,
  UseSvg,
} from './types'

const RENDER_INTERVAL = 0
const DRAW_DELAY = 20
const defaultPathOptions: PathObject = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const useSvg = <T extends HTMLElement>({
  sharedSvg,
}: SvgOptions = {}): UseSvg<T> => {
  const renderRef = useRef<T>(null)
  const svg = useMemo(() => sharedSvg || new Svg({ width: 0, height: 0 }), [
    sharedSvg,
  ])
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
  const resizeCallback = useCallback<ResizeHandlerOption['resize']>(
    ({ width, height }) => {
      if (isAlmostSameNumber(svg.width, width)) return
      svg.resize({ width, height })
      shouldUpdateRef.current = true
    },
    [svg]
  )
  const resize = useMemo<ResizeHandler>(
    () => new ResizeHandler({ resize: resizeCallback }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
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
  sharedSvg,
}: DrawOptions): UseDraw<T> => {
  const [elRef, svgObj, { svg, update, resize }] = useSvg<T>({ sharedSvg })
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
  const draw = useRef<DrawHandler>(
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
    draw.current.start = handleDrawStart
    draw.current.move = handleDrawMove
    draw.current.end = handleDrawEnd
  }, [handleDrawStart, handleDrawMove, handleDrawEnd])

  const setDrawHandler = useCallback(
    (Handler: typeof DrawHandler) => {
      if (!elRef.current) return
      const drawEl = elRef.current
      const { width, height } = drawEl.getBoundingClientRect()
      svg.resize({ width, height })
      const isActive = draw.current.isActive
      draw.current.off()
      draw.current = new Handler({
        el: elRef.current,
        start: handleDrawStart,
        move: handleDrawMove,
        end: handleDrawEnd,
      })
      if (isActive) draw.current.on()
    },
    [elRef, handleDrawEnd, handleDrawMove, handleDrawStart, svg]
  )

  useEffect(() => {
    setDrawHandler(CustomDrawHandler ?? PencilHandler)
  }, [CustomDrawHandler]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!elRef.current) return
    draw.current.setElement(elRef.current)
    draw.current.on()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

  return [
    elRef,
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
    },
  ]
}

const initEditing: EditIndex = {
  path: undefined,
  command: undefined,
  value: undefined,
}

export const useEdit = <T extends HTMLElement>({
  sharedSvg,
}: EditOptions): UseEdit<T> => {
  const [ref, svgObj, { svg, update, resize }] = useSvg<T>({ sharedSvg })
  const [editing, setEditing] = useState<UseEditProperty['editing']>(
    initEditing
  )

  const select = useCallback<UseEditProperty['select']>((editIndex) => {
    setEditing(editIndex)
  }, [])

  const move = useCallback<UseEditProperty['move']>(
    (move) => {
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

  const edit = useCallback<UseEditProperty['edit']>(
    (arg) => {
      if (editing.path === undefined) return
      const path = svg.paths[editing.path]
      new EditPath(path).edit(arg)
      update()
    },
    [editing.path, svg.paths, update]
  )

  const cancel = useCallback<UseEditProperty['cancel']>(() => {
    setEditing(initEditing)
  }, [])
  return [
    ref,
    svgObj,
    {
      svg,
      update,
      resize,
      editing,
      select,
      move,
      edit,
      cancel,
    },
  ]
}
