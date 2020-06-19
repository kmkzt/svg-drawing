import { Renderer, RendererOption } from './renderer'
import { Path } from './svg'
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

  public toAnimationSvgXML() {
    this._registerPaths()
    if (!this._restorePaths) return
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
    const animPaths = this._restorePaths.map(p => {
      const aEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'animate'
      )
      aEl.setAttribute('attributeName', 'd')
      aEl.setAttribute('repeatCount', 'indefinite')
      aEl.setAttribute('dur', dur)
      aEl.setAttribute('keyTimes', keyTimes)

      const dList = animPathsList.map(animPaths => {
        const path = animPaths.find(ap => ap.attrs.id === p.attrs.id)
        return path && path.commands.length > 0
          ? path.getCommandString()
          : p.commands[0].toString()
      })

      aEl.setAttribute(
        'values',
        [p.commands[0].toString(), ...dList, p.getCommandString()].join(';')
      )

      const pEl = p.toElement()
      pEl.appendChild(aEl)
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
