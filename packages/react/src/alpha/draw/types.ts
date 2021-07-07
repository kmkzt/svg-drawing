import type { RefObject } from 'react'
import type {
  PathObject,
  SvgObject,
  DrawHandler,
  CommandsConverter,
} from '@svg-drawing/core'
import type { UseSvgOptions, UseSvgProperty } from '../svg/types'

/**
 * useDraw options
 */
export type UseDrawOptions = UseSvgOptions & {
  pathOptions: PathObject
  commandsConverter?: CommandsConverter
  drawHandler?: typeof DrawHandler
}

/**
 * useDraw return type
 */
export type UseDrawProperty = UseSvgProperty & {
  isActive: boolean
  on: () => void
  off: () => void
  undo: () => void
}

/**
 * useDraw
 */
export type UseDraw<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseDrawProperty
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
