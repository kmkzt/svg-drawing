import { Renderer, SvgPath, Point } from './renderer'
export interface AnimationOption {
  shakingRange?: number
}

export class SvgAnimation extends Renderer {
  public shakingRange: number
  private el: HTMLElement
  private stopShaking: (() => void) | null
  constructor(el: HTMLElement, { shakingRange }: AnimationOption) {
    const { width, height } = el.getBoundingClientRect()
    super({ width, height })
    this.el = el
    this.shakingRange = shakingRange ?? 2
    this.stopShaking = null
    this.updateRender()
  }

  /**
   * render
   * TODO: improve render
   */
  public updateRender() {
    this.el.innerHTML = this.toElement().outerHTML
  }
  /**
   * Shaking Drawing line
   */
  public shaking(): void {
    if (this.stopShaking) {
      this.stopShaking()
      return
    }
    const randomShaking = (): number =>
      Math.random() * this.shakingRange - this.shakingRange / 2
    const restorePath = this.paths.map(p => p.clone())
    const updateShake = () => {
      for (let i = 0; i < restorePath.length; i += 1) {
        const updatePoints = restorePath[i].points.map((v: Point) => {
          const rp = new Point(randomShaking(), randomShaking())
          return v.add(rp)
        })
        this.paths[i].points = updatePoints
        this.paths[i].formatCommand()
      }
      this.updateRender()
    }
    // DEBUG
    // updateShake()
    // return () => void 0

    const sceneChildrenRestore = () => {
      this.replacePath(restorePath)
      this.updateRender()
    }
    const stopId = setInterval(updateShake, 500)
    this.stopShaking = () => {
      clearInterval(stopId)
      sceneChildrenRestore()
      this.stopShaking = null
    }
  }
}
