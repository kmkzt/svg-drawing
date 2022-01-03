import type { SvgOption, PathClass, SvgClass } from '../types'

export class Svg implements SvgClass {
  public paths: PathClass[]
  public width: number
  public height: number
  public background?: string

  constructor({ width, height, background }: SvgOption) {
    this.paths = []
    this.width = width
    this.height = height
    this.background = background
  }

  /** @todo Check height */
  public resize({ width, height }: { width: number; height: number }) {
    this.scale(width / this.width)
    this.width = width
    this.height = height
  }

  private scale(r: number) {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scale(r)
      }
    }
    return this
  }

  public addPath(pa: PathClass | PathClass[]) {
    if (Array.isArray(pa)) {
      this.paths.push(...pa)
    } else {
      this.paths.push(pa)
    }
    return this
  }

  public deletePath(deletePath: PathClass) {
    this.paths = this.paths.filter((path) => path.key !== deletePath.key)
    return this
  }

  public clonePaths() {
    return this.paths.map((p) => p.clone())
  }

  public toJson() {
    return {
      width: this.width,
      height: this.height,
      background: this.background,
      paths: this.paths.map((p) => p.toJson()),
    }
  }

  /**
   * Copy resized paths.
   *
   * @example
   *   const drawSvg = new Svg()
   *   const animateSvg = new Svg().copy(drawSvg)
   */
  public copy(svg: SvgClass) {
    this.paths = svg.clonePaths()
    if (svg.width && this.width) {
      this.scale(this.width / svg.width)
    }
    return this
  }

  public clone() {
    const svg = new Svg({
      width: this.width,
      height: this.height,
      background: this.background,
    })
    svg.addPath(this.clonePaths())
    return svg
  }
}
