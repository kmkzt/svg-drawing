import {
  createSvgElement,
  createSvgChildElement,
  pathObjectToElement,
  Path,
  Svg,
  roundUp,
  camel2kebab,
} from '@svg-drawing/core'
import { AnimationOption, FrameAnimation } from './types'

const createAnimateAttributeValues = (
  animationPaths: (Path | undefined)[],
  attributeName: string,
  defaultValue: string
): string[] =>
  animationPaths.map((p) => p?.attrs[attributeName] || defaultValue)

const createAnimateCommandValues = (
  animationPaths: (Path | undefined)[],
  originPath: Path
): string[] =>
  animationPaths.map(
    (p) => p?.getCommandString() || originPath.commands[0].toString()
  )

export class Animation {
  public ms: number
  public origin: Svg
  public generator?: Generator<Path[], void, unknown>
  private _frames?: number
  private _repeatCount?: number
  private _anim?: FrameAnimation
  constructor({ ms }: AnimationOption = { ms: 60 }) {
    this.ms = ms
    this.origin = this.generateOrigin(new Svg({ width: 0, height: 0 }))
  }

  /**
   * `frame` is the number of frames to animate `repeat` is related for
   * repeatCount of animate element attribute.
   *
   * @param {FramaAnimation} fn
   * @param {{ frame?: number; repeat?: number }} opts
   */
  public setAnimation(
    fn: FrameAnimation,
    {
      frames,
      repeatCount,
      ms,
    }: { frames?: number; repeatCount?: number; ms?: number } = {}
  ): void {
    this._anim = fn
    this._frames = frames
    this._repeatCount = repeatCount || undefined
    if (ms) this.ms = ms

    this.generator = this.setupGenerator()
  }

  public getFramePaths(frame: number): Path[] {
    return this._anim
      ? this._anim(this.origin.clonePaths(), frame)
      : this.origin.clonePaths()
  }

  private *setupGenerator() {
    let frame = 0
    let repeatCount = 0
    while (!this._repeatCount || repeatCount < this._repeatCount) {
      if (frame > this.frames) {
        repeatCount += 1
        frame = 0
      } else {
        frame += 1
      }

      yield this.getFramePaths(frame)
    }
  }

  public initialize(svg: Svg) {
    this.origin = this.generateOrigin(svg)
    return this
  }

  public toElement(): SVGSVGElement {
    const frameLoop = Array(this.frames).fill(null)

    const animPathsList: Path[][] = frameLoop.map((_: any, i: number) =>
      this.getFramePaths(i)
    )

    const animateAttrs = {
      repeatCount: `${this._repeatCount || `indefinite`}`,
      dur: this.frames * (this.ms > 0 ? this.ms : 1) + 'ms',
      keyTimes: frameLoop.reduce(
        (acc, _, i) => acc + ';' + roundUp((i + 1) * (1 / this.frames), 4),
        '0'
      ),
    }

    const animEls = this.origin.paths.map((basePath) => {
      const basePathJson = basePath.toJson()
      const baseEl = pathObjectToElement(basePathJson)
      if (!basePathJson.id) return baseEl

      const animPaths = animPathsList.map((ap) =>
        ap.find((p) => p.attrs.id === basePath.attrs.id)
      )

      // TODO: Check attribute key and value.
      const { id, ...attrs } = basePathJson
      Object.keys(attrs)
        .sort()
        .map((attributeName: string) => {
          const defaultValue = attrs[attributeName]
          if (!defaultValue) return

          const animateValues =
            attributeName === 'd'
              ? createAnimateCommandValues(animPaths, basePath)
              : createAnimateAttributeValues(
                  animPaths,
                  camel2kebab(attributeName),
                  defaultValue
                )
          if (animateValues.every((v) => v === defaultValue)) return null

          baseEl.appendChild(
            createSvgChildElement('animate', {
              ...animateAttrs,
              attributeName: camel2kebab(attributeName),
              values: [...animateValues, defaultValue].join(';'),
            })
          )
        })

      return baseEl
    })

    const sizeAttributes = {
      width: String(this.origin.width),
      height: String(this.origin.height),
    }
    const bgEl: SVGElement[] = this.origin.background
      ? [
          createSvgChildElement('rect', {
            ...sizeAttributes,
            fill: this.origin.background,
          }),
        ]
      : []
    return createSvgElement(sizeAttributes, bgEl.concat(animEls))
  }

  /**
   * @deprecated
   * @returns {number} Default value is total of commands length.
   */
  public get frames(): number {
    return this._frames && this._frames > 0
      ? this._frames
      : this.origin.paths.reduce((l, p) => l + p.commands.length, 0)
  }

  private generateOrigin(svg: Svg) {
    const origin = svg.clone()
    origin.paths.map((p, i) => p.updateAttributes({ id: `t${i}` }))
    return origin
  }
}
