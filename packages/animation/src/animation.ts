import {
  createSvgElement,
  createSvgChildElement,
  pathObjectToElement,
  Path,
  Svg,
  camel2kebab,
  roundUp,
} from '@svg-drawing/core'
import { AnimationOption, FrameAnimation } from './types'

export class Animation {
  public ms: number
  public origin: Svg
  private _anim: FrameAnimation | null
  private _frames: number | undefined
  private _repeatCount: string
  constructor({ ms }: AnimationOption = { ms: 60 }) {
    this.ms = ms
    this._anim = null
    this.origin = this.generateOrigin(new Svg({ width: 0, height: 0 }))
    this._repeatCount = 'indefinite'
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
    }: { frames?: number; repeatCount?: number | string; ms?: number } = {}
  ): void {
    this._anim = fn
    this._frames = frames
    this._repeatCount = repeatCount ? `${repeatCount}` : 'indefinite'
    if (ms) this.ms = ms
  }

  public generateFrame(index?: number): Path[] {
    if (!this._anim) return this.origin.paths

    return this._anim(
      this.origin.paths.map((p) => p.clone()),
      index
    )
  }

  public initialize(svg: Svg) {
    this.origin = this.generateOrigin(svg)
    return this
  }

  public toElement(): SVGSVGElement {
    const animPathsList: Path[][] = [...Array(this.frames)].map(
      (_: any, i: number) => this.generateFrame(i)
    )

    const animateAttrs = {
      repeatCount: this._repeatCount,
      dur: this.frames * (this.ms > 0 ? this.ms : 1) + 'ms',
      keyTimes: [...Array(this.frames)].reduce(
        (acc, _, i) => acc + ';' + roundUp((i + 1) * (1 / this.frames), 4),
        '0'
      ),
    }

    const createAnimationElement = (
      origin: Path,
      attributeName: string,
      defaultValue: string,
      getValue: ({
        origin,
        path,
      }: {
        origin: Path
        path?: Path
      }) => string | undefined
    ): SVGElement | null => {
      const animValues = animPathsList.map((ap) => {
        const path = ap.find((p) => p.attrs.id === origin.attrs.id)
        return getValue({ origin, path }) || defaultValue
      })
      // return null if value is same all.
      if (animValues.every((v) => v === defaultValue)) return null

      return createSvgChildElement('animate', {
        ...animateAttrs,
        attributeName,
        values: [defaultValue, ...animValues].join(';'),
      })
    }

    const animEls = this.origin.paths.map((p) => {
      const pEl = pathObjectToElement(p.toJson())
      const dAnimEl = createAnimationElement(
        p,
        'd',
        p.getCommandString(),
        ({ origin, path }) =>
          path && path.commands.length > 0
            ? path.getCommandString()
            : origin.commands[0].toString()
      )
      if (dAnimEl) pEl.appendChild(dAnimEl)

      // TODO: Check attribute key and value.
      const { id, ...attrs } = p.attrs // exclude id
      Object.entries(attrs).map(
        ([propertyName, val]: [string, string | undefined]) => {
          if (!val) return
          const attrName = camel2kebab(propertyName)
          const aEl = createAnimationElement(
            p,
            attrName,
            val,
            ({ path }) => path?.attrs[propertyName]
          )
          if (aEl) pEl.appendChild(aEl)
        }
      )

      return pEl
    })

    const sizeAttributes = {
      width: String(this.origin.width),
      height: String(this.origin.height),
    }
    const bgEl = this.origin.background
      ? [
          createSvgChildElement('rect', {
            ...sizeAttributes,
            fill: this.origin.background,
          }),
        ]
      : []
    return createSvgElement(sizeAttributes, bgEl.concat(animEls))
  }

  /** @returns {number} Default value is total of commands length. */
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
