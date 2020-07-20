import zlib from 'zlib'

type Bytes = number[] | Uint8Array
export class PNG {
  // initialize all members to keep the same hidden class
  public width = 0
  public height = 0
  private _bitDepth = 0
  public compressionMethod = 0
  public filterMethod = 0
  private _interlaceMethod = 0

  // Color
  private _colorType = 0
  private _colors = 0
  private _alpha = false

  public pixelBits = 0

  public _palette: any = null
  public pixels?: Buffer

  public setWidth(width: number): void {
    this.width = width
  }

  public setHeight(height: number): void {
    this.height = height
  }

  public get bitDepth(): number {
    return this._bitDepth
  }

  public setBitDepth(bitDepth: number): void {
    if ([2, 4, 8, 16].indexOf(bitDepth) === -1) {
      throw new Error(`invalid bith depth ${bitDepth}`)
    }
    this._bitDepth = bitDepth
  }

  public get colorType(): number {
    return this._colorType
  }

  public get colors(): number {
    return this._colors
  }

  public get alpha(): boolean {
    return this._alpha
  }

  public setColorType(colorType: number): void {
    //   Color    Allowed    Interpretation
    //   Type    Bit Depths
    //
    //   0       1,2,4,8,16  Each pixel is a grayscale sample.
    //
    //   2       8,16        Each pixel is an R,G,B triple.
    //
    //   3       1,2,4,8     Each pixel is a palette index;
    //                       a PLTE chunk must appear.
    //
    //   4       8,16        Each pixel is a grayscale sample,
    //                       followed by an alpha sample.
    //
    //   6       8,16        Each pixel is an R,G,B triple,
    //                       followed by an alpha sample.

    let colors = 0,
      alpha = false

    switch (colorType) {
      case 0:
        colors = 1
        break
      case 2:
        colors = 3
        break
      case 3:
        colors = 1
        break
      case 4:
        colors = 2
        alpha = true
        break
      case 6:
        colors = 4
        alpha = true
        break
      default:
        throw new Error('invalid color type')
    }

    this._colors = colors
    this._alpha = alpha
    this._colorType = colorType
  }

  public getCompressionMethod(): number {
    return this.compressionMethod
  }

  public setCompressionMethod(compressionMethod: number): void {
    if (compressionMethod !== 0) {
      throw new Error(`invalid compression method ${compressionMethod}`)
    }
    this.compressionMethod = compressionMethod
  }

  public getFilterMethod(): number {
    return this.filterMethod
  }

  public setFilterMethod(filterMethod: number): void {
    if (filterMethod !== 0) {
      throw new Error(`invalid filter method ${filterMethod}`)
    }
    this.filterMethod = filterMethod
  }

  public get interlaceMethod(): number {
    return this._interlaceMethod
  }

  public setInterlaceMethod(interlaceMethod: number): void {
    if (interlaceMethod !== 0 && interlaceMethod !== 1) {
      throw new Error(`invalid interlace method ${interlaceMethod}`)
    }
    this._interlaceMethod = interlaceMethod
  }

  public setPalette(palette: Bytes): void {
    if (palette.length % 3 !== 0) {
      throw new Error('incorrect PLTE chunk length')
    }
    if (palette.length > Math.pow(2, this.bitDepth) * 3) {
      throw new Error('palette has more colors than 2^bitdepth')
    }
    this._palette = palette
  }

  public get palette() {
    return this._palette
  }

  /**
   * get the pixel color on a certain location in a normalized way
   * result is an array: [red, green, blue, alpha]
   */
  public getPixel(x: number, y: number) {
    if (!this.pixels) throw new Error('pixel data is empty')
    if (x >= this.width || y >= this.height) {
      throw new Error('x,y position out of bound')
    }
    const i = ((this.colors * this.bitDepth) / 8) * (y * this.width + x)
    const pixels = this.pixels

    switch (this.colorType) {
      case 0:
        return [pixels[i], pixels[i], pixels[i], 255]
      case 2:
        return [pixels[i], pixels[i + 1], pixels[i + 2], 255]
      case 3:
        return [
          this.palette[pixels[i] * 3 + 0],
          this.palette[pixels[i] * 3 + 1],
          this.palette[pixels[i] * 3 + 2],
          255,
        ]
      case 4:
        return [pixels[i], pixels[i], pixels[i], pixels[i + 1]]
      case 6:
        return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]]
    }
  }
}

