import { Renderer, RendererOption } from './renderer'
import { Path } from './svg'
export interface AnimationOption extends RendererOption {
  ms: number
}
export type FrameAnimation = (origin: Path[]) => Path[]
export class SvgAnimation extends Renderer {
  public ms: number
  private _stopId: number
  private _stop: (() => void) | null
  private _anim: FrameAnimation | null
  private _restorePath: Path[]
  constructor(el: HTMLElement, { background, ms }: AnimationOption) {
    super(el, { background })
    this.ms = ms ?? 60
    this._stop = null
    this._anim = null
    this._restorePath = []
    this._stopId = 0
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

  public start(): void {
    this.stop()
    const ms = this.ms
    this._restorePath = this.clonePaths()
    let start: number | undefined
    const frame: FrameRequestCallback = timestamp => {
      if (ms !== this.ms) {
        this.start()
        return
      }
      if (!start || timestamp - start > ms) {
        start = timestamp
        this.frame()
      }
      this._stopId = requestAnimationFrame(frame)
    }
    this._stopId = requestAnimationFrame(frame)
    this._stop = () => {
      cancelAnimationFrame(this._stopId)
      this._stop = null
    }
  }
}
