import { readFile } from 'fs'
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import PNGReader from 'png.js'
interface PngData {
  width: number
  height: number
  data: any
}

export const loadPngData = (filepath: string, cb: (png: PngData) => void) => {
  readFile(filepath, (err: any, bytes: any) => {
    if (err) {
      console.log(err)
      throw err
    }

    const reader = new PNGReader(bytes)

    reader.parse((err: any, png: any) => {
      if (err) {
        console.log(err)
        throw err
      }

      cb({
        width: png.width,
        height: png.height,
        data: png.pixels,
      })
    })
  })
}
