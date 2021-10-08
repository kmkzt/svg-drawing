import { Svg } from '@svg-drawing/core'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import type { UseSvg } from '../types'
import type { ResizeCallback } from '@svg-drawing/core'

const RENDER_INTERVAL = 0

export const useSvg: UseSvg = ({ sharedSvg, defaultSvgOption = {} }) => {
  const svg = useMemo(
    () => sharedSvg || new Svg({ width: 0, height: 0, ...defaultSvgOption }),
    [sharedSvg] // eslint-disable-line
  )
  const [svgObj, setSvgObj] = useState(svg.toJson())

  /**
   * A variable called shouldUpdateRef manages whether to update to reduce the
   * number of times setState is executed.
   */
  const shouldUpdateRef = useRef<boolean>(false)
  const onUpdate = useCallback(() => {
    shouldUpdateRef.current = true
  }, [])

  useEffect(() => {
    const stopId = setInterval(() => {
      if (!shouldUpdateRef.current) return

      shouldUpdateRef.current = false
      setSvgObj(svg.toJson())
    }, RENDER_INTERVAL)

    return () => clearInterval(stopId)
  }, [svg])

  const onClear = useCallback(() => {
    svg.paths = []
    onUpdate()
  }, [svg, onUpdate])

  const onResize = useCallback<ResizeCallback>(
    ({ width, height }) => {
      svg.resize({ width, height })
      shouldUpdateRef.current = true
    },
    [svg]
  )

  return [
    svgObj,
    {
      svg,
      onUpdate,
      onClear,
      onResize,
    },
  ]
}
