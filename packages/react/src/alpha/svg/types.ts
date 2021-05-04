import type { HTMLAttributes, RefObject } from 'react'
import type { SvgObject, Svg, ResizeHandler } from '@svg-drawing/core'

/**
 * useSvg options
 */
export type UseSvgOptions = {
  sharedSvg?: Svg
}
/**
 * useSvg
 */
export type UseSvg<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseSvgProperty
]
/**
 * useSvg Return type
 */
export type UseSvgProperty = {
  svg: Svg
  resize: ResizeHandler
  update: () => void
}

export type SvgProps = SvgObject & HTMLAttributes<SVGSVGElement>
