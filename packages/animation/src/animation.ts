import {
  Renderer,
  RendererOption,
  Path,
  camel2kebab,
  download,
  roundUp,
  svg2base64,
  createSvgElement,
  createSvgChildElement,
  Svg,
} from '@svg-drawing/core'

export type AnimationOption = RendererOption & {
  ms: number
}
export type FrameAnimation = (origin: Path[], loopIndex?: number) => Path[]

export class SvgAnimation {
  /**
   * Options
   */
  public ms: number
  /**
   * Private prorperty
   */
  private _stopId: number
  private _stop: (() => void) | null
  private _anim: FrameAnimation | null
  private _restorePaths: Path[]
  private _framesNumber: number | undefined
  /**
   * Modules
   */
  public svg: Svg
  public renderer: Renderer
  /**d
   * Releation animate element
   * TODO: add easing option
   */
  private _repeatCount: string
  constructor(
    el: HTMLElement,
    { background, ms }: AnimationOption = { ms: 60 }
  ) {
    const { width, height } = el.getBoundingClientRect()
    this.svg = new Svg({ width, height, background })
    this.renderer = new Renderer(el, { background })
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
      ms,
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

  public restore(): void {
    this.svg.paths = this._restorePaths
    this.renderer.update(this.svg.toJson())
  }

  public generateFrame(index?: number): Path[] {
    if (!this._anim) return this.svg.paths
    return this._anim(
      this._restorePaths.map((p) => p.clone()),
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
    const frame: FrameRequestCallback = (timestamp) => {
      if (ms !== this.ms) {
        this.restore()
        this.start()
        return
      }
      if (!start || timestamp - start > ms) {
        start = timestamp
        this.svg.paths = this.generateFrame(index)
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

  public update() {
    this.renderer.update(this.svg.toJson())
  }

  public toElement(): SVGSVGElement {
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
    const animEls = this._restorePaths.map((p) => {
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

  /**
   * @param filename
   * TODO: Support gif and apng
   */
  public download(filename?: string): void {
    download({
      data: svg2base64(this.toElement().outerHTML),
      extension: 'svg',
      filename,
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
    this._restorePaths = this.svg.clonePaths().map((p, i) => {
      p.attrs.id = `t${i}`
      return p
    })
  }
}
