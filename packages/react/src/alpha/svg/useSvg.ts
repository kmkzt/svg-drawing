import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react'
import { Svg, ResizeHandler, isAlmostSameNumber } from '@svg-drawing/core'
import type { ResizeHandlerOption } from '@svg-drawing/core'
import type { UseSvgOptions, UseSvg } from './types'

const RENDER_INTERVAL = 0

export const useSvg = <T extends HTMLElement>({
  sharedSvg,
}: UseSvgOptions = {}): UseSvg<T> => {
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

  const clear = useCallback(() => {
    svg.paths = []
    update()
  }, [svg, update])
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
      clear,
    },
  ]
}
