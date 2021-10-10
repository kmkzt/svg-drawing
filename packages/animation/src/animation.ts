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
  private _anim: FrameAnimation | null
  private _origin: Svg
  private _frames: number | undefined
  private _repeatCount: string
  constructor(public svg: Svg, { ms }: AnimationOption = { ms: 60 }) {
    this.ms = ms
    this._anim = null
    this._origin = this.generateOrigin()
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
    this._origin = this.generateOrigin()
    this._repeatCount = repeatCount ? `${repeatCount}` : 'indefinite'
    if (ms) this.ms = ms
  }

  public restore(): void {
    this.svg.copy(this._origin)
  }

  public generateFrame(index?: number): Path[] {
    if (!this._anim) return this.svg.paths
    return this._anim(
      this._origin.paths.map((p) => p.clone()),
      index
    )
  }

  public update() {
    this._origin = this.generateOrigin()
  }

  public toElement(): SVGSVGElement {
    const animPathsList: Path[][] = Array(this.frames)
      .fill(null)
      .map((_: any, i: number) => this.generateFrame(i))

    const dur = this.frames * (this.ms > 0 ? this.ms : 1) + 'ms'
    const t = 1 / this.frames
    const keyTimes = `0;${Array(this.frames)
      .fill(undefined)
      .map((_, i) => roundUp((i + 1) * t, 4) + '')
      .join(';')}`

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
        dur,
        keyTimes,
        attributeName,
        repeatCount: this._repeatCount,
        values: [defaultValue, ...animValues].join(';'),
      })
    }

    const animEls = this._origin.paths.map((p) => {
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

    const size = {
      width: String(this.svg.width),
      height: String(this.svg.height),
    }
    const bgEl = this.svg.background
      ? [
          createSvgChildElement('rect', {
            ...size,
            fill: this.svg.background,
          }),
        ]
      : []
    return createSvgElement(
      {
        width: String(this.svg.width),
        height: String(this.svg.height),
      },
      bgEl.concat(animEls)
    )
  }

  /** @returns {number} Default value is total of commands length. */
  private get frames(): number {
    return this._frames && this._frames > 0
      ? this._frames
      : this._origin.paths.reduce((l, p) => l + p.commands.length, 0)
  }

  private generateOrigin(): Svg {
    const svg = this.svg.clone()
    svg.paths.map((p, i) => p.updateAttributes({ id: `t${i}` }))
    return svg
  }
}
