import { Renderer, RendererOption } from './renderer'
import { Path } from './svg'
import { camel2kebab } from './utils/camel2kebab'
import { download } from './utils/download'
import { roundUp } from './utils/roundUp'
export interface AnimationOption extends RendererOption {
  ms: number
}
export type FrameAnimation = (origin: Path[], loopIndex?: number) => Path[]

export class SvgAnimation extends Renderer {
  public ms: number
  private _stopId: number
  private _stop: (() => void) | null
  private _anim: FrameAnimation | null
  private _restorePaths: Path[]
  private _framesNumber: number | undefined

  /**d
   * Releation animate element
   * TODO: add easing option
   */
  private _repeatCount: string
  constructor(
    el: HTMLElement,
    { background, ms }: AnimationOption = { ms: 60 }
  ) {
    super(el, { background })
    this.ms = ms
    this._stop = null
    this._anim = null
    this._restorePaths = []
    this._stopId = 0
    this._repeatCount = 'indefinite'
  }

  /**
   * @param {FramaAnimation} fn
   * @param {{ frame?: number; repeat?: number }} opts
   * `frame` is the number of frames to animate
   * `repeat` is related for rapeatCount of animate element attribute.
   */
  public setAnimation(
    fn: FrameAnimation,
    {
      frames,
      repeatCount,
      ms
    }: { frames?: number; repeatCount?: number | string; ms?: number } = {}
  ): void {
    this._anim = fn
    this._framesNumber = frames
    this._repeatCount = repeatCount ? `${repeatCount}` : 'indefinite'
    if (ms) this.ms = ms
  }

  public stop(): boolean {
    if (this._stop) {
      this._stop()
      return true
    }
    return false
  }

  public restore() {
    this.paths = this._restorePaths
    this.update()
  }

  public generateFrame(index?: number): Path[] {
    if (!this._anim) return this.paths
    return this._anim(
      this._restorePaths.map(p => p.clone()),
      index
    )
  }

  public start(): void {
    // If do not this first, this cannot get the number of frames well.
    this.stop()
    this._registerRestorePaths()

    let index = 0
    let start: number | undefined
    const ms = this.ms
    const loopCount: number = this._getFramesNumber()
    const frame: FrameRequestCallback = timestamp => {
      if (ms !== this.ms) {
        this.restore()
        this.start()
        return
      }
      if (!start || timestamp - start > ms) {
        start = timestamp
        this.paths = this.generateFrame(index)
        this.update()
        index = index > loopCount ? 0 : index + 1
      }
      this._stopId = requestAnimationFrame(frame)
    }
    this._stopId = requestAnimationFrame(frame)
    this._stop = () => {
      cancelAnimationFrame(this._stopId)
      this._stop = null
    }
  }

  public toAnimationElement(): SVGSVGElement {
    // If the animation is stopped, read the currently displayed Svg data.
    // If stopped in the middle, SVG in that state is displayed
    if (!this._stop) {
      this._registerRestorePaths()
    }

    const loopNumber = this._getFramesNumber()
    const animPathsList: Path[][] = Array(loopNumber)
      .fill(null)
      .map((_: any, i: number) => this.generateFrame(i))

    const dur = loopNumber * (this.ms > 0 ? this.ms : 1) + 'ms'
    const t = 1 / loopNumber
    const keyTimes = `0;${Array(loopNumber)
      .fill(undefined)
      .map((_, i) => roundUp((i + 1) * t, 4) + '')
      .join(';')}`

    const createAnimationElement = (
      origin: Path,
      attrName: string,
      defaultValue: string,
      getValue: ({
        origin,
        path
      }: {
        origin: Path
        path?: Path
      }) => string | undefined
    ): SVGElement | null => {
      const animValues = animPathsList.map(ap => {
        const path = ap.find(p => p.attrs.id === origin.attrs.id)
        return getValue({ origin, path }) || defaultValue
      })
      // return null if value is same all.
      if (animValues.every(v => v === defaultValue)) return null

      const values = [defaultValue, ...animValues]
      const aEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      )
      aEl.setAttribute('repeatCount', this._repeatCount)
      aEl.setAttribute('dur', dur)
      aEl.setAttribute('keyTimes', keyTimes)
      aEl.setAttribute('attributeName', attrName)
      aEl.setAttribute('values', values.join(';'))
      return aEl
    }
    const animPaths = this._restorePaths.map(p => {
      const pEl = p.toElement()
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

      Object.entries({
        fill: 'fill',
        stroke: 'stroke',
        strokeWidth: 'stroke-width'
      }).map(([propertyName, attrName]) => {
        const aEl = createAnimationElement(
          p,
          attrName,
          p[propertyName],
          ({ path }) => (path ? path[propertyName] : undefined)
        )
        if (aEl) pEl.appendChild(aEl)
      })

      // TODO: Validate attrs
      // exclude id
      const { id, ...attrs } = p.attrs
      Object.keys(attrs).map((propertyName: string) => {
        const attrName = camel2kebab(propertyName)
        const aEl = createAnimationElement(
          p,
          attrName,
          p.attrs[propertyName],
          ({ path }) => path?.attrs[propertyName]
        )
        if (aEl) pEl.appendChild(aEl)
      })

      return pEl
    })
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttributeNS(null, 'version', '1.1')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    svg.setAttribute('width', String(this.width))
    svg.setAttribute('height', String(this.height))
    animPaths.map(el => svg.appendChild(el))
    return svg
  }

  /**
   * @param filename
   * TODO: Support gif and apng
   */
  public downloadAnimation(filename?: string) {
    download({
      data: `data:image/svg+xml;base64,${btoa(
        this.toAnimationElement().outerHTML
      )}`,
      extension: 'svg',
      filename
    })
  }

  /**
   * @return {number}
   * Default value is total of commands length.
   */
  private _getFramesNumber(): number {
    return this._framesNumber && this._framesNumber > 0
      ? this._framesNumber
      : this._restorePaths.reduce((l, p) => l + p.commands.length, 0)
  }

  private _registerRestorePaths() {
    this._restorePaths = this.clonePaths().map((p, i) => {
      p.attrs.id = `t${i}`
      return p
    })
  }
}
