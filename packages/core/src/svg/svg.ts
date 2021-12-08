import type { SvgObject, SvgOption } from '../types'
import type { Path } from './path'

export class Svg {
  public paths: Path[]
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

  public scale(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scale(r)
      }
    }
    return this
  }

  public scaleX(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scaleX(r)
      }
    }
    return this
  }

  public scaleY(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scaleY(r)
      }
    }
    return this
  }

  public addPath(pa: Path | Path[]): this {
    if (Array.isArray(pa)) {
      this.paths.push(...pa)
    } else {
      this.paths.push(pa)
    }
    return this
  }

  public deletePath(deletePath: Path): this {
    this.paths = this.paths.filter((path) => path.key !== deletePath.key)
    return this
  }

  public clonePaths(): Path[] {
    return this.paths.map((p) => p.clone())
  }

  public toJson(): SvgObject {
    return {
      width: this.width,
      height: this.height,
      background: this.background,
      paths: this.paths.map((p) => p.toJson()),
    }
  }

  public copy(svg: any extends Svg ? Svg : never): this {
    this.paths = svg.clonePaths()
    if (svg.width && this.width) {
      this.scale(this.width / svg.width)
    }
    return this
  }

  public clone(): Svg {
    const svg = new Svg({
      width: this.width,
      height: this.height,
      background: this.background,
    })
    svg.addPath(this.clonePaths())
    return svg
  }
}
