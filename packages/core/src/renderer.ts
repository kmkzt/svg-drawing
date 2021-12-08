import { Svg } from './svg'
import { camel2kebab } from './utils'
import type { PathAttributes, RendererOption, SvgObject } from './types'

const VERSION = '1.1'
const SVG_NS = 'http://www.w3.org/2000/svg'
const SVG_XLINK = 'http://www.w3.org/1999/xlink'
interface Attrs {
  [key: string]: string
}

export const createSvgElement = (
  attrs: Attrs,
  childs: SVGElement[]
): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttributeNS(null, 'version', VERSION)
  svg.setAttribute('xmlns', SVG_NS)
  svg.setAttribute('xmlns:xlink', SVG_XLINK)
  Object.keys(attrs)
    .sort()
    .map((key: string) => {
      svg.setAttribute(key, attrs[key])
    })
  childs.map((el: SVGElement) => {
    svg.appendChild(el)
  })
  return svg
}

export const createSvgChildElement = <
  T extends keyof SVGElementTagNameMap = any
>(
  elName: T,
  attrs: Attrs
): SVGElementTagNameMap[T] => {
  const path = document.createElementNS(SVG_NS, elName)
  Object.keys(attrs)
    .sort()
    .map((key: string) => {
      path.setAttribute(key, attrs[key])
    })
  return path
}

/** @deprecated */
export const pathObjectToElement = (path: PathAttributes): SVGPathElement => {
  const kebabAttrs = Object.entries(path).reduce(
    (acc, [key, val], _i) =>
      val
        ? {
            ...acc,
            [camel2kebab(key)]: val,
          }
        : acc,
    {}
  )
  return createSvgChildElement('path', kebabAttrs)
}

export const svgObjectToElement = ({
  width,
  height,
  background,
  paths,
}: SvgObject): SVGSVGElement => {
  const size = { width: String(width), height: String(height) }
  const bgEl = background
    ? [createSvgChildElement('rect', { ...size, fill: background })]
    : []
  const updateEl = createSvgElement(size, [
    ...bgEl,
    ...paths.map(({ attributes }) => pathObjectToElement(attributes)),
  ])
  return updateEl
}

export class Renderer {
  constructor(public el: HTMLElement, { background }: RendererOption = {}) {
    /** Setup parameter */
    const { width, height } = this.el.getBoundingClientRect()
    this.el.appendChild(
      svgObjectToElement({ background, width, height, paths: [] })
    )

    this.update = this.update.bind(this)
  }
  /**
   * Update render.
   *
   * @todo XSS test.
   *
   * @todo Animation Svg renderer.
   *
   * @todo Edit layer renderer.
   *
   * @todo Partially render.
   */
  public update({ svg }: { svg: SvgObject }): void {
    this.el.replaceChild(svgObjectToElement(svg), this.el.childNodes[0])
  }
}
