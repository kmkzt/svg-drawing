import { Renderer, RendererOption } from './renderer'
import { Path } from './svg'
export interface AnimationOption extends RendererOption {
  ms: number
}
export type FrameAnimation = (origin: Path[]) => Path[]
export class SvgAnimation extends Renderer {
  public ms: number
  private _stop: (() => void) | null
  private _anim: FrameAnimation | null
  private _restorePath: Path[]
  constructor(el: HTMLElement, { background, ms }: AnimationOption) {
    super(el, { background })
    this.ms = ms ?? 60
    this._stop = null
    this._anim = null
    this._restorePath = []
  }

  public setAnimation(fn: FrameAnimation): void {
    this._anim = fn
  }

  public stop() {
    if (this._stop) {
      this._stop()
    }
  }

  public restore() {
    this.replacePaths(this._restorePath)
    this.update()
  }

  public frame() {
    if (!this._anim) return
    const updPaths = this._anim(this._restorePath.map(p => p.clone()))
    this.replacePaths(updPaths)
    this.update()
  }

  public play(): void {
    this.stop()
    const ms = this.ms
    this._restorePath = this.clonePaths()
    const frame = () => {
      if (ms !== this.ms) {
        this.play()
        return
      }
      this.frame()
    }
    const stopId = setInterval(frame, ms)
    this._stop = () => {
      clearInterval(stopId)
      this._stop = null
    }
  }
}
