import { Sampling, Palette, PalleteOption } from './palette'
import { PNGReader } from './PNGReader'
import { readFile } from 'fs'
import { resolve } from 'path'

const testPattern: {
  [key: string]: Partial<PalleteOption>
} = {
  deterministic: {
    sampling: Sampling.DETERMINISTIC,
  },
  deterministic_color_4: {
    sampling: Sampling.DETERMINISTIC,
    numberofcolors: 4,
  },
  deterministic_color_8: {
    sampling: Sampling.DETERMINISTIC,
    numberofcolors: 8,
  },
  deterministic_color_64: {
    sampling: Sampling.DETERMINISTIC,
    numberofcolors: 64,
  },
  numberOfColors_color_2: {
    sampling: Sampling.NUMBER_OF_COLORS,
    numberofcolors: 2,
  },
  numberOfColors_color_4: {
    sampling: Sampling.NUMBER_OF_COLORS,
    colorquantcycles: 1,
    numberofcolors: 4,
  },
  numberOfColors_color_7: {
    sampling: Sampling.NUMBER_OF_COLORS,
    colorquantcycles: 1,
    numberofcolors: 7,
  },
  numberofcolors_color_27: {
    sampling: Sampling.NUMBER_OF_COLORS,
    colorquantcycles: 1,
    numberofcolors: 27,
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

describe('palette.ts', () => {
  const testimage = resolve(__dirname, '__testdata__/panda.png')
  describe('Palette', () => {
    Object.entries(testPattern).map(([testname, testdata]) => {
      it(testname, (done) => {
        loadPngData(testimage, (imgd: PngData) => {
          const palette = new Palette(testdata).generate(imgd)
          // Palette
          expect(
            palette.map((c) => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a / 255})`)
          ).toMatchSnapshot()
          done()
        })
      })
    })
  })
})
