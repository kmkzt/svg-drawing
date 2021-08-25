import { useMemo } from 'react'
import type { DrawHandlerMap, UseDrawHandler } from '../types'

export const useDrawHandler = <T extends string>(
  handlerMap: DrawHandlerMap<T>,
  type: T
): UseDrawHandler => useMemo(() => handlerMap[type], [handlerMap, type])
