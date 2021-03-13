import React, {
  useState,
  useRef,
  RefObject,
  useEffect,
  useCallback,
} from 'react'
import { Svg } from '@svg-drawing/core'
import type { DrawingOption, SvgObject, SvgOption } from '@svg-drawing/core'

type UseDrawingUnstable<T extends HTMLElement = any> = [
  RefObject<T | null>,
  SvgObject
]

export const useDrawingUnstable = <T extends HTMLElement>({
  penColor,
  penWidth,
  close,
  curve,
  delay,
  fill,
  background,
}: DrawingOption & Pick<SvgOption, 'background'>): UseDrawingUnstable<T> => {
  const refDrawEl = useRef<T>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [svg, setSvg] = useState(new Svg(width, height))

  const setSize = useCallback(
    ({ width, height }: DOMRect | { width: number; height: number }) => {
      setWidth(width)
      setHeight(height)
    },
    [setWidth, setHeight]
  )

  const handleResizeObserver = useCallback(
    ([el]: any[]) => {
      console.log(el)
      const { width, height } = el.contentRect
      setSize({ width, height })
    },
    [setSize]
  )
  useEffect(() => {
    if (!refDrawEl.current) return
    const { width, height } = refDrawEl.current.getBoundingClientRect()
    setSize({ width, height })
    setSvg(new Svg({ width, height, background }))

    const eventRemoveList: Array<() => void> = []

    if ('ResizeObserver' in window) {
      const { ResizeObserver }: any = window
      const observer = new ResizeObserver(handleResizeObserver)
      observer.observe(refDrawEl.current)
      eventRemoveList.push(() => observer.dispose())
    } else {
      const handleResize = () => {
        if (!refDrawEl.current) return
        setSize(refDrawEl.current.getBoundingClientRect())
      }
      window.addEventListener('resize', handleResize)
      eventRemoveList.push(() =>
        window.removeEventListener('resize', handleResize)
      )
    }

    return () => eventRemoveList.forEach((fn) => fn())
  }, [handleResizeObserver, setSize])
  return [refDrawEl, svg.toJson()]
}

export const RenderSvg = ({ background, paths, ...size }: SvgObject) => (
  <svg {...size}>
    {background && <rect {...size} fill={background} />}
    {paths.map((pathAttr, i) => (
      <path key={i} {...pathAttr} />
    ))}
  </svg>
)
