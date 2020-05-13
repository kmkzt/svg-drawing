import { Renderer, RendererOption, Path, Point } from './renderer'
export interface AnimationOption extends RendererOption {
  shakingRange?: number
}

export class SvgAnimation extends Renderer {
  public shakingRange: number
  private stopShaking: (() => void) | null
  constructor(el: HTMLElement, { background, shakingRange }: AnimationOption) {
    super(el, { background })
    this.shakingRange = shakingRange ?? 2
    this.stopShaking = null
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
      this.update()
    }
    // DEBUG
    // updateShake()
    // return () => void 0

    const sceneChildrenRestore = () => {
      this.replacePath(restorePath)
      this.update()
    }
    const stopId = setInterval(updateShake, 500)
    this.stopShaking = () => {
      clearInterval(stopId)
      sceneChildrenRestore()
      this.stopShaking = null
    }
  }
}
