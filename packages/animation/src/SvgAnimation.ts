import {
  Renderer,
  Svg,
  downloadBlob,
  svg2base64,
  RendererOption,
  ResizeCallback,
} from '@svg-drawing/core'
import { Animation } from './animation'
import { AnimationOption } from './types'

export class SvgAnimation {
  private _stopId: number
  private _stopAnimation: (() => void) | null
  constructor(
    public svg: Svg,
    public animation: Animation,
    private update: (svg: Svg) => void
  ) {
    this._stopAnimation = null
    this._stopId = 0
    this.resize = this.resize.bind(this)
  }

  public stop(): boolean {
    if (this._stopAnimation) {
      this._stopAnimation()
      this.restore()
      return true
    }
    return false
  }

  public restore(): void {
    this.svg.copy(this.animation.origin)
    this.update(this.svg)
  }

  public start(): void {
    // If do not this first, this cannot get the number of frames well.
    this.stop()
    this.animation.initialize(this.svg)
    this._startAnimation()
  }

  private _startAnimation(): void {
    let index = 0
    let start: number | undefined
    const loopCount: number = this.animation.frames
    const frame: FrameRequestCallback = (timestamp) => {
      if (!start || timestamp - start > this.animation.ms) {
        start = timestamp
        this.svg.paths = this.animation.generateFrame(index)
        this.update(this.svg)
        index = index > loopCount ? 0 : index + 1
      }
      this._stopId = requestAnimationFrame(frame)
    }
    this._stopId = requestAnimationFrame(frame)
    this._stopAnimation = () => {
      cancelAnimationFrame(this._stopId)
      this._stopAnimation = null
    }
  }

  /**
   * @param filename
   * @todo Support gif and apng
   */
  public download(filename?: string): void {
    downloadBlob({
      data: svg2base64(this.animation.toElement().outerHTML),
      extension: 'svg',
      filename,
    })
  }

  public resize({ width, height }: Parameters<ResizeCallback>[0]): void {
    this.stop()
    this.svg.resize({ width, height })
    this.animation.initialize(this.svg)
    this.start()
  }

  /** @todo Improve resize handler */
  public static init(
    el: HTMLElement,
    { ms, background }: AnimationOption & RendererOption = { ms: 60 }
  ): SvgAnimation {
    const { width, height } = el.getBoundingClientRect()
    return new SvgAnimation(
      new Svg({ width, height }),
      new Animation({ ms }),
      new Renderer(el, { background }).update
    )
  }
}
