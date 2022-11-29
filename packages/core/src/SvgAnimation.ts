import { Animation } from './animation/animation'
import {
  SvgRenderer,
  createSvgElement,
  svgElement,
  pathElement,
} from './renderer/svgRenderer'
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
    this.svg.paths = this.animation.restorePaths()
    this.update(this.svg)
  }

  public start(): void {
    // If do not this first, this cannot get the number of frames well.
    this.stop()

    this._setupAnimation()
    this._startAnimation()
  }

  private _setupAnimation() {
    this.animation.initialize(this.svg.paths)
  }

  private _updateFrame() {
    if (!this.animation.generator) return

    const result = this.animation.generator.next()
    if (result.done) {
      this.stop()
      return
    }

    this.svg.paths = result.value
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
    const animation = this.animation.toJson()

    const pathEls = this.animation.paths.map((path) => {
      const { key, attributes } = path.toJson()
      const animateAttrs = animation.find(
        (animate) => animate.key === key
      )?.animates

      const pathEl = pathElement(attributes, animateAttrs)

      return pathEl
    })

    return svgElement(
      {
        width: this.svg.width,
        height: this.svg.height,
        background: this.svg.background,
      },
      pathEls
    )
  }

  public resize({ width, height }: Parameters<ResizeCallback>[0]): void {
    this.stop()
    this.svg.resize({ width, height })
    this.animation.initialize(this.svg.paths)
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
