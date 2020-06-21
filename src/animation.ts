import { Renderer, RendererOption } from './renderer'
import { Path } from './svg'
import { camel2kebab } from './utils/camel2kebab'
import { download } from './utils/download'
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
  }

  public setAnimation(fn: FrameAnimation): void {
    this._anim = fn
  }

  public stop(): boolean {
    if (this._stop) {
      this._stop()
      return true
    }
    return false
  }

  public restore() {
    this.replacePaths(this._restorePaths)
    this.update()
  }

  public generateFrame(index?: number): Path[] {
    if (!this._anim) return this.paths
    return this._anim(
      this._restorePaths.map(p => p.clone()),
      index
    )
  }

  public totalCommandsLength(): number {
    return this._restorePaths.reduce((l, p) => l + p.commands.length, 0)
  }

  public start(count?: number): void {
    let index = 0
    let start: number | undefined
    const ms = this.ms
    const loopCount: number = count || this.totalCommandsLength()

    this.stop()
    this._registerPaths()
    const frame: FrameRequestCallback = timestamp => {
      if (ms !== this.ms) {
        this.restore()
        this.start()
        return
      }
      if (!start || timestamp - start > ms) {
        start = timestamp
        this.replacePaths(this.generateFrame(index))
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
      this._registerPaths()
    }

    const loopNumber = this.totalCommandsLength()
    const animPathsList: Path[][] = Array(loopNumber)
      .fill(null)
      .map((_: any, i: number) => this.generateFrame(i))

    const dur = loopNumber * this.ms + 'ms'
    const t = 1 / loopNumber
    const keyTimes = `0;${Array(loopNumber)
      .fill(undefined)
      .map((_, i) => (i + 1) * t + '')
      .join(';')}`

    const createAnimationElement = (
      origin: Path,
      attrName: string,
      defaultValue: string,
      getValue: (origin: Path, path?: Path) => string | undefined
    ): SVGElement | null => {
      const animValues = animPathsList.map(ap => {
        const path = ap.find(p => p.attrs.id === origin.attrs.id)
        return getValue(origin, path) || defaultValue
      })
      // return null if value is same all.
      if (animValues.every(v => v === defaultValue)) return null

      const values = [defaultValue, ...animValues]
      const aEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      )
      aEl.setAttribute('repeatCount', 'indefinite')
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
        (origin: Path, path?: Path) =>
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
          (origin, path) => (path ? path[propertyName] : undefined)
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
          (origin, path) => path?.attrs[propertyName]
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

  public downloadAnimation(filename?: string) {
    download({
      data: `data:image/svg+xml;base64,${btoa(
        this.toAnimationElement().outerHTML
      )}`,
      extension: 'svg',
      filename
    })
  }

  private _registerPaths() {
    this._restorePaths = this.clonePaths().map((p, i) => {
      p.attrs.id = `t${i}`
      return p
    })
  }
}
