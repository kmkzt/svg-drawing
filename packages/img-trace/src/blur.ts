import { convertRGBAImage } from './utils/convertRGBAImage'

// Gaussian kernels for blur
const gks: number[][] = [
  [0.27901, 0.44198, 0.27901],
  [0.135336, 0.228569, 0.272192, 0.228569, 0.135336],
  [0.086776, 0.136394, 0.178908, 0.195843, 0.178908, 0.136394, 0.086776],
  [
    0.063327, 0.093095, 0.122589, 0.144599, 0.152781, 0.144599, 0.122589,
    0.093095, 0.063327,
  ],
  [
    0.049692, 0.069304, 0.089767, 0.107988, 0.120651, 0.125194, 0.120651,
    0.107988, 0.089767, 0.069304, 0.049692,
  ],
]

export interface BlurOption {
  radius?: number
  delta?: number
}
export class Blur {
  public radius: number
  public delta: number
  constructor({ radius, delta }: BlurOption) {
    this.radius = radius ?? 0
    this.delta = delta ?? 20
  }

  public apply(argimgd: ImageData): ImageData {
    const imgd = convertRGBAImage(argimgd)
    const data: Uint8ClampedArray = new Uint8ClampedArray(imgd.data)
    // radius and delta limits, this kernel
    let radius = Math.floor(this.radius)
    if (radius < 1) {
      return imgd
    }
    if (radius > gks.length) {
      radius = gks.length
    }
    let delta = Math.abs(this.delta)
    if (delta > 1024) {
      delta = 1024
    }
    const thisgk = gks[radius - 1]

    // loop through all pixels, horizontal blur
    for (let j = 0; j < imgd.height; j++) {
      for (let i = 0; i < imgd.width; i++) {
        let racc = 0
        let gacc = 0
        let bacc = 0
        let aacc = 0
        let wacc = 0
        // gauss kernel loop
        for (let k = -radius; k < radius + 1; k++) {
          // add weighted color values
          if (i + k > 0 && i + k < imgd.width) {
            const idx = (j * imgd.width + i + k) * 4
            racc += imgd.data[idx] * thisgk[k + radius]
            gacc += imgd.data[idx + 1] * thisgk[k + radius]
            bacc += imgd.data[idx + 2] * thisgk[k + radius]
            aacc += imgd.data[idx + 3] * thisgk[k + radius]
            wacc += thisgk[k + radius]
          }
        }
        // The new pixel
        const idx = (j * imgd.width + i) * 4
        data[idx] = Math.floor(racc / wacc)
        data[idx + 1] = Math.floor(gacc / wacc)
        data[idx + 2] = Math.floor(bacc / wacc)
        data[idx + 3] = Math.floor(aacc / wacc)
      } // End of width loop
    } // End of horizontal blur

    // copying the half blurred imgd2
    const himgd = new Uint8ClampedArray(data)

    // loop through all pixels, vertical blur
    for (let j = 0; j < imgd.height; j++) {
      for (let i = 0; i < imgd.width; i++) {
        let racc = 0
        let gacc = 0
        let bacc = 0
        let aacc = 0
        let wacc = 0
        // gauss kernel loop
        for (let k = -radius; k < radius + 1; k++) {
          // add weighted color values
          if (j + k > 0 && j + k < imgd.height) {
            const idx = ((j + k) * imgd.width + i) * 4
            racc += himgd[idx] * thisgk[k + radius]
            gacc += himgd[idx + 1] * thisgk[k + radius]
            bacc += himgd[idx + 2] * thisgk[k + radius]
            aacc += himgd[idx + 3] * thisgk[k + radius]
            wacc += thisgk[k + radius]
          }
        }
        // The new pixel
        const idx = (j * imgd.width + i) * 4
        data[idx] = Math.floor(racc / wacc)
        data[idx + 1] = Math.floor(gacc / wacc)
        data[idx + 2] = Math.floor(bacc / wacc)
        data[idx + 3] = Math.floor(aacc / wacc)
      } // End of width loop
    } // End of vertical blur
    // Selective blur: loop through all pixels
    for (let j = 0; j < imgd.height; j++) {
      for (let i = 0; i < imgd.width; i++) {
        const idx = (j * imgd.width + i) * 4
        // d is the difference between the blurred and the original pixel
        const d =
          Math.abs(data[idx] - imgd.data[idx]) +
          Math.abs(data[idx + 1] - imgd.data[idx + 1]) +
          Math.abs(data[idx + 2] - imgd.data[idx + 2]) +
          Math.abs(data[idx + 3] - imgd.data[idx + 3])
        // selective blur: if d>delta, put the original pixel back
        if (d > delta) {
          data[idx] = imgd.data[idx]
          data[idx + 1] = imgd.data[idx + 1]
          data[idx + 2] = imgd.data[idx + 2]
          data[idx + 3] = imgd.data[idx + 3]
        }
      }
    } // End of Selective blur
    return new ImageData(data, imgd.width, imgd.height)
  }
}
