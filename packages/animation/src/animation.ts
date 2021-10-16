import { Path, roundUp, camel2kebab } from '@svg-drawing/core'
import {
  AnimationOption,
  FrameAnimation,
  AnimateObject,
  AnimateAttribute,
} from './types'

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
  public paths: Path[]
  public generator?: Generator<Path[], void, unknown>
  private _frames?: number
  private _repeatCount?: number
  private _anim?: FrameAnimation
  constructor({ ms }: AnimationOption = { ms: 60 }) {
    this.ms = ms
    this.paths = []
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
    const paths = this.paths.map((p) => p.clone())

    return this._anim ? this._anim(paths, frame) : paths
  }

  public restorePaths() {
    return this.paths.map((p) => p.clone())
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

  public initialize(paths: Path[]) {
    this.paths = this.generateOriginPaths(paths)
    return this
  }

  public toJson(): AnimateObject {
    const frameLoop = Array(this.frames).fill(null)

    const animPathsList: Path[][] = frameLoop.map((_: any, i: number) =>
      this.getFramePaths(i)
    )

    const frameAttrs = {
      repeatCount: `${this._repeatCount || `indefinite`}`,
      dur: this.frames * (this.ms > 0 ? this.ms : 1) + 'ms',
      keyTimes: frameLoop.reduce(
        (acc: string, _, i) =>
          acc + ';' + roundUp((i + 1) * (1 / this.frames), 4),
        '0'
      ),
    }

    return this.paths.reduce((acc: AnimateObject, basePath) => {
      const basePathJson = basePath.toJson()
      if (!basePathJson.id) return acc

      const animPaths = animPathsList.map((ap) =>
        ap.find((p) => p.attrs.id === basePath.attrs.id)
      )

      // TODO: Check attribute key and value.
      const { id, ...attrs } = basePathJson
      const animateAttributes: AnimateAttribute[] = Object.keys(attrs)
        .sort()
        .reduce((attr: AnimateAttribute[], attributeName: string) => {
          const defaultValue = attrs[attributeName]
          if (!defaultValue) return attr

          const values =
            attributeName === 'd'
              ? createAnimateCommandValues(animPaths, basePath)
              : createAnimateAttributeValues(
                  animPaths,
                  attributeName,
                  defaultValue
                )
          if (values.every((v) => v === defaultValue)) return attr

          return [
            ...attr,
            {
              ...frameAttrs,
              attributeName: camel2kebab(attributeName),
              values: [...values, defaultValue].join(';'),
            },
          ]
        }, [])

      return {
        ...acc,
        [id]: animateAttributes,
      }
    }, {})
  }

  /**
   * @deprecated
   * @returns {number} Default value is total of commands length.
   */
  public get frames(): number {
    return this._frames && this._frames > 0
      ? this._frames
      : this.paths.reduce((l, p) => l + p.commands.length, 0)
  }

  private generateOriginPaths(paths: Path[]) {
    return paths.map((p, i) => {
      p.updateAttributes({ id: `t${i}` })

      return p.clone()
    })
  }
}
