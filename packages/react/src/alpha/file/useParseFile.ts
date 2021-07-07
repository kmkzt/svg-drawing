import { useCallback } from 'react'
import { ImgLoader, ImgTrace, Palette } from '@svg-drawing/img-trace'
import type { UseParseFile } from './types'

export const useParseFile: UseParseFile = ({ svg }) =>
  useCallback(
    async (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = async (ev: ProgressEvent<FileReader>) => {
          if (!ev.target || typeof ev.target.result !== 'string') return
          const [type, data] = ev.target.result.split(',')
          if (type === 'data:image/svg+xml;base64') {
            const svgXml = atob(data)
            svg.parseSVGString(svgXml)
            resolve()
          }
          const imgData = (await new ImgLoader({ corsenabled: true }).fromUrl(
            ev.target.result
          )) as ImageData
          const trace = new ImgTrace({
            palettes: Palette.imageData(imgData),
          }).load(imgData)
          svg.copy(trace)
          resolve()
        }
        reader.readAsDataURL(file)
      })
    },
    [svg]
  )
