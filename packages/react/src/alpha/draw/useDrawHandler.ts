import { useMemo } from 'react'
import type { DrawHandler } from '@svg-drawing/core'
import type { DrawHandlerMap } from '../types'

/**
 * @todo usePencilHandler
 * @todo usePenHandler
 */
export const useDrawHandler = <T extends string>(
  handlerMap: DrawHandlerMap<T>,
  type: T
): typeof DrawHandler => useMemo(() => handlerMap[type], [handlerMap, type])
