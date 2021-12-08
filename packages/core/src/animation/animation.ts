import { roundUp, camel2kebab } from '../utils'
import type { Path } from '../svg'
import type {
  AnimationOption,
  FrameAnimation,
  AnimateAttribute,
  AnimationObject,
} from '../types'

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
  private _frame: FrameAnimation | null = null
  private _repeatCount?: number
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
  public setup(
    frame: FrameAnimation,
    { repeatCount, ms }: { repeatCount?: number; ms?: number } = {}
  ): void {
    this._frame = frame

    this._repeatCount = repeatCount || undefined
    if (ms) this.ms = ms

    this.generator = this.setupGenerator()
  }

  public getFramePaths(key: number): Path[] {
    const paths = this.paths.map((p) => p.clone())

    if (!paths.length || !this._frame) return paths

    return this._frame.animation(paths, key)
  }

  public restorePaths() {
    return this.paths.map((p) => p.clone())
  }

  private *setupGenerator() {
    let loopId = 0
    let repeatCount = 0
    if (!this._frame) return

    while (!this._repeatCount || repeatCount < this._repeatCount) {
      if (loopId > this._frame.loops) {
        repeatCount += 1
        loopId = 0
      } else {
        loopId += 1
      }

      yield this.getFramePaths(loopId)
    }
  }

  public initialize(paths: Path[]) {
    this.paths = paths.map((p) => p.clone())
    this.generator = this.setupGenerator()
    return this
  }

  public toJson(): AnimationObject {
    if (!this._frame) return {}

    const loop = this._frame.loops
    const frameLoop = Array(this._frame.loops).fill(null)

    const animPathsList: Path[][] = frameLoop.map((_: any, i: number) =>
      this.getFramePaths(i)
    )

    const baseAttrs = {
      repeatCount: `${this._repeatCount || `indefinite`}`,
      dur: loop * (this.ms > 0 ? this.ms : 1) + 'ms',
      keyTimes: frameLoop.reduce(
        (acc: string, _, i) => acc + ';' + roundUp((i + 1) * (1 / loop), 4),
        '0'
      ),
    }

    return this.paths.reduce((acc: AnimationObject, basePath) => {
      const { key, attributes } = basePath.toJson()

      const animPaths = animPathsList.map((ap) =>
        ap.find((p) => p.key === basePath.key)
      )

      // TODO: Check attribute key and value.
      const animateAttributesList: AnimateAttribute[] = Object.keys(attributes)
        .sort()
        .reduce((animateAttrs: AnimateAttribute[], attributeName: string) => {
          const defaultValue = attributes[attributeName]
          if (!defaultValue) return animateAttrs

          const values =
            attributeName === 'd'
              ? createAnimateCommandValues(animPaths, basePath)
              : createAnimateAttributeValues(
                  animPaths,
                  attributeName,
                  defaultValue
                )
          if (values.every((v) => v === defaultValue)) return animateAttrs

          return [
            ...animateAttrs,
            {
              ...baseAttrs,
              attributeName: camel2kebab(attributeName),
              values: [...values, defaultValue].join(';'),
            },
          ]
        }, [])

      return {
        ...acc,
        [key]: animateAttributesList.map((animateAttributes) => ({
          type: 'animate',
          attributes: animateAttributes,
        })),
      }
    }, {})
  }
}
