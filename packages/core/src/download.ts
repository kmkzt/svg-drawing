export const mimeTypeMap = {
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
} as const

const base64ToBlob = (
  data: string,
  type: typeof mimeTypeMap[keyof typeof mimeTypeMap]
) => {
  const bin = atob(data.replace(/^.*,/, ''))
  const buffer = new Uint8Array(bin.length)

  for (let i = 0; i < bin.length; i += 1) {
    buffer[i] = bin.charCodeAt(i)
  }

  return new Blob([buffer.buffer], {
    type,
  })
}

export const downloadBlob = ({
  data,
  extension,
  filename,
}: {
  data: string
  extension: keyof typeof mimeTypeMap
  filename: string
}): void => {
  const blob = base64ToBlob(data, mimeTypeMap[extension])
  // IE
  if ((navigator as any).msSaveBlob) {
    ;(navigator as any).msSaveBlob(blob, filename)
    return
  }

  // Firefox, Chrome, Safari
  if (URL?.createObjectURL) {
    const a = document.createElement('a')
    a.download = filename
    a.href = URL.createObjectURL(blob)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return
  }

  // Other
  open(data, '_blank')
}

export class Download {
  private download: typeof downloadBlob
  constructor(private el: SVGSVGElement, _download?: typeof downloadBlob) {
    this.download = _download || downloadBlob
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

  private toBase64() {
    return `data:image/svg+xml;base64,${btoa(this.el.outerHTML)}`
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
