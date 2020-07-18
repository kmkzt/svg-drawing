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