const slice = Array.prototype.slice
const toString = Object.prototype.toString

const equalBytes = (a: Bytes, b: Bytes): boolean => {
  if (a.length != b.length) return false
  for (let l = a.length; l--; ) if (a[l] != b[l]) return false
  return true
}

const readUInt32 = (buffer: Bytes, offset: number): number => {
  return (
    (buffer[offset] << 24) +
    (buffer[offset + 1] << 16) +
    (buffer[offset + 2] << 8) +
    (buffer[offset + 3] << 0)
  )
}

// TODO:
// function readUInt16(buffer: Bytes, offset: number): number {
//   return (buffer[offset + 1] << 8) + (buffer[offset] << 0)
// }

function readUInt8(buffer: Bytes, offset: number): number {
  return buffer[offset] << 0
}

function bufferToString(buffer: Bytes): string {
  let str = ''
  for (let i = 0; i < buffer.length; i++) {
    str += String.fromCharCode(buffer[i])
  }
  return str
}

export class PNGReader {
  // Output object
  public png = new PNG()
  // current pointer
  public i: number
  // bytes buffer
  public bytes: Bytes
  public header?: Bytes
  public dataChunks: Bytes[]

  constructor(bytes: any) {
    // TODO: fix for don't reassign args
    if (typeof bytes == 'string') {
      const bts = bytes
      bytes = new Array(bts.length)
      for (let i = 0, l = bts.length; i < l; i++) {
        bytes[i] = bts[i].charCodeAt(0)
      }
    } else {
      const type = toString.call(bytes).slice(8, -1)
      if (type == 'ArrayBuffer') bytes = new Uint8Array(bytes)
    }

    // current pointer
    this.i = 0
    // bytes buffer
    this.bytes = bytes
    // Output object
    this.png = new PNG()
    this.dataChunks = []
  }
  public readBytes(length: number): Bytes {
    const end: number = this.i + length
    if (end > this.bytes.length) {
      throw new Error('Unexpectedly reached end of file')
    }
    const bytes = this.bytes.slice(this.i, end)
    this.i = end
    return bytes
  }

