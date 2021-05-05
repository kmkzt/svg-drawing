import { PathObject } from '@svg-drawing/core'
import { Dispatch, SetStateAction } from 'react'

export type UsePathOptionsMethods = {
  changeFill: (fill: string) => void
  changeStroke: (stroke: string) => void
  changeStrokeWidth: (strokeWidth: number) => void
  setPathOptions: Dispatch<SetStateAction<PathObject>>
}
export type UsePathOptions = [PathObject, UsePathOptionsMethods]
