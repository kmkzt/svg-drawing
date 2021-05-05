import { DrawHandler } from '@svg-drawing/core'
import { useMemo, useState } from 'react'
import type { UseDrawHandler, DrawHandlerMap } from './types'

export const useDrawHandler = (
  handlerMap: DrawHandlerMap,
  defaultHandler: string
): UseDrawHandler => {
  const [type, changeType] = useState(defaultHandler)

  const drawHandler: typeof DrawHandler | undefined = useMemo(
    () => handlerMap[type],
    [handlerMap, type]
  )
  return {
    type,
    drawHandler,
    changeType,
  }
}
