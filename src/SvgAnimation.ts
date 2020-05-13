import { Renderer, SvgPath, Point } from './renderer'
export interface AnimationOption {
  shakingRange?: number
}

export class SvgAnimation {
  public shakingRange: number
  private el: HTMLElement
  public renderer: Renderer
  constructor(el: HTMLElement, { shakingRange }: AnimationOption) {
    this.el = el
    this.shakingRange = shakingRange ?? 2
    const { width, height } = el.getBoundingClientRect()
    this.renderer = new Renderer({ width, height })
    this.updateRender()
  }

  /**
   * render
   * TODO: improve render
   */
  public updateRender() {
    this.el.innerHTML = this.renderer.toElement().outerHTML
  }
  /**
   * Shaking Drawing line
   */
  public shaking(): () => void {
    const randomShaking = (): number =>
      Math.random() * this.shakingRange - this.shakingRange / 2
    const restorePath = this.renderer.paths.concat()
    const updateShake = () => {
      for (let i = 0; i < restorePath.length; i += 1) {
        const updatePoints = restorePath[i].points.map((v: Point) => {
          const rp = new Point(randomShaking(), randomShaking())
          return v.add(rp)
        })
        this.renderer.paths[i].points = updatePoints
        this.renderer.paths[i].formatCommand()
      }
      this.updateRender()
    }
    // DEBUG
    // updateShake()
    // return () => void 0

    const sceneChildrenRestore = () => {
      this.renderer.replacePath(restorePath)
      this.updateRender()
    }
    const stopId = setInterval(updateShake, 500)
    return () => {
      clearInterval(stopId)
      sceneChildrenRestore()
    }
  }
}
