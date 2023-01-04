import type { SvgOption, ElementClass, SvgClass, ElementKey } from '../types'

export class Svg implements SvgClass {
  private elementsMap: Map<ElementKey, ElementClass>
  public width: number
  public height: number
  public background?: string

  constructor({ width, height, background }: SvgOption) {
    this.elementsMap = new Map<ElementKey, ElementClass>()
    this.width = width
    this.height = height
    this.background = background
  }

  public get elements() {
    return [...this.elementsMap.values()]
  }

  public resize({ width, height }: { width: number; height: number }) {
    this.scale(width / this.width)
    this.width = width
    this.height = height
  }

  private scale(r: number) {
    if (r !== 1 && isFinite(r) && r !== 0) {
      this.elementsMap.forEach((element) => element.scale(r))
    }
    return this
  }

  public addElement(elements: ElementClass | ReadonlyArray<ElementClass>) {
    ;[elements].flat().map((element) => {
      this.elementsMap.set(element.key, element)
    })

    return this
  }

  public getElement(elementKey: ElementKey): ElementClass | undefined {
    return this.elementsMap.get(elementKey)
  }

  public updateElement(element: ElementClass) {
    this.elementsMap.set(element.key, element)
    return this
  }

  public deleteElement(element: ElementClass) {
    this.elementsMap.delete(element.key)
    return this
  }

  public setElements(elements: ReadonlyArray<ElementClass>) {
    this.elementsMap.clear()

    elements.forEach((element) => this.elementsMap.set(element.key, element))

    return this
  }

  public cloneElements() {
    return this.elements.map((element) => element.clone())
  }

  public toJson() {
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
    this.setElements(svg.cloneElements())
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
    svg.setElements(this.cloneElements())
    return svg
  }
}
