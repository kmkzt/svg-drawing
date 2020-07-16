import { Svg, Path } from './svg'
import { download } from './shared/download'

export interface RendererOption {
  background?: string
}
export class Renderer extends Svg {
  public el: HTMLElement
  public top: number
  public left: number
  public background: string

  constructor(el: HTMLElement, { background }: RendererOption = {}) {
    const { width, height, left, top } = el.getBoundingClientRect()
    super({ width, height })

    /**
     * Setup parameter
     */
    this.el = el
    this.left = left
    this.top = top
    this.background = background ?? '#fff'
    el.appendChild(this.toElement())
    this._setupAdjustResize()
  }

  /**
   * render
   * TODO: XSS test
   */
  public update(): void {
    this.el.replaceChild(this.toElement(), this.el.childNodes[0])
  }

  public resizeElement(param?: DOMRect): void {
    const { width, height, left, top } =
      param || this.el.getBoundingClientRect()

    // TODO: Resizing improve
    this.scalePath(width / this.width)
    this.width = width
    this.height = height
    this.left = left
    this.top = top
  }

  private _setupAdjustResize(): void {
    if ((window as any).ResizeObserver) {
      const resizeObserver: any = new (window as any).ResizeObserver(
        (entries: any[]) => {
          this.resizeElement(entries[0].contentRect)
          this.update()
        }
      )
      resizeObserver.observe(this.el)
    } else {
      // TODO: improve
      window.addEventListener('resize', (_ev) => {
        this.resizeElement(this.el.getBoundingClientRect())
        this.update()
      })
    }
  }

  // TODO: Add filename config
  public download(
    ext: 'svg' | 'png' | 'jpg' = 'svg',
    cb: typeof download = download
  ): void {
    if (ext === 'svg') {
      cb({
        data: this.toBase64(),
        extension: 'svg',
      })

      return
    }

    const img: any = new Image()

    const renderCanvas = () => {
      const canvas = document.createElement('canvas')
      canvas.setAttribute('width', String(this.width))
      canvas.setAttribute('height', String(this.height))
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      ctx.fillStyle = this.background
      ctx.fillRect(0, 0, this.width, this.height)
      ctx.drawImage(img, 0, 0)

      if (ext === 'png') {
        cb({ data: canvas.toDataURL('image/png'), extension: 'png' })
      } else {
        cb({ data: canvas.toDataURL('image/jpeg'), extension: 'jpg' })
      }
    }

    img.addEventListener('load', renderCanvas, false)
    img.src = this.toBase64()
  }
}
