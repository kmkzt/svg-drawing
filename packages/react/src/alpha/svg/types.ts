import type { RefObject } from 'react'
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
export type UseSvg<T extends HTMLElement> = [RefObject<T>, SvgObject, SvgAction]
/**
 * useSvg Return type
 */
export type SvgAction = {
  svg: Svg
  resize: ResizeHandler
  onUpdate: () => void
  onClear: () => void
}
