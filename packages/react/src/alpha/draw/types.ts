import type { RefObject } from 'react'
import type {
  PathObject,
  SvgObject,
  DrawHandler,
  CommandsConverter,
} from '@svg-drawing/core'
import type { UseSvgOptions, SvgAction } from '../svg/types'
import type { KeyboardMap } from '../keyboard'

/**
 * useDraw options
 */
export type UseDrawOptions = UseSvgOptions & {
  active?: boolean
  pathOptions: PathObject
  commandsConverter?: CommandsConverter
  drawHandler?: typeof DrawHandler
}

/**
 * useDraw return type
 */
export type DrawAction = SvgAction & {
  onUndoDraw: () => void
  keyboardMap: KeyboardMap
}

/**
 * useDraw
 */
export type UseDraw<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  DrawAction
]

/**
 * DrawHandlerMap
 */
export type DrawHandlerMap<T extends string> = {
  [key in T]: typeof DrawHandler
}

/**
 * UseDrawHandler
 */
export type UseDrawHandler = typeof DrawHandler | undefined

/**
 * UseCommandsConverterOptions
 */
export type UseCommandsConverterOptions = {
  curve: boolean
  close: boolean
}
