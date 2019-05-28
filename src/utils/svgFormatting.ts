/**
 * remove <g>
 * remove transform attribure
 * @param svgString
 * @returns {SVGSVGElement}
 */
export const svgFormatting = (svgString: string): SVGSVGElement => {
  const parser: DOMParser = new DOMParser()
  const doc: Document = parser.parseFromString(svgString, 'image/svg+xml')
  const svgEle: SVGSVGElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )
  const originSvgEle: SVGSVGElement | null = doc.querySelector('svg')
  if (!originSvgEle) return svgEle
  ;['width', 'height', 'viewBox'].map((attr: string) => {
    const attrValue: string | null = originSvgEle.getAttribute(attr)
    if (attrValue) svgEle.setAttribute(attr, attrValue)
  })
  const pathEle: NodeListOf<SVGPathElement> = doc.querySelectorAll('path')
  pathEle.forEach((path: SVGPathElement) => {
    path.removeAttribute('transform')
    svgEle.appendChild(path)
  })
  return svgEle
}
