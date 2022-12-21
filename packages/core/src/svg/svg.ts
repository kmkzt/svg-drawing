import type { SvgOption, ElementClass, SvgClass, SvgObject } from '../types'

export class Svg implements SvgClass {
  public elements: ElementClass[]
  public width: number
  public height: number
  public background?: string

  constructor({ width, height, background }: SvgOption) {
    this.elements = []
    this.width = width
    this.height = height
    this.background = background
  }

  public resize({ width, height }: { width: number; height: number }) {
    this.scale(width / this.width)
    this.width = width
    this.height = height
  }

  private scale(r: number) {
    if (r !== 1 && isFinite(r) && r !== 0) {
      for (let i = 0; i < this.elements.length; i += 1) {
        this.elements[i].scale(r)
      }
    }
    return this
  }

  public addElement(pa: ElementClass | ElementClass[]) {
    if (Array.isArray(pa)) {
      this.elements.push(...pa)
    } else {
      this.elements.push(pa)
    }
    return this
  }

  public getElement(key: string): ElementClass | undefined {
    return this.elements.find((p) => p.key === key)
  }

  public updateElement(path: ElementClass) {
    const index = this.elements.findIndex((p) => p.key === path.key)
    if (index !== -1) {
      this.elements[index] = path
    }
    return this
  }

  public deleteElement(element: ElementClass) {
    this.elements = this.elements.filter((path) => path.key !== element.key)
    return this
  }

  public cloneElements() {
    return this.elements.map((p) => p.clone())
  }

  public toJson(): SvgObject {
    return {
      width: this.width,
      height: this.height,
      background: this.background,
      elements: this.elements.map((p) => p.toJson()),
    }
  }

  /**
   * Copy resized paths.
   *
   * @example
   *
   * ```ts
   * const drawSvg = new Svg()
   * const animateSvg = new Svg().copy(drawSvg)
   * ```
   */
  public copy(svg: SvgClass) {
    this.elements = svg.cloneElements()
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
    svg.addElement(this.cloneElements())
    return svg
  }
}
