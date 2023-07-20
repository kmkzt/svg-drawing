import { parseSVGString } from '@svg-drawing/core'
import { ImgLoader, ImgTrace, Palette } from '@svg-drawing/img-trace'
import { useCallback } from 'react'
import type { UseParseFile } from '../types'

/**
 * ### Load svg from uploaded file.
 *
 * ```ts
 * import { useSvg, useParseFile } from '@svg-drawing/react'
 *
 * const svg = useSvg({ width: 500, height: 500 })
 * const parseFile = useParseFile({ svg })
 *
 * const onChangeFile = useCallback<ChangeEventHandler<HTMLInputElement>>(
 *   async (e) => {
 *     if (!e.target?.files) return
 *     await parseFile(e.target.files[0])
 *   },
 *   []
 * )
 *
 * return <input type="file" onChange={onChangeFile} />
 * ```
 */
export const useParseFile: UseParseFile = ({ svg }) =>
  useCallback(
    async (file): Promise<void> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onerror = (err) => reject(err)

        reader.onload = async (ev: ProgressEvent<FileReader>) => {
          if (!ev.target || typeof ev.target.result !== 'string') return
          const [type, data] = ev.target.result.split(',')
          if (type === 'data:image/svg+xml;base64') {
            const svgXml = atob(data)
            svg.copy(parseSVGString(svgXml))
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
