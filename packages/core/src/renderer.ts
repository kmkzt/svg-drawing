import type { PathObject, RendererOption, SvgObject } from './types'
import { camel2kebab } from './utils'

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

export const createSvgChildElement = (
  elname: string,
  attrs: Attrs
): SVGElement => {
  const path = document.createElementNS(SVG_NS, elname)
  Object.keys(attrs)
    .sort()
    .map((key: string) => {
      path.setAttribute(key, attrs[key])
    })
  return path
}

export const pathObjectToElement = (path: PathObject): SVGElement => {
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
    ...paths.map(pathObjectToElement),
  ])
  return updateEl
}

export class Renderer {
  constructor(public el: HTMLElement, { background }: RendererOption = {}) {
    /**
     * Setup parameter
     */
    const { width, height } = this.el.getBoundingClientRect()
    this.el.appendChild(
      svgObjectToElement({ background, width, height, paths: [] })
    )
  }
  /**
   * render
   * TODO: XSS test
   * TODO: Partially render
   */
  public update(svgObj: SvgObject): void {
    this.el.replaceChild(svgObjectToElement(svgObj), this.el.childNodes[0])
  }
}
