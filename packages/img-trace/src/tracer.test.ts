import { Tracer, TracerOption } from './tracer'
import { Sampling, Palette, Rgba } from './palette'
import { Blur } from './blur'
import { PNGReader } from './PNGReader'
import { readFile, writeFileSync } from 'fs'
import { resolve } from 'path'

const testPattern: {
  [key: string]: Partial<TracerOption & { palettes?: Rgba[] }>
} = {
  default: {},
  curvy: { rightangleenhance: false },
  ltres: { ltres: 0.01 },
  qtres: { qtres: 0.01 },
  pathomit_20: { pathOmit: 20 },
  commandOmit: { commandOmit: 3 },
  palettes_custom: {
    palettes: [
      { r: 0, g: 0, b: 100, a: 255 },
      { r: 255, g: 255, b: 255, a: 255 },
    ],
  },
}

interface PngData {
  width: number
  height: number
  data: any
}
const loadPngData = (filepath: string, cb: (png: PngData) => void) => {
  readFile(
    filepath, // Input file path
    (err: any, bytes: any) => {
      if (err) {
        console.log(err)
        throw err
      }

      const reader = new PNGReader(bytes)

      reader.parse(
        (err, png) => {
          if (err) {
            console.log(err)
            throw err
          }

          // tracing to SVG string
          cb({
            width: png.width,
            height: png.height,
            data: png.pixels,
          })
        } // End of readFile callback()
      ) // End of fs.readFile()
    }
  )
}

describe('tracer.ts', () => {
  const testimage = resolve(__dirname, '__testdata__/panda.png')
  it('TestPattern', () => {
    // TestPattern
    expect(testPattern).toMatchSnapshot()
  })
  describe('Tracer', () => {
    Object.entries(testPattern).map(([testname, testdata]) => {
      it(testname, (done) => {
        loadPngData(testimage, (png: PngData) => {
          const { palettes: pal, ...opt } = testdata
          const palette = pal || new Palette().generate(png)
          const svg = new Tracer(palette, opt).fromImgData(png)

          /** DEBUG **/
          writeFileSync(
            resolve(__dirname, `__debug__/${testname}-${Date.now()}.svg`),
            svg.outerHTML
          )

          // TODO: visual regression

          // Effect Image
          // TODO: visual regression
          // expect(imgd).toMatchSnapshot()

          // SvgString
          expect(svg.outerHTML).toMatchSnapshot()
          done()
        })
      })
    })
  })
})
