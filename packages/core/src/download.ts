import { svgObjectToElement } from './renderer'
import type { Svg } from './svg'
import { DownloadOption, SvgObject } from './types'

export const toBase64 = (svgObj: SvgObject): string => {
  return svg2base64(svgObjectToElement(svgObj).outerHTML)
}

export const svg2base64 = (svg: string): string =>
  `data:image/svg+xml;base64,${btoa(svg)}`

export const mimeTypeMap: { [key in DownloadOption['extension']]: string } = {
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
} as const

export const downloadBlob = ({
  data,
  extension,
  filename,
}: {
  data: string
  extension: keyof typeof mimeTypeMap
  filename?: string
}): void => {
  const bin = atob(data.replace(/^.*,/, ''))
  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i += 1) {
    buffer[i] = bin.charCodeAt(i)
  }
  const fname = filename || `${Date.now()}.${extension}`
  const blob = new Blob([buffer.buffer], {
    type: mimeTypeMap[extension],
  })
  // IE
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, fname)
    return
  }

  // Firefox, Chrome, Safari
  if (URL && URL.createObjectURL) {
    const a = document.createElement('a')
    a.download = fname
    a.href = URL.createObjectURL(blob)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return
  }

  // Other
  open(data, '_blank')
}

const defaultOpts: DownloadOption = {
  extension: 'svg',
}

export const download = (
  svg: Svg,
  opt: DownloadOption = defaultOpts,
  dlb: typeof downloadBlob = downloadBlob
): void => {
  const { filename, extension: ext } = { ...defaultOpts, ...opt }
  const base64 = toBase64(svg.toJson())
  if (ext === 'svg') {
    dlb({
      data: base64,
      extension: 'svg',
      filename,
    })
    return
  }

  const { width, height, background } = svg
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
      dlb({ data: canvas.toDataURL('image/png'), extension: 'png' })
    } else {
      dlb({ data: canvas.toDataURL('image/jpeg'), extension: 'jpg' })
    }
  }
  img.addEventListener('load', renderCanvas, false)
  img.src = base64
}
