import type { Path } from '@svg-drawing/core'

export type AnimationOption = {
  ms: number
}

export interface FrameAnimation {
  loops: number
  animation: (origin: Path[], key: number) => Path[]
}

export type AnimateAttribute = {
  [key in 'repeatCount' | 'dur' | 'keyTimes' | 'values']: string
}

export type AnimateObject = {
  [pathId: string]: AnimateAttribute[]
}
