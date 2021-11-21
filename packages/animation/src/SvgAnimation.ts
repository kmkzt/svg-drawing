import {
  Renderer,
  Svg,
  downloadBlob,
  svg2base64,
  RendererOption,
  ResizeCallback,
  createSvgChildElement,
  createSvgElement,
  pathObjectToElement,
} from '@svg-drawing/core'
import { Animation } from './animation'
import { AnimationOption } from './types'

export class SvgAnimation {
  private _stopId?: number
  constructor(
    public svg: Svg,
    public animation: Animation,
    private update: (svg: Svg) => void
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
    const sizeAttributes = {
      width: String(this.svg.width),
      height: String(this.svg.height),
    }

    const animationJson = this.animation.toJson()

    const pathEls = this.animation.paths.map((path) => {
      const { attributes } = path.toJson()
      const pathEl = pathObjectToElement(attributes)

      if (attributes.id) {
        animationJson?.[attributes.id]?.map(({ type, attributes }) => {
          pathEl.appendChild(createSvgChildElement(type, attributes))
        })
      }

      return pathEl
    })

    const childEls: SVGElement[] = this.svg.background
      ? [
          createSvgChildElement('rect', {
            ...sizeAttributes,
            fill: this.svg.background,
          }),
          ...pathEls,
        ]
      : pathEls

    return createSvgElement(sizeAttributes, childEls)
  }

  public resize({ width, height }: Parameters<ResizeCallback>[0]): void {
    this.stop()
    this.svg.resize({ width, height })
    this.animation.initialize(this.svg.paths)
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
