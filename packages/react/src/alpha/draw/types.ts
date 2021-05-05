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
  draw: DrawHandler
  on: () => void
  off: () => void
  update: () => void
  clear: () => void
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
export type DrawHandlerMap = { [key: string]: typeof DrawHandler }
/**
 * UseDrawHandler
 */
export type UseDrawHandler = {
  type: string
  drawHandler: typeof DrawHandler | undefined
  changeType: (type: string) => void
}
