import { camel2kebab } from '../utils'
import type {
  AnimateAttribute,
  PathAttributes,
  RendererOption,
  SvgObject,
} from '../types'

const VERSION = '1.1'
const SVG_NS = 'http://www.w3.org/2000/svg'
const SVG_XLINK = 'http://www.w3.org/1999/xlink'
interface Attrs {
  [key: string]: string
}
export const createSvgElement = <T extends keyof SVGElementTagNameMap = any>(
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

export const svgElement = (
  {
    width,
    height,
    background,
  }: { width: number; height: number; background?: string },
  childs: SVGElement[]
): SVGSVGElement => {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttributeNS(null, 'version', VERSION)
  svg.setAttribute('xmlns', SVG_NS)
  svg.setAttribute('xmlns:xlink', SVG_XLINK)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))

  if (background) {
    svg.appendChild(rectElement({ width, height, fill: background }))
  }

  childs.map((el: SVGElement) => {
    svg.appendChild(el)
  })
  return svg
}

export const pathElement = (
  path: PathAttributes,
  animateAttrs?: AnimateAttribute[]
): SVGPathElement => {
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
  const pathElement = createSvgElement('path', kebabAttrs)

  animateAttrs?.forEach((animateAttr) => {
    pathElement.appendChild(animateElement(animateAttr))
  })

  return pathElement
}

const rectElement = ({
  width,
  height,
  fill,
}: {
  width: number
  height: number
  fill: string
}) =>
  createSvgElement('rect', {
    width: String(width),
    height: String(height),
    fill,
  })

const animateElement = (attrs: AnimateAttribute) =>
  createSvgElement('animate', attrs)

export const svgObjectToElement = ({
  width,
  height,
  background,
  paths,
}: SvgObject): SVGSVGElement => {
  const updateEl = svgElement(
    { width, height, background },
    paths.map(({ attributes }) => pathElement(attributes))
  )
  return updateEl
}

export class SvgRenderer {
  constructor(public el: HTMLElement, { background }: RendererOption = {}) {
    /** Setup parameter */
    const { width, height } = this.el.getBoundingClientRect()
    this.el.appendChild(
      svgObjectToElement({ background, width, height, paths: [] })
    )

    this.update = this.update.bind(this)
  }
  /** Update render */
  public update({ svg }: { svg: SvgObject }): void {
    this.el.replaceChild(svgObjectToElement(svg), this.el.childNodes[0])
  }
}
