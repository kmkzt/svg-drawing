import type { RendererOption, Path } from '@ranklab-gaming/svg-drawing-core'
export type AnimationOption = RendererOption & {
  ms: number
}
export type FrameAnimation = (origin: Path[], loopIndex?: number) => Path[]
