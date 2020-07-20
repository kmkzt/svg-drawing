export const convertRGBAImage = (imgd: ImageData): ImageData => {
  const pixelnum = imgd.width * imgd.height
  const isRGB = imgd.data.length < pixelnum * 4
  if (!isRGB) return imgd

  const rgbaImgd = new Uint8ClampedArray(pixelnum * 4)
  for (let pxcnt = 0; pxcnt < pixelnum; pxcnt++) {
    rgbaImgd[pxcnt * 4] = imgd.data[pxcnt * 3]
    rgbaImgd[pxcnt * 4 + 1] = imgd.data[pxcnt * 3 + 1]
    rgbaImgd[pxcnt * 4 + 2] = imgd.data[pxcnt * 3 + 2]
    rgbaImgd[pxcnt * 4 + 3] = 255
  }
  return {
    ...imgd,
    data: rgbaImgd,
  }
}
