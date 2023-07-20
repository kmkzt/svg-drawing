export const mimeTypeMap = {
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
} as const

const download = ({
  data,
  extension,
  filename,
}: {
  data: string
  extension: keyof typeof mimeTypeMap
  filename: string
}): void => {
  const a = document.createElement('a')
  a.download = filename
  a.href = data
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export class Download {
  private download: typeof download
  constructor(private el: SVGSVGElement, _download?: typeof download) {
    this.download = _download || download
  }

  public svg(filename: string) {
    this.download({
      data: this.toBase64(),
      extension: 'svg',
      filename,
    })
  }

  public png(filename: string) {
    this.renderCanvas({
      filename,
      extension: 'png',
    })
  }

  public jpg(filename: string) {
    this.renderCanvas({
      filename,
      extension: 'png',
    })
  }

  public toBase64() {
    return `data:image/svg+xml;base64,${Buffer.from(this.el.outerHTML).toString(
      'base64'
    )}`
  }

  private renderCanvas({
    filename,
    extension,
  }: {
    filename: string
    extension: 'png' | 'jpg'
  }) {
    const img = new Image()
    const renderCanvas = () => {
      const canvas = document.createElement('canvas')

      canvas.setAttribute('width', String(this.el.width.animVal.value))
      canvas.setAttribute('height', String(this.el.height.animVal.value))
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      this.download({
        data: canvas.toDataURL(mimeTypeMap[extension]),
        extension,
        filename,
      })
    }
    img.addEventListener('load', renderCanvas, false)
    img.src = this.toBase64()
  }
}
