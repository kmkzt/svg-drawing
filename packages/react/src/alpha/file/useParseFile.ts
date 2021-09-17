import { ImgLoader, ImgTrace, Palette } from '@svg-drawing/img-trace'
import { useCallback } from 'react'
import type { UseParseFile } from '../types'

/** @todo Added cancel event handler. */
export const useParseFile: UseParseFile = ({ svg }) =>
  useCallback(
    async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onerror = (err) => reject(err)

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
