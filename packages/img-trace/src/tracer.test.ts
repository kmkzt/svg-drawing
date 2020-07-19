import { Tracer, TracerOption } from './tracer'
import { Sampling, Palette, Rgba } from './palette'
import { Blur } from './blur'
import { PNGReader } from './PNGReader'
import { readFile, writeFileSync } from 'fs'
import { resolve } from 'path'

const testPattern: {
  [key: string]: Partial<
    TracerOption & {
      palette: Rgba[]
      blurradius: number
      blurdelta: number
      colorsampling: Sampling
      colorquantcycles: number
      numberofcolors: number
    }
  >
} = {
  default: {},
  posterized1: {
    colorsampling: Sampling.NUMBER_OF_COLORS,
    numberofcolors: 2,
  },
  posterized2: { numberofcolors: 4, blurradius: 5 },
  curvy: { ltres: 0.01, linefilter: true, rightangleenhance: false },
  sharp: { qtres: 0.01, linefilter: false },
  detailed: {
    pathomit: 0,
    decimalPlace: 2,
    ltres: 0.5,
    qtres: 0.5,
    numberofcolors: 64,
  },
  smoothed: { blurradius: 5, blurdelta: 64 },
  grayscale: {
    colorsampling: Sampling.NUMBER_OF_COLORS,
    colorquantcycles: 1,
    numberofcolors: 7,
  },
  fixedpalette: {
    colorsampling: Sampling.NUMBER_OF_COLORS,
    colorquantcycles: 1,
    numberofcolors: 27,
  },
  randomsampling1: {
    colorsampling: Sampling.PICKUP_RANDOM,
    numberofcolors: 8,
  },
  randomsampling2: {
    colorsampling: Sampling.PICKUP_RANDOM,
    numberofcolors: 64,
  },
  artistic1: {
    colorsampling: Sampling.NUMBER_OF_COLORS,
    colorquantcycles: 1,
    pathomit: 0,
    blurradius: 5,
    blurdelta: 64,
    ltres: 0.01,
    linefilter: true,
    numberofcolors: 16,
    strokewidth: 2,
  },
  artistic2: {
    qtres: 0.01,
    colorsampling: Sampling.NUMBER_OF_COLORS,
    colorquantcycles: 1,
    numberofcolors: 4,
    strokewidth: 0,
  },
  artistic3: { qtres: 10, ltres: 10, numberofcolors: 8 },
  artistic4: {
    qtres: 10,
    ltres: 10,
    numberofcolors: 64,
    blurradius: 5,
    blurdelta: 256,
    strokewidth: 2,
  },
  posterized3: {
    ltres: 1,
    qtres: 1,
    pathomit: 20,
    rightangleenhance: true,
    colorsampling: Sampling.NUMBER_OF_COLORS,
    numberofcolors: 3,
    colorquantcycles: 3,
    blurradius: 3,
    blurdelta: 20,
    strokewidth: 0,
    linefilter: false,
    decimalPlace: 1,
    palette: [
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
    Object.entries(testPattern)
      .filter(
        ([testname]) =>
          !testname.includes('random') && !testname.includes('artistic1')
      )
      .map(([testname, testdata]) => {
        it(testname, (done) => {
          loadPngData(testimage, (png: PngData) => {
            const {
              colorquantcycles,
              colorsampling,
              numberofcolors,
              blurdelta,
              blurradius,
              palette: pal,
              ...opt
            } = testdata
            const imgd = new Blur({
              delta: blurdelta,
              radius: blurradius,
            }).apply(png)
            const palette =
              pal ||
              new Palette({
                colorquantcycles,
                sampling: colorsampling,
                numberofcolors,
              }).generate(imgd)
            const svg = new Tracer(palette, opt).imageToSVG(imgd)
            // Palette
            expect(
              palette.map((c) => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a / 255})`)
            ).toMatchSnapshot()

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
