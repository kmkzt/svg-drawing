import { EDIT_PATH_STYLE } from './editPathStyle'
import { camel2kebab } from '../utils'
import type {
  AnimateAttribute,
  BoundingBoxObject,
  EditSvgObject,
  PathAttributes,
  RendererClass,
  RendererOption,
  Vertex,
} from '../types'

const VERSION = '1.1'
const SVG_NS = 'http://www.w3.org/2000/svg'
const SVG_XLINK = 'http://www.w3.org/1999/xlink'

type Attrs = {
  [key: string]: string | number | undefined
}

const element = <T extends keyof SVGElementTagNameMap = any>(
  elName: T,
  attrs: Attrs
): SVGElementTagNameMap[T] => {
  const path = document.createElementNS(SVG_NS, elName)
  Object.keys(attrs)
    .sort()
    .map((key) => {
      const val = key in attrs ? attrs[key] : undefined
      if (val === undefined) return

      path.setAttribute(key, String(val))
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
    (acc: Attrs, [key, val], _i) =>
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

const rectElement = (attrs: {
  width: number
  height: number
  x?: number
  y?: number
  fill?: string
  stroke?: string
}) => element('rect', attrs)

const animateElement = (attrs: AnimateAttribute) => element('animate', attrs)

const boundingBoxElement = ({
  boundingBox: { position, size },
  selectedOnlyPaths,
}: {
  boundingBox: BoundingBoxObject
  selectedOnlyPaths: boolean
}) =>
  rectElement({
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
    stroke: EDIT_PATH_STYLE.color.main,
    fill: selectedOnlyPaths
      ? EDIT_PATH_STYLE.fill.selected
      : EDIT_PATH_STYLE.fill.boundingBox,
  })

const boundingBoxVertexElement = ({
  vertex,
  selectedOnlyPaths,
}: {
  vertex: Vertex
  selectedOnlyPaths: boolean
}) =>
  element('circle', {
    cx: vertex.point.x,
    cy: vertex.point.y,
    r: EDIT_PATH_STYLE.point,
    stroke: EDIT_PATH_STYLE.color.main,
    fill: selectedOnlyPaths
      ? EDIT_PATH_STYLE.fill.selected
      : EDIT_PATH_STYLE.fill.boundingBox,
  })

const editLayer = ({
  boundingBox,
  selectedOnlyPaths,
}: EditSvgObject): SVGElement[] => {
  return [
    boundingBoxElement({ boundingBox, selectedOnlyPaths }),
    ...boundingBox.vertexes.map((vertex) =>
      boundingBoxVertexElement({
        vertex,
        selectedOnlyPaths,
      })
    ),
  ]
}

export const toElement = ({
  svg: { width, height, background, paths },
  animation,
  edit,
}: Parameters<RendererClass['update']>[0]): SVGSVGElement => {
  return svgElement({ width, height, background }, [
    ...paths.map(({ key, attributes }) =>
      pathElement(
        attributes,
        animation?.find((animate) => animate.key === key)?.animates
      )
    ),
    ...(edit ? editLayer(edit) : []),
  ])
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
