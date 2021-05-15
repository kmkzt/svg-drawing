import { useCallback } from 'react'
import type { UseParseFile } from './types'

export const useParseFile: UseParseFile = ({ parseSVGString }) =>
  useCallback(
    (file) => {
      const reader = new FileReader()
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (!ev.target || typeof ev.target.result !== 'string') return
        const [type, data] = ev.target.result.split(',')
        if (type === 'data:image/svg+xml;base64') {
          const svgXml = atob(data)
          parseSVGString(svgXml)
        }
      }
      reader.readAsDataURL(file)
    },
    [parseSVGString]
  )
