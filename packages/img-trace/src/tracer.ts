import { Rgba } from './palette'
import { convertRGBAImage } from './utils/convertRGBAImage'
type Layer = number[][]
// TODO
interface Command {
  type: 'Q' | 'L'
  points: number[]
}

interface SmartPath {
  segments: Command[]
  boundingbox: [number, number, number, number]
  holechildren: number[]
  isholepath?: boolean
}
interface Path {
  points: Point[]
  boundingbox: [number, number, number, number]
  holechildren: number[]
  isholepath?: boolean
}
interface TraceData {
  layers: SmartPath[][]
  palette: Rgba[]
  width: number
  height: number
}

interface Point {
  x: number
  y: number
  t?: number
  linesegment?: number
}

export interface TracerOption {
  // Tracing
  ltres?: number
  qtres?: number
  pathomit?: number
  rightangleenhance?: boolean

  // SVG rendering
  strokewidth?: number
  linefilter?: boolean
  scale?: number
  decimalPlace?: number
  viewbox?: boolean
  desc?: boolean
  lcpr?: number
  qcpr?: number
}

const pathscanCombinedLookup: number[][][] = [
  [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
  ], // arr[py][px]===0 is invalid
  [
    [0, 1, 0, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [0, 2, -1, 0]
  ],
  [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [0, 1, 0, -1],
    [0, 0, 1, 0]
  ],
  [
    [0, 0, 1, 0],
    [-1, -1, -1, -1],
    [0, 2, -1, 0],
    [-1, -1, -1, -1]
  ],

  [
    [-1, -1, -1, -1],
    [0, 0, 1, 0],
    [0, 3, 0, 1],
    [-1, -1, -1, -1]
  ],
  [
    [13, 3, 0, 1],
    [13, 2, -1, 0],
    [7, 1, 0, -1],
    [7, 0, 1, 0]
  ],
  [
    [-1, -1, -1, -1],
    [0, 1, 0, -1],
    [-1, -1, -1, -1],
    [0, 3, 0, 1]
  ],
  [
    [0, 3, 0, 1],
    [0, 2, -1, 0],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
  ],

  [
    [0, 3, 0, 1],
    [0, 2, -1, 0],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
  ],
  [
    [-1, -1, -1, -1],
    [0, 1, 0, -1],
    [-1, -1, -1, -1],
    [0, 3, 0, 1]
  ],
  [
    [11, 1, 0, -1],
    [14, 0, 1, 0],
    [14, 3, 0, 1],
    [11, 2, -1, 0]
  ],
  [
    [-1, -1, -1, -1],
    [0, 0, 1, 0],
    [0, 3, 0, 1],
    [-1, -1, -1, -1]
  ],

  [
    [0, 0, 1, 0],
    [-1, -1, -1, -1],
    [0, 2, -1, 0],
    [-1, -1, -1, -1]
  ],
  [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [0, 1, 0, -1],
    [0, 0, 1, 0]
  ],
  [
    [0, 1, 0, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [0, 2, -1, 0]
  ],
  [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
  ] // arr[py][px]===15 is invalid
]

export class Tracer {
  // Tracing
  public ltres: number
  public qtres: number
  public pathomit: number
  public rightangleenhance: boolean

  // SVG rendering
  public strokewidth: number
  public linefilter: boolean
  public scale: number
  public decimalPlace: number

  // pallets
  public palette: Rgba[]
  // creating options object, setting defaults for missing values
  constructor(palette: Rgba[], opts: TracerOption = {}) {
    // Tracing
    this.ltres = opts.ltres ?? 1
    this.qtres = opts.qtres ?? 1
    this.pathomit = opts.pathomit ?? 8
    this.rightangleenhance = opts.rightangleenhance ?? true

    // SVG rendering
    this.strokewidth = opts.strokewidth ?? 1
    this.linefilter = opts.linefilter ?? false
    this.scale = opts.scale ?? 1
    this.decimalPlace = opts.decimalPlace ?? 1

    // Custom Palette
    this.palette = palette
  }

  // Tracing imagedata, then returning the scaled svg string
  public imageToSVG(imgd: ImageData): SVGSVGElement {
    const traceData = this.imageToTrace(imgd)
    // returning SVG string
    return this.traceDataToSVGElement(traceData)
  }

  // Tracing imagedata, then returning tracedata (layers with paths, palette, image size)
  public imageToTrace(argImgd: ImageData): TraceData {
    // imgd.data must be RGBA, not just RGB
    const imgd = convertRGBAImage(argImgd)

    // 1. Color quantization
    const layer = this.colorQuantization(imgd)

    // // create tracedata object
    const layers: SmartPath[][] = []

    for (let colornum = 0; colornum < this.palette.length; colornum++) {
      // 2. Layer separation and edge detection
      const edge = this.layeringstep(layer, colornum)

      // 3. pathscan
      const path = this.pathscan(edge)

      // 4. interpollation
      const interporation = this.internodes(path)

      // 5. TracedPath
      const tracedlayer = this.createTracePath(interporation)

      // adding traced layer
      layers.push(tracedlayer)
    } // End of color loop
    return {
      layers,
      palette: this.palette,
      width: layer[0].length - 2,
      height: layer.length - 2
    }
  }

  ////////////////////////////////////////////////////////////
  //
  //  Vectorizing functions
  //
  ////////////////////////////////////////////////////////////

  // 1. Color quantization
  public colorQuantization(imgd: ImageData): Layer {
    return Array.from({ length: imgd.height + 2 }, (_h, j) =>
      Array.from({ length: imgd.width + 2 }, (_w, i) => {
        if (
          i === 0 ||
          i === imgd.width + 1 ||
          j === 0 ||
          j === imgd.height + 1
        ) {
          return -1
        }
        // pixel index
        const h = j - 1
        const w = i - 1
        const idx = (h * imgd.width + w) * 4
        // update the indexed color array
        return this._findPaletteIndex({
          r: imgd.data[idx],
          g: imgd.data[idx + 1],
          b: imgd.data[idx + 2],
          a: imgd.data[idx + 3]
        })
      })
    )
  }

  private _findPaletteIndex({ r, g, b, a }: Rgba) {
    let cdl = 1024 // 4 * 256 is the maximum RGBA distance
    return this.palette.reduce((findId, pal, id) => {
      const cd =
        Math.abs(pal.r - r) +
        Math.abs(pal.g - g) +
        Math.abs(pal.b - b) +
        Math.abs(pal.a - a)
      if (cd < cdl) {
        cdl = cd
        return id
      }
      return findId
    }, 0)
  }

  // 2. Layer separation and edge detection
  // Edge node types ( ▓: this layer or 1; ░: not this layer or 0 )
  // 12  ░░  ▓░  ░▓  ▓▓  ░░  ▓░  ░▓  ▓▓  ░░  ▓░  ░▓  ▓▓  ░░  ▓░  ░▓  ▓▓
  // 48  ░░  ░░  ░░  ░░  ░▓  ░▓  ░▓  ░▓  ▓░  ▓░  ▓░  ▓░  ▓▓  ▓▓  ▓▓  ▓▓
  //     0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15
  public layeringstep(layer: Layer, cnum: number): Layer {
    // Creating layers for each indexed color in arr
    const res: Layer = []
    const ah = layer.length
    const aw = layer[0].length

    // Looping through all pixels and calculating edge node type
    for (let h = 0; h < ah; h++) {
      res[h] = []
      for (let w = 0; w < aw; w++) {
        res[h][w] =
          h === 0 || w === 0
            ? 0
            : (layer[h - 1][w - 1] === cnum ? 1 : 0) +
              (layer[h - 1][w] === cnum ? 2 : 0) +
              (layer[h][w - 1] === cnum ? 8 : 0) +
              (layer[h][w] === cnum ? 4 : 0)
      }
    }

    return res
  }

  // Point in polygon test
  private _pointpoly(p: Point, pa: Point[]): boolean {
    let isin = false

    for (let i = 0, j = pa.length - 1; i < pa.length; j = i++) {
      isin =
        pa[i].y > p.y !== pa[j].y > p.y &&
        p.x <
          ((pa[j].x - pa[i].x) * (p.y - pa[i].y)) / (pa[j].y - pa[i].y) +
            pa[i].x
          ? !isin
          : isin
    }

    return isin
  }

  // 3. Walking through an edge node layer, discarding edge node types 0 and 15 and creating paths from the rest.
  // Walk directions (dir): 0 > ; 1 ^ ; 2 < ; 3 v
  public pathscan(arr: Layer): Path[] {
    const width = arr[0].length
    const height = arr.length
    const paths: Path[] = []
    let pacnt = 0

    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        // Other values are not valid
        if (arr[h][w] !== 4 && arr[h][w] !== 11) {
          continue
        }
        // Init
        const holepath = arr[h][w] === 11
        let px = w
        let py = h
        let dir = 1
        let pcnt = 0
        let pathfinished = false
        paths[pacnt] = {
          points: [],
          boundingbox: [px, py, px, py],
          holechildren: []
        }

        // Path points loop
        while (!pathfinished) {
          // New path point
          paths[pacnt].points[pcnt] = {
            x: px - 1,
            y: py - 1,
            t: arr[py][px]
          }
          // Bounding box
          if (px - 1 < paths[pacnt].boundingbox[0]) {
            paths[pacnt].boundingbox[0] = px - 1
          }
          if (px - 1 > paths[pacnt].boundingbox[2]) {
            paths[pacnt].boundingbox[2] = px - 1
          }
          if (py - 1 < paths[pacnt].boundingbox[1]) {
            paths[pacnt].boundingbox[1] = py - 1
          }
          if (py - 1 > paths[pacnt].boundingbox[3]) {
            paths[pacnt].boundingbox[3] = py - 1
          }

          // Next: look up the replacement, direction and coordinate changes = clear this cell, turn if required, walk forward
          const lookuprow = pathscanCombinedLookup[arr[py][px]][dir]
          arr[py][px] = lookuprow[0]
          dir = lookuprow[1]
          px += lookuprow[2]
          py += lookuprow[3]

          // Close path
          if (
            px - 1 === paths[pacnt].points[0].x &&
            py - 1 === paths[pacnt].points[0].y
          ) {
            pathfinished = true

            // Discarding paths shorter than pathomit
            if (paths[pacnt].points.length < this.pathomit) {
              paths.pop()
            } else {
              paths[pacnt].isholepath = holepath ? true : false

              // Finding the parent shape for this hole
              if (holepath) {
                let parentidx = 0,
                  parentbbox = [-1, -1, width + 1, height + 1]
                for (let parentcnt = 0; parentcnt < pacnt; parentcnt++) {
                  if (
                    !paths[parentcnt].isholepath &&
                    this._boundingboxincludes(
                      paths[parentcnt].boundingbox,
                      paths[pacnt].boundingbox
                    ) &&
                    this._boundingboxincludes(
                      parentbbox,
                      paths[parentcnt].boundingbox
                    ) &&
                    this._pointpoly(
                      paths[pacnt].points[0],
                      paths[parentcnt].points
                    )
                  ) {
                    parentidx = parentcnt
                    parentbbox = paths[parentcnt].boundingbox
                  }
                }

                paths[parentidx].holechildren.push(pacnt)
              }

              pacnt++
            }
          }

          pcnt++
        }
      }
    }

    return paths
  }

  private _boundingboxincludes(
    parentbbox: number[],
    childbbox: number[]
  ): boolean {
    return (
      parentbbox[0] < childbbox[0] &&
      parentbbox[1] < childbbox[1] &&
      parentbbox[2] > childbbox[2] &&
      parentbbox[3] > childbbox[3]
    )
  }

  // 4. interpollating between path points for nodes with 8 directions ( East, SouthEast, S, SW, W, NW, N, NE )
  public internodes(paths: Path[]): Path[] {
    const ins: Path[] = []
    let nextidx = 0,
      nextidx2 = 0,
      previdx = 0,
      previdx2 = 0,
      pacnt,
      pcnt

    // paths loop
    for (pacnt = 0; pacnt < paths.length; pacnt++) {
      ins[pacnt] = {
        points: [],
        boundingbox: paths[pacnt].boundingbox,
        holechildren: paths[pacnt].holechildren,
        isholepath: paths[pacnt].isholepath
      }
      const palen = paths[pacnt].points.length

      // pathpoints loop
      for (pcnt = 0; pcnt < palen; pcnt++) {
        // next and previous point indexes
        nextidx = (pcnt + 1) % palen
        nextidx2 = (pcnt + 2) % palen
        previdx = (pcnt - 1 + palen) % palen
        previdx2 = (pcnt - 2 + palen) % palen

        // right angle enhance
        if (
          this.rightangleenhance &&
          this._testrightangle(
            paths[pacnt],
            previdx2,
            previdx,
            pcnt,
            nextidx,
            nextidx2
          )
        ) {
          // Fix previous direction
          if (ins[pacnt].points.length > 0) {
            ins[pacnt].points[
              ins[pacnt].points.length - 1
            ].linesegment = this._getdirection(
              ins[pacnt].points[ins[pacnt].points.length - 1].x,
              ins[pacnt].points[ins[pacnt].points.length - 1].y,
              paths[pacnt].points[pcnt].x,
              paths[pacnt].points[pcnt].y
            )
          }

          // This corner point
          ins[pacnt].points.push({
            x: paths[pacnt].points[pcnt].x,
            y: paths[pacnt].points[pcnt].y,
            linesegment: this._getdirection(
              paths[pacnt].points[pcnt].x,
              paths[pacnt].points[pcnt].y,
              (paths[pacnt].points[pcnt].x + paths[pacnt].points[nextidx].x) /
                2,
              (paths[pacnt].points[pcnt].y + paths[pacnt].points[nextidx].y) / 2
            )
          })
        } // End of right angle enhance

        // interpolate between two path points
        ins[pacnt].points.push({
          x: (paths[pacnt].points[pcnt].x + paths[pacnt].points[nextidx].x) / 2,
          y: (paths[pacnt].points[pcnt].y + paths[pacnt].points[nextidx].y) / 2,
          linesegment: this._getdirection(
            (paths[pacnt].points[pcnt].x + paths[pacnt].points[nextidx].x) / 2,
            (paths[pacnt].points[pcnt].y + paths[pacnt].points[nextidx].y) / 2,
            (paths[pacnt].points[nextidx].x + paths[pacnt].points[nextidx2].x) /
              2,
            (paths[pacnt].points[nextidx].y + paths[pacnt].points[nextidx2].y) /
              2
          )
        })
      } // End of pathpoints loop
    } // End of paths loop

    return ins
  }

  private _testrightangle(
    path: Path,
    idx1: number,
    idx2: number,
    idx3: number,
    idx4: number,
    idx5: number
  ): boolean {
    return (
      (path.points[idx3].x === path.points[idx1].x &&
        path.points[idx3].x === path.points[idx2].x &&
        path.points[idx3].y === path.points[idx4].y &&
        path.points[idx3].y === path.points[idx5].y) ||
      (path.points[idx3].y === path.points[idx1].y &&
        path.points[idx3].y === path.points[idx2].y &&
        path.points[idx3].x === path.points[idx4].x &&
        path.points[idx3].x === path.points[idx5].x)
    )
  }

  private _getdirection(x1: number, y1: number, x2: number, y2: number) {
    let val = 8
    if (x1 < x2) {
      if (y1 < y2) {
        val = 1
      } // SouthEast
      else if (y1 > y2) {
        val = 7
      } // NE
      else {
        val = 0
      } // E
    } else if (x1 > x2) {
      if (y1 < y2) {
        val = 3
      } // SW
      else if (y1 > y2) {
        val = 5
      } // NW
      else {
        val = 4
      } // W
    } else {
      if (y1 < y2) {
        val = 2
      } // S
      else if (y1 > y2) {
        val = 6
      } // N
      else {
        val = 8
      } // center, this should not happen
    }
    return val
  }

  // 5. tracepath() : recursively trying to fit straight and quadratic spline segments on the 8 direction internode path

  // 5.1. Find sequences of points with only 2 segment types
  // 5.2. Fit a straight line on the sequence
  // 5.3. If the straight line fails (distance error > ltres), find the point with the biggest error
  // 5.4. Fit a quadratic spline through errorpoint (project this to get controlpoint), then measure errors on every point in the sequence
  // 5.5. If the spline fails (distance error > qtres), find the point with the biggest error, set splitpoint = fitting point
  // 5.6. Split sequence and recursively apply 5.2. - 5.6. to startpoint-splitpoint and splitpoint-endpoint sequences

  public tracepath(path: Path): SmartPath {
    let pcnt = 0
    const segments: Command[] = []
    while (pcnt < path.points.length) {
      // 5.1. Find sequences of points with only 2 segment types
      const segtype1 = path.points[pcnt].linesegment
      let segtype2 = -1
      let seqend = pcnt + 1
      while (
        (path.points[seqend].linesegment === segtype1 ||
          path.points[seqend].linesegment === segtype2 ||
          segtype2 === -1) &&
        seqend < path.points.length - 1
      ) {
        if (path.points[seqend].linesegment !== segtype1 && segtype2 === -1) {
          // TODO: fix type
          segtype2 = path.points[seqend].linesegment || 0
        }
        seqend++
      }
      if (seqend === path.points.length - 1) {
        seqend = 0
      }

      // 5.2. - 5.6. Split sequence and recursively apply 5.2. - 5.6. to startpoint-splitpoint and splitpoint-endpoint sequences
      segments.push(...this.fitseq(path, pcnt, seqend))

      // forward pcnt;
      pcnt = seqend > 0 ? seqend : path.points.length
    } // End of pcnt loop

    return {
      segments,
      boundingbox: path.boundingbox,
      holechildren: path.holechildren,
      isholepath: path.isholepath
    }
  }

  // 5.2. - 5.6. recursively fitting a straight or quadratic line segment on this sequence of path nodes,
  // called from tracepath()
  public fitseq(path: Path, seqstart: number, seqend: number): Command[] {
    const ltres = this.ltres
    const qtres = this.qtres
    // return if invalid seqend
    if (seqend > path.points.length || seqend < 0) {
      return []
    }
    // letiables
    let errorpoint = seqstart,
      errorval = 0,
      curvepass = true,
      px,
      py,
      dist2
    let tl = seqend - seqstart
    if (tl < 0) {
      tl += path.points.length
    }
    const vx = (path.points[seqend].x - path.points[seqstart].x) / tl,
      vy = (path.points[seqend].y - path.points[seqstart].y) / tl

    // 5.2. Fit a straight line on the sequence
    let pcnt = (seqstart + 1) % path.points.length,
      pl
    while (pcnt != seqend) {
      pl = pcnt - seqstart
      if (pl < 0) {
        pl += path.points.length
      }
      px = path.points[seqstart].x + vx * pl
      py = path.points[seqstart].y + vy * pl
      dist2 =
        (path.points[pcnt].x - px) * (path.points[pcnt].x - px) +
        (path.points[pcnt].y - py) * (path.points[pcnt].y - py)
      if (dist2 > ltres) {
        curvepass = false
      }
      if (dist2 > errorval) {
        errorpoint = pcnt
        errorval = dist2
      }
      pcnt = (pcnt + 1) % path.points.length
    }
    // return straight line if fits
    if (curvepass) {
      return [
        {
          type: 'L',
          points: [
            path.points[seqstart].x,
            path.points[seqstart].y,
            path.points[seqend].x,
            path.points[seqend].y
          ]
        }
      ]
    }

    // 5.3. If the straight line fails (distance error>ltres), find the point with the biggest error
    const fitpoint = errorpoint
    curvepass = true
    errorval = 0

    // 5.4. Fit a quadratic spline through this point, measure errors on every point in the sequence
    // helpers and projecting to get control point
    let t = (fitpoint - seqstart) / tl,
      t1 = (1 - t) * (1 - t),
      t2 = 2 * (1 - t) * t,
      t3 = t * t
    const cpx =
        (t1 * path.points[seqstart].x +
          t3 * path.points[seqend].x -
          path.points[fitpoint].x) /
        -t2,
      cpy =
        (t1 * path.points[seqstart].y +
          t3 * path.points[seqend].y -
          path.points[fitpoint].y) /
        -t2

    // Check every point
    pcnt = seqstart + 1
    while (pcnt != seqend) {
      t = (pcnt - seqstart) / tl
      t1 = (1 - t) * (1 - t)
      t2 = 2 * (1 - t) * t
      t3 = t * t
      px = t1 * path.points[seqstart].x + t2 * cpx + t3 * path.points[seqend].x
      py = t1 * path.points[seqstart].y + t2 * cpy + t3 * path.points[seqend].y

      dist2 =
        (path.points[pcnt].x - px) * (path.points[pcnt].x - px) +
        (path.points[pcnt].y - py) * (path.points[pcnt].y - py)

      if (dist2 > qtres) {
        curvepass = false
      }
      if (dist2 > errorval) {
        errorpoint = pcnt
        errorval = dist2
      }
      pcnt = (pcnt + 1) % path.points.length
    }
    // return spline if fits
    if (curvepass) {
      return [
        {
          type: 'Q',
          points: [
            path.points[seqstart].x,
            path.points[seqstart].y,
            cpx,
            cpy,
            path.points[seqend].x,
            path.points[seqend].y
          ]
        }
      ]
    }
    // 5.5. If the spline fails (distance error>qtres), find the point with the biggest error
    const splitpoint = fitpoint // Earlier: Math.floor((fitpoint + errorpoint)/2);

    // 5.6. Split sequence and recursively apply 5.2. - 5.6. to startpoint-splitpoint and splitpoint-endpoint sequences
    return this.fitseq(path, seqstart, splitpoint).concat(
      this.fitseq(path, splitpoint, seqend)
    )
  }

  // 5. Batch tracing paths
  public createTracePath(internodepaths: Path[]): SmartPath[] {
    const btracedpaths: SmartPath[] = []
    for (const k in internodepaths) {
      btracedpaths.push(this.tracepath(internodepaths[k]))
    }
    return btracedpaths
  }

  ////////////////////////////////////////////////////////////
  //
  //  SVG Drawing functions
  //
  ////////////////////////////////////////////////////////////

  // Rounding to given decimals https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
  private _toDecimal(val: number): number {
    if (this.decimalPlace < 0) return val
    return +val.toFixed(this.decimalPlace)
  }

  // Getting SVG path element string from a traced path
  public commandToString(segments: Command[]): string {
    let str = ''

    // Creating non-hole path string
    str += `M ${segments[0].points
      .slice(0, 2)
      .map(p => this._toDecimal(p * this.scale))
      .join(' ')} `
    for (let pcnt = 0; pcnt < segments.length; pcnt++) {
      const segm = segments[pcnt]
      str += `${segm.type} ${segm.points
        .slice(2)
        .map(p => this._toDecimal(p * this.scale))
        .join(' ')} `
    }

    str += 'Z '
    return str
  }

  public complementCommandToString(
    layer: SmartPath[],
    layerIndex: number
  ): string {
    const smp = layer[layerIndex]
    let str = ''

    // Creating non-hole path string
    // Hole children
    for (let hcnt = 0; hcnt < smp.holechildren.length; hcnt++) {
      const segments = layer[smp.holechildren[hcnt]].segments
      const startIndex = segments.length - 1
      str += `M ${segments[startIndex].points
        .slice(
          segments[startIndex].points.length - 2,
          segments[startIndex].points.length
        )
        .map(p => this._toDecimal(p * this.scale))
        .join(' ')} `

      for (let pcnt = startIndex; pcnt >= 0; pcnt--) {
        const segm = segments[pcnt]
        str += `${segm.type} `
        if (segm.points.length > 4) {
          str += `${segm.points
            .slice(2, 4)
            .map(p => this._toDecimal(p * this.scale))
            .join(' ')} `
        }
        str += `${segm.points
          .slice(0, 2)
          .map(p => this._toDecimal(p * this.scale))
          .join(' ')} `
      }

      str += 'Z ' // Close path
    } // End of holepath check
    return str
  }

  // Converting tracedata to an SVG string
  public traceDataToSVGElement(tracedata: TraceData): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', `${tracedata.width * this.scale}`)
    svg.setAttribute('height', `${tracedata.height * this.scale}`)
    svg.setAttribute('version', '1.1')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    // Drawing: Layers and Paths loops
    for (let lcnt = 0; lcnt < tracedata.layers.length; lcnt++) {
      for (let pcnt = 0; pcnt < tracedata.layers[lcnt].length; pcnt++) {
        // Adding SVG <path> string
        const layer = tracedata.layers[lcnt]
        const smp = layer[pcnt]
        if (!smp.isholepath) {
          // Line filter
          if (this.linefilter && smp.segments.length < 3) continue
          let d = this.commandToString(smp.segments)
          if (d) {
            d += this.complementCommandToString(layer, pcnt)
            const rgba = tracedata.palette[lcnt]
            const color = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
            const path = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'path'
            )
            path.setAttribute('fill', color)
            path.setAttribute('stroke', color)
            path.setAttribute('stroke-width', `${this.strokewidth}`)
            path.setAttribute('opacity', `${rgba.a / 255.0}`)
            path.setAttribute('d', d)
            svg.appendChild(path)
          }
        }
      } // End of paths loop
    } // End of layers loop

    return svg
  }
}
