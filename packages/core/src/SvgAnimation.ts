import { Animation } from './animation/animation'
import { SvgRenderer, toElement } from './renderer/svgRenderer'
import { Svg } from './svg/svg'
import type {
  AnimationOption,
  RendererOption,
  ResizeCallback,
  SvgClass,
} from './types'

export class SvgAnimation {
  private _stopId?: number
  constructor(
    public svg: SvgClass,
    public animation: Animation,
    private update: (svg: SvgClass) => void
  ) {
    this.resize = this.resize.bind(this)
  }

  public stop(): void {
    if (!this._stopId) return

    cancelAnimationFrame(this._stopId)
    this.restore()
  }

  public restore(): void {
    this.svg.elements = this.animation.restorePaths()
    this.update(this.svg)
  }

  public start(): void {
    // If do not this first, this cannot get the number of frames well.
    this.stop()

    this._setupAnimation()
    this._startAnimation()
  }

  private _setupAnimation() {
    this.animation.initialize(this.svg.elements)
  }

  private _updateFrame() {
    if (!this.animation.generator) return

    const result = this.animation.generator.next()
    if (result.done) {
      this.stop()
      return
    }

    this.svg.elements = result.value
    this.update(this.svg)
  }

  private _startAnimation(): void {
    let start = 0

    const frame: FrameRequestCallback = (timestamp: number) => {
      if (timestamp - start > this.animation.ms) {
        start = timestamp
        this._updateFrame()
      }

      this._stopId = requestAnimationFrame(frame)
    }

    this._stopId = requestAnimationFrame(frame)
  }

  public toElement() {
    return toElement({
      svg: this.svg.toJson(),
      animation: this.animation.toJson(),
    })
  }

  public resize({ width, height }: Parameters<ResizeCallback>[0]): void {
    this.stop()
    this.svg.resize({ width, height })
    this.animation.initialize(this.svg.elements)
    this.start()
  }

  public static init(
    el: HTMLElement,
    { ms, background }: AnimationOption & RendererOption = { ms: 60 }
  ): SvgAnimation {
    const { width, height } = el.getBoundingClientRect()
    return new SvgAnimation(
      new Svg({ width, height }),
      new Animation({ ms }),
      (svg) => new SvgRenderer(el, { background }).update({ svg: svg.toJson() })
    )
  }
}
