import { camel2kebab } from '../utils'
import type {
  AnimateAttribute,
  PathAttributes,
  RendererClass,
  RendererOption,
} from '../types'

const VERSION = '1.1'
const SVG_NS = 'http://www.w3.org/2000/svg'
const SVG_XLINK = 'http://www.w3.org/1999/xlink'
interface Attrs {
  [key: string]: string
}

const element = <T extends keyof SVGElementTagNameMap = any>(
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

const svgElement = (
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

const pathElement = (
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
  const pathElement = element('path', kebabAttrs)

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
  element('rect', {
    width: String(width),
    height: String(height),
    fill,
  })

const animateElement = (attrs: AnimateAttribute) => element('animate', attrs)

export const toElement = ({
  svg: { width, height, background, paths },
  animation,
}: Parameters<RendererClass['update']>[0]): SVGSVGElement => {
  return svgElement(
    { width, height, background },
    paths.map(({ key, attributes }) =>
      pathElement(
        attributes,
        animation?.find((animate) => animate.key === key)?.animates
      )
    )
  )
}

export class SvgRenderer implements RendererClass {
  constructor(public el: HTMLElement, { background }: RendererOption = {}) {
    /** Setup parameter */
    const { width, height } = this.el.getBoundingClientRect()
    this.el.appendChild(
      toElement({ svg: { background, width, height, paths: [] } })
    )

    this.update = this.update.bind(this)
  }
  /** Update render */
  public update({
    svg,
    animation,
  }: Parameters<RendererClass['update']>[0]): void {
    this.el.replaceChild(toElement({ svg, animation }), this.el.childNodes[0])
  }
}
