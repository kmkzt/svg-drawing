import { useCallback, useState } from 'react'
import { PathObject } from '@svg-drawing/core'
import { UsePathOptions } from '../types'

export const usePathOptions = (initPathOpts: PathObject): UsePathOptions => {
  const [pathOptions, setPathOptions] = useState(initPathOpts)

  const changeFill = useCallback((fill: string) => {
    setPathOptions((opts) => ({
      ...opts,
      fill,
    }))
  }, [])

  const changeStroke = useCallback((stroke: string) => {
    setPathOptions((opts) => ({
      ...opts,
      stroke,
    }))
  }, [])

  const changeStrokeWidth = useCallback((strokeWidth: number) => {
    setPathOptions((opts) => ({
      ...opts,
      strokeWidth: strokeWidth + '',
    }))
  }, [])

  return [
    pathOptions,
    {
      setPathOptions,
      changeFill,
      changeStroke,
      changeStrokeWidth,
    },
  ]
}
