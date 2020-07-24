import { convertRGBAImage } from './utils/convertRGBAImage'

export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

const DEFAULT_NUMBER_OF_COLORS = 16
export interface FromImageDataOptions {
  numberOfColors?: number
  colorQuantCycles?: number
}
export class Palette {
  // Deterministic sampling a palette from imagedata: rectangular grid
  public static imageData(
    argimgd: ImageData,
    { numberOfColors, colorQuantCycles }: FromImageDataOptions = {}
  ): Rgba[] {
    const nc = numberOfColors || DEFAULT_NUMBER_OF_COLORS
    const cqc = colorQuantCycles || 3
    const imgd = convertRGBAImage(argimgd)

    const palette = this._deterministic(imgd, nc)
    let paletteacc: {
      r: number
      g: number
      b: number
      a: number
      n: number
    }[] = []
    // Using a form of k-means clustering repeatead options.colorquantcycles times. http://en.wikipedia.org/wiki/Color_quantization
    for (let cnt = 0; cnt < cqc; cnt++) {
      if (cnt > 0) {
        for (let k = 0; k < palette.length; k++) {
          // averaging
          if (paletteacc[k].n > 0) {
            palette[k] = {
              r: Math.floor(paletteacc[k].r / paletteacc[k].n),
              g: Math.floor(paletteacc[k].g / paletteacc[k].n),
              b: Math.floor(paletteacc[k].b / paletteacc[k].n),
              a: Math.floor(paletteacc[k].a / paletteacc[k].n),
            }
          }
        }
      }

      paletteacc = Array.from({ length: palette.length }, () => ({
        r: 0,
        g: 0,
        b: 0,
        a: 0,
        n: 0,
      }))

      // loop through all pixels
      for (let j = 0; j < imgd.height; j++) {
        for (let i = 0; i < imgd.width; i++) {
          // pixel index
          const idx = (j * imgd.width + i) * 4

          // find closest color from palette by measuring (rectilinear) color distance between this pixel and all palette colors
          // In my experience, https://en.wikipedia.org/wiki/Rectilinear_distance works better than https://en.wikipedia.org/wiki/Euclidean_distance
          let cdl = 1024 // 4 * 256 is the maximum RGBA distance
          const ci = palette.reduce((findId: number, pal: Rgba, id: number) => {
            const cd =
              Math.abs(pal.r - imgd.data[idx]) +
              Math.abs(pal.g - imgd.data[idx + 1]) +
              Math.abs(pal.b - imgd.data[idx + 2]) +
              Math.abs(pal.a - imgd.data[idx + 3])
            if (cd < cdl) {
              cdl = cd
              return id
            }
            return findId
          }, 0)

          // add to palettacc
          paletteacc[ci].r += imgd.data[idx]
          paletteacc[ci].g += imgd.data[idx + 1]
          paletteacc[ci].b += imgd.data[idx + 2]
          paletteacc[ci].a += imgd.data[idx + 3]
          paletteacc[ci].n += 1
        }
      }
    }
    return palette
  }

  // Deterministic sampling a palette from imagedata: rectangular grid
  private static _deterministic(
    imgd: ImageData,
    numberOfColors: number
  ): Rgba[] {
    const palette: Rgba[] = []
    const ni = Math.ceil(Math.sqrt(numberOfColors))
    const nj = Math.ceil(numberOfColors / ni)
    const vx = imgd.width / (ni + 1)
    const vy = imgd.height / (nj + 1)
    for (let j = 0; j < nj; j++) {
      for (let i = 0; i < ni; i++) {
        if (palette.length === numberOfColors) break
        const idx = Math.floor((j + 1) * vy * imgd.width + (i + 1) * vx) * 4
        palette.push({
          r: imgd.data[idx],
          g: imgd.data[idx + 1],
          b: imgd.data[idx + 2],
          a: imgd.data[idx + 3],
        })
      }
    }
    return palette
  }
  // Generating a palette with number of colors
  public static number(
    numberofcolors: number = DEFAULT_NUMBER_OF_COLORS
  ): Rgba[] {
    if (numberofcolors < 8) return this.grey(numberofcolors)
    const palette: Rgba[] = []
    const colorqnum = Math.floor(Math.pow(numberofcolors, 1 / 3))
    const colorstep = Math.floor(255 / (colorqnum - 1))

    for (let r = 0; r < colorqnum; r += 1) {
      for (let g = 0; g < colorqnum; g += 1) {
        for (let b = 0; b < colorqnum; b += 1) {
          palette.push({
            r: r * colorstep,
            g: g * colorstep,
            b: b * colorstep,
            a: 255,
          })
        }
      }
    }

    // TODO: rest improve
    // TODO: test
    const rest = numberofcolors - colorqnum * colorqnum * colorqnum
    for (let rcnt = 0; rcnt < rest; rcnt++) {
      palette.push({
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
        a: Math.floor(Math.random() * 255),
      })
    }

    return palette
  }

  public static grey(
    numberofcolors: number = DEFAULT_NUMBER_OF_COLORS
  ): Rgba[] {
    const palette: Rgba[] = []
    const graystep = Math.floor(255 / (numberofcolors - 1))
    for (let i = 0; i < numberofcolors; i++) {
      palette.push({
        r: i * graystep,
        g: i * graystep,
        b: i * graystep,
        a: 255,
      })
    }

    return palette
  }
}
