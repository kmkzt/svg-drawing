import {
  camel2kebab,
  createSvgChildElement,
  createSvgElement,
  download,
  svg2base64,
} from './shared'
import { PathObject, RendererOption, SvgObject } from './types'

export class Renderer {
  constructor(public el: HTMLElement, { background }: RendererOption = {}) {
    /**
     * Setup parameter
     */
    const { width, height } = el.getBoundingClientRect()
    el.appendChild(
      Renderer.svgObjectToElement({ background, width, height, paths: [] })
    )
  }

  public static pathObjectToElement(path: PathObject) {
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

  public static toBase64(svgObj: SvgObject): string {
    return svg2base64(Renderer.svgObjectToElement(svgObj).outerHTML)
  }

  public static svgObjectToElement({
    width,
    height,
    background,
    paths,
  }: SvgObject): SVGSVGElement {
    const size = { width: String(width), height: String(height) }
    const bgEl = background
      ? [createSvgChildElement('rect', { ...size, fill: background })]
      : []
    const updateEl = createSvgElement(size, [
      ...bgEl,
      ...paths.map(Renderer.pathObjectToElement),
    ])
    return updateEl
  }

  // TODO: Add filename config
  public static download(
    svgObj: SvgObject,
    ext: 'svg' | 'png' | 'jpg' = 'svg',
    cb: typeof download = download
  ): void {
    const base64 = Renderer.toBase64(svgObj)
    if (ext === 'svg') {
      cb({
        data: base64,
        extension: 'svg',
      })
      return
    }

    const { width, height, background } = svgObj
    const img: any = new Image()
    const renderCanvas = () => {
      const canvas = document.createElement('canvas')
      canvas.setAttribute('width', String(width))
      canvas.setAttribute('height', String(height))
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      if (background || ext === 'jpg') {
        ctx.fillStyle = background || '#fff'
        ctx.fillRect(0, 0, width, height)
      }
      ctx.drawImage(img, 0, 0)
      if (ext === 'png') {
        cb({ data: canvas.toDataURL('image/png'), extension: 'png' })
      } else {
        cb({ data: canvas.toDataURL('image/jpeg'), extension: 'jpg' })
      }
    }
    img.addEventListener('load', renderCanvas, false)
    img.src = base64
  }
  /**
   * render
   * TODO: XSS test
   * TODO: Partially renderable
   */
  public update(svgObj: SvgObject): void {
    this.el.replaceChild(
      Renderer.svgObjectToElement(svgObj),
      this.el.childNodes[0]
    )
  }
}