  /**
   * http://www.w3.org/TR/2003/REC-PNG-20031110/#5PNG-file-signature
   */
  public decodeHeader() {
    if (this.i !== 0) {
      throw new Error('file pointer should be at 0 to read the header')
    }

    const header = this.readBytes(8)

    if (!equalBytes(header, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
      throw new Error('invalid PNGReader file (bad signature)')
    }

    this.header = header
  }

  /**
   * http://www.w3.org/TR/2003/REC-PNG-20031110/#5Chunk-layout
   *
   * length =  4      bytes
   * type   =  4      bytes (IHDR, PLTE, IDAT, IEND or others)
   * chunk  =  length bytes
   * crc    =  4      bytes
   */
  public decodeChunk() {
    const length = readUInt32(this.readBytes(4), 0)

    if (length < 0) {
      throw new Error(`Bad chunk length ${0xffffffff & length}`)
    }

    const type = bufferToString(this.readBytes(4))
    const chunk: Bytes = this.readBytes(length)
    this.readBytes(4) // let crc = this.readBytes(4)

    switch (type) {
      case 'IHDR':
        this.decodeIHDR(chunk)
        break
      case 'PLTE':
        this.decodePLTE(chunk)
        break
      case 'IDAT':
        this.decodeIDAT(chunk)
        break
      case 'IEND':
        // this.decodeIEND()
        break
    }

    return type
  }

  /**
   * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IHDR
   * http://www.libpng.org/pub/png/spec/1.2/png-1.2-pdg.html#C.IHDR
   *
   * Width               4 bytes
   * Height              4 bytes
   * Bit depth           1 byte
   * Colour type         1 byte
   * Compression method  1 byte
   * Filter method       1 byte
   * Interlace method    1 byte
   */
  public decodeIHDR(chunk: Bytes) {
    const png = this.png

    png.setWidth(readUInt32(chunk, 0))
    png.setHeight(readUInt32(chunk, 4))
    png.setBitDepth(readUInt8(chunk, 8))
    png.setColorType(readUInt8(chunk, 9))
    png.setCompressionMethod(readUInt8(chunk, 10))
    png.setFilterMethod(readUInt8(chunk, 11))
    png.setInterlaceMethod(readUInt8(chunk, 12))
  }

  /**
   *
   * http://www.w3.org/TR/PNG/#11PLTE
   */
  public decodePLTE(chunk: Bytes) {
    this.png.setPalette(chunk)
  }

  /**
   * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IDAT
   */
  public decodeIDAT(chunk: Bytes) {
    // multiple IDAT chunks will concatenated
    this.dataChunks.push(chunk)
  }

  /**
   * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IEND
   */
  // public decodeIEND() {}

  /**
   * Uncompress IDAT chunks
   */
  public decodePixels(callback: any) {
    const png = this.png
    let length = 0
    for (let l = this.dataChunks.length; l--; )
      length += this.dataChunks[l].length
    const data: Buffer = new Buffer(length)
    for (let i = 0, k = 0, l = this.dataChunks.length; i < l; i++) {
      const chunk: Bytes = this.dataChunks[i]
      for (let j = 0; j < chunk.length; j++) data[k++] = chunk[j]
    }
    zlib.inflate(data, (err, data) => {
      if (err) return callback(err)
      try {
        if (png.interlaceMethod === 0) {
          this.interlaceNone(data)
        } else {
          this.interlaceAdam7(data)
        }
      } catch (e) {
        return callback(e)
      }

      callback()
    })
  }

  // Different interlace methods

  public interlaceNone(data: Bytes) {
    // bytes per pixel
    const bpp = Math.max(1, (this.png.colors * this.png.bitDepth) / 8)

    // color bytes per row
    const cpr = bpp * this.png.width

    const pixels: Buffer = new Buffer(bpp * this.png.width * this.png.height)
    let offset = 0

    for (let i = 0; i < data.length; i += cpr + 1) {
      const scanline = slice.call(data, i + 1, i + cpr + 1)

      switch (readUInt8(data, i)) {
        case 0:
          this.unFilterNone(scanline, pixels, bpp, offset, cpr)
          break
        case 1:
          this.unFilterSub(scanline, pixels, bpp, offset, cpr)
          break
        case 2:
          this.unFilterUp(scanline, pixels, bpp, offset, cpr)
          break
        case 3:
          this.unFilterAverage(scanline, pixels, bpp, offset, cpr)
          break
        case 4:
          this.unFilterPaeth(scanline, pixels, bpp, offset, cpr)
          break
        default:
          throw new Error('unkown filtered scanline')
      }

      offset += cpr
    }

    this.png.pixels = pixels
  }

  // TODO:
  public interlaceAdam7(data: Buffer) {
    throw new Error('Adam7 interlacing is not implemented yet')
  }

  // Unfiltering

  /**
   * No filtering, direct copy
   */
  public unFilterNone(
    scanline: Bytes,
    pixels: Bytes,
    bpp: number,
    of: number,
    length: number
  ): void {
    for (let i = 0, to = length; i < to; i++) {
      pixels[of + i] = scanline[i]
    }
  }

  /**
   * The Sub() filter transmits the difference between each byte and the value
   * of the corresponding byte of the prior pixel.
   * Sub(x) = Raw(x) + Raw(x - bpp)
   */
  public unFilterSub(
    scanline: Bytes,
    pixels: Bytes,
    bpp: number,
    of: number,
    length: number
  ): void {
    let i = 0
    for (; i < bpp; i++) pixels[of + i] = scanline[i]
    for (; i < length; i++) {
      // Raw(x) + Raw(x - bpp)
      pixels[of + i] = (scanline[i] + pixels[of + i - bpp]) & 0xff
    }
  }

  /**
   * The Up() filter is just like the Sub() filter except that the pixel
   * immediately above the current pixel, rather than just to its left, is used
   * as the predictor.
   * Up(x) = Raw(x) + Prior(x)
   */
  public unFilterUp(
    scanline: Bytes,
    pixels: Bytes,
    bpp: number,
    of: number,
    length: number
  ): void {
    let i = 0
    // Prior(x) is 0 for all x on the first scanline
    if (of - length < 0)
      for (; i < length; i++) {
        pixels[of + i] = scanline[i]
      }
    else
      for (; i < length; i++) {
        // Raw(x)
        const byte = scanline[i]
        // Prior(x)
        const prev = pixels[of + i - length]
        pixels[of + i] = (byte + prev) & 0xff
      }
  }

  /**
   * The Average() filter uses the average of the two neighboring pixels (left
   * and above) to predict the value of a pixel.
   * Average(x) = Raw(x) + floor((Raw(x-bpp)+Prior(x))/2)
   */
  public unFilterAverage(
    scanline: Bytes,
    pixels: Bytes,
    bpp: number,
    of: number,
    length: number
  ): void {
    let i = 0
    if (of - length < 0) {
      // Prior(x) == 0 && Raw(x - bpp) == 0
      for (; i < bpp; i++) {
        pixels[of + i] = scanline[i]
      }
      // Prior(x) == 0 && Raw(x - bpp) != 0 (right shift, prevent doubles)
      for (; i < length; i++) {
        pixels[of + i] = (scanline[i] + (pixels[of + i - bpp] >> 1)) & 0xff
      }
    } else {
      // Prior(x) != 0 && Raw(x - bpp) == 0
      for (; i < bpp; i++) {
        pixels[of + i] = (scanline[i] + (pixels[of - length + i] >> 1)) & 0xff
      }
      // Prior(x) != 0 && Raw(x - bpp) != 0
      for (; i < length; i++) {
        const byte = scanline[i]
        const prev = pixels[of + i - bpp]
        const prior = pixels[of + i - length]
        pixels[of + i] = (byte + ((prev + prior) >> 1)) & 0xff
      }
    }
  }

  /**
   * The Paeth() filter computes a simple linear function of the three
   * neighboring pixels (left, above, upper left), then chooses as predictor
   * the neighboring pixel closest to the computed value. This technique is due
   * to Alan W. Paeth.
   * Paeth(x) = Raw(x) +
   *            PaethPredictor(Raw(x-bpp), Prior(x), Prior(x-bpp))
   *  function PaethPredictor (a, b, c)
   *  begin
   *       ; a = left, b = above, c = upper left
   *       p := a + b - c        ; initial estimate
   *       pa := abs(p - a)      ; distances to a, b, c
   *       pb := abs(p - b)
   *       pc := abs(p - c)
   *       ; return nearest of a,b,c,
   *       ; breaking ties in order a,b,c.
   *       if pa <= pb AND pa <= pc then return a
   *       else if pb <= pc then return b
   *       else return c
   *  end
   */
  public unFilterPaeth(
    scanline: Bytes,
    pixels: Bytes,
    bpp: number,
    of: number,
    length: number
  ): void {
    let i = 0
    if (of - length < 0) {
      // Prior(x) == 0 && Raw(x - bpp) == 0
      for (; i < bpp; i++) {
        pixels[of + i] = scanline[i]
      }
      // Prior(x) == 0 && Raw(x - bpp) != 0
      // paethPredictor(x, 0, 0) is always x
      for (; i < length; i++) {
        pixels[of + i] = (scanline[i] + pixels[of + i - bpp]) & 0xff
      }
    } else {
      // Prior(x) != 0 && Raw(x - bpp) == 0
      // paethPredictor(x, 0, 0) is always x
      for (; i < bpp; i++) {
        pixels[of + i] = (scanline[i] + pixels[of + i - length]) & 0xff
      }
      // Prior(x) != 0 && Raw(x - bpp) != 0
      for (; i < length; i++) {
        const raw = scanline[i]
        const a = pixels[of + i - bpp]
        const b = pixels[of + i - length]
        const c = pixels[of + i - length - bpp]
        const p = a + b - c
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - b)
        const pc = Math.abs(p - c)
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c
        pixels[of + i] = (raw + pr) & 0xff
      }
    }
  }

  /**
   * Parse the PNG file
   *
   * reader.parse(callback, options)
   *
   * OPTIONS:
   *    option  | type     | default
   *    ----------------------------
   *    data      boolean    true    should it read the pixel data
   */
  public parse(
    callback: (err: any, data?: any) => any,
    options: { data: boolean } = { data: true }
  ): void {
    try {
      this.decodeHeader()

      while (this.i < this.bytes.length) {
        const type = this.decodeChunk()
        // stop after IHDR chunk, or after IEND
        if (type == 'IEND') break
        if (type == 'IHDR' && options.data === false) break
      }
      this.decodePixels((err: any) => {
        callback(err, this.png)
      })
    } catch (e) {
      callback(e)
    }
  }
}
