import { Renderer, RendererOption } from './renderer'
import { Path } from './svg'
import { camel2kebab } from './utils/camel2kebab'
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

  public stop() {
    if (this._stop) {
      this._stop()
    }
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

  public get totalCommandsLength(): number {
    return this.paths.reduce((l, p) => l + p.commands.length, 0)
  }

  public start(count?: number): void {
    const loopCount: number = count || this.totalCommandsLength
    let index = 0
    this.stop()
    const ms = this.ms
    this._registerPaths()
    let start: number | undefined
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

  public toAnimationSvgXML(): null | SVGSVGElement {
    this._registerPaths()
    if (!this._restorePaths) return null
    const animPathsList: Path[][] = []
    for (let i = 0; i < this.totalCommandsLength; i += 1) {
      animPathsList.push(this.generateFrame(i))
    }
    const dur = this.totalCommandsLength * this.ms + 'ms'
    const t = 1 / this.totalCommandsLength
    const keyTimes = `0;${Array(this.totalCommandsLength)
      .fill(undefined)
      .map((_, i) => i * t + '')
      .join(';')};1`

    const createAnimationElement = (
      origin: Path,
      attrName: string,
      defaultValue: string,
      getValue: (origin: Path, path?: Path) => string
    ): SVGElement | null => {
      const animValues = animPathsList.map(ap => {
        const path = ap.find(p => p.attrs.id === origin.attrs.id)
        return getValue(origin, path)
      })
      // return null if value is same all.
      if (animValues.every(v => v === animValues[0])) return null

      const values = [defaultValue, ...animValues, defaultValue]
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
          p[attrName],
          (origin, path) => (path ? path[propertyName] : origin[propertyName])
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
          (origin, path) =>
            path ? path.attrs[propertyName] : origin[propertyName]
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

  private _registerPaths() {
    this._restorePaths = this.clonePaths().map((p, i) => {
      p.attrs.id = `t${i}`
      return p
    })
  }
}
