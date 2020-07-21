import { Rgba } from './palette'
import { convertRGBAImage } from './utils/convertRGBAImage'
import { Svg, Path, Command } from '@svg-drawing/core'

type Layer = number[][]
// Edge node types ( ▓: this layer or 1; ░: not this layer or 0 )
// 12    ░░  ▓░  ░▓  ▓▓  ░░  ▓░  ░▓  ▓▓  ░░  ▓░  ░▓  ▓▓  ░░  ▓░  ░▓  ▓▓
// 48    ░░  ░░  ░░  ░░  ░▓  ░▓  ░▓  ░▓  ▓░  ▓░  ▓░  ▓░  ▓▓  ▓▓  ▓▓  ▓▓
// Type  0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15
type EdgeType =
  | -1 // Empty
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
type EdgeLayer = EdgeType[][]

interface SmartPath {
  commands: Command[]
  boundingbox: [number, number, number, number]
  holechildren: number[]
  isholepath: boolean
}
interface PointInfo {
  points: Point[]
  boundingbox: [number, number, number, number]
  holechildren: number[]
  isholepath: boolean
}
interface TraceData {
  layers: SmartPath[][]
  palette: Rgba[]
  width: number
  height: number
}

type DirectionValue = typeof DIRECTION_TYPE[keyof typeof DIRECTION_TYPE]
const DIRECTION_TYPE = {
  RIGHT: 0,
  RIGHT_BOTTOM: 1,
  BOTTOM: 2,
  LEFT_BOTTOM: 3,
  LEFT: 4,
  LEFT_TOP: 5,
  TOP: 6,
  RIGHT_TOP: 7,
  CENTER: 8,
  EMPTY: -1,
} as const
interface Point {
  x: number
  y: number
  direction: DirectionValue
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

const pathscanCombinedLookup: EdgeType[][][] = [
  [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ], // arr[py][px]===0 is invalid
  [
    [0, 1, 0, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [0, 2, -1, 0],
  ],
  [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [0, 1, 0, -1],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 1, 0],
    [-1, -1, -1, -1],
    [0, 2, -1, 0],
    [-1, -1, -1, -1],
  ],

  [
    [-1, -1, -1, -1],
    [0, 0, 1, 0],
    [0, 3, 0, 1],
    [-1, -1, -1, -1],
  ],
  [
    [13, 3, 0, 1],
    [13, 2, -1, 0],
    [7, 1, 0, -1],
    [7, 0, 1, 0],
  ],
  [
    [-1, -1, -1, -1],
    [0, 1, 0, -1],
    [-1, -1, -1, -1],
    [0, 3, 0, 1],
  ],
  [
    [0, 3, 0, 1],
    [0, 2, -1, 0],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ],

  [
    [0, 3, 0, 1],
    [0, 2, -1, 0],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ],
  [
    [-1, -1, -1, -1],
    [0, 1, 0, -1],
    [-1, -1, -1, -1],
    [0, 3, 0, 1],
  ],
  [
    [11, 1, 0, -1],
    [14, 0, 1, 0],
    [14, 3, 0, 1],
    [11, 2, -1, 0],
  ],
  [
    [-1, -1, -1, -1],
    [0, 0, 1, 0],
    [0, 3, 0, 1],
    [-1, -1, -1, -1],
  ],

  [
    [0, 0, 1, 0],
    [-1, -1, -1, -1],
    [0, 2, -1, 0],
    [-1, -1, -1, -1],
  ],
  [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [0, 1, 0, -1],
    [0, 0, 1, 0],
  ],
  [
    [0, 1, 0, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [0, 2, -1, 0],
  ],
  [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ], // arr[py][px]===15 is invalid
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
  public palettes: Rgba[]
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
    this.palettes = palette
  }

  // Tracing imagedata, then returning the scaled svg string
  public fromImgData(argImgd: ImageData): SVGSVGElement {
    // imgd.data must be RGBA, not just RGB
    const imgd = convertRGBAImage(argImgd)

    // 1. Color quantization
    const layer = this.colorQuantization(imgd)

    // // create tracedata object
    const layers: SmartPath[][] = []

    for (let paletteId = 0; paletteId < this.palettes.length; paletteId++) {
      // 2. Layer separation and edge detection
      const edge = this.layeringstep(layer, paletteId)

      // 3. pathscan
      const path = this.pathscan(edge)

      // 4. interpollation
      const interporation = this.internodes(path)

      // 5. TracedPath
      const tracedpath = interporation.map((p) => this.tracepath(p))
      // adding traced layer
      layers.push(tracedpath)
    }
    return this.traceDataToSVGElement({
      layers,
      palette: this.palettes,
      width: layer[0].length - 2,
      height: layer.length - 2,
    })
  }

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
          a: imgd.data[idx + 3],
        })
      })
    )
  }

  /**
   * Find similar color from palette and return ID
   * @param {Rgba} color pixel color
   */
  private _findPaletteIndex({ r, g, b, a }: Rgba): number {
    let cdl = 1024 // 4 * 256 is the maximum RGBA distance
    return this.palettes.reduce((findId, pal, id) => {
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
  public layeringstep(layer: Layer, palId: number): EdgeLayer {
    // Creating layers for each indexed color in arr
    const res: EdgeLayer = []
    const ah = layer.length
    const aw = layer[0].length

    // Looping through all pixels and calculating edge node type
    for (let h = 0; h < ah; h++) {
      res[h] = []
      for (let w = 0; w < aw; w++) {
        res[h][w] =
          h === 0 || w === 0
            ? 0
            : (((layer[h - 1][w - 1] === palId ? 1 : 0) +
                (layer[h - 1][w] === palId ? 2 : 0) +
                (layer[h][w - 1] === palId ? 8 : 0) +
                (layer[h][w] === palId ? 4 : 0)) as EdgeType)
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
  public pathscan(layer: EdgeLayer): PointInfo[] {
    const width = layer[0].length
    const height = layer.length
    const paths: PointInfo[] = []
    let pacnt = 0

    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const edgeType = layer[h][w]
        // Other values are not valid
        if (edgeType !== 4 && edgeType !== 11) {
          continue
        }
        // Init
        let px = w
        let py = h
        let dir = 1
        let pcnt = 0
        let pathfinished = false
        paths[pacnt] = {
          points: [],
          boundingbox: [px, py, px, py],
          holechildren: [],
          isholepath: false,
        }

        // Path points loop
        while (!pathfinished) {
          // New path point
          paths[pacnt].points[pcnt] = {
            x: px - 1,
            y: py - 1,
            direction: DIRECTION_TYPE.EMPTY,
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
          const lookuprow = pathscanCombinedLookup[layer[py][px]][dir]
          layer[py][px] = lookuprow[0]
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
              if (edgeType === 11) {
                paths[pacnt].isholepath = true
                let parentidx = 0
                let parentbbox = [-1, -1, width + 1, height + 1]
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

  // 4. interpollating between path points for nodes with 8 directions
  public internodes(paths: PointInfo[]): PointInfo[] {
    const ins: PointInfo[] = []
    let nextidx = 0
    let nextidx2 = 0
    let previdx = 0
    let previdx2 = 0

    for (let pacnt = 0; pacnt < paths.length; pacnt++) {
      ins[pacnt] = {
        points: [],
        boundingbox: paths[pacnt].boundingbox,
        holechildren: paths[pacnt].holechildren,
        isholepath: paths[pacnt].isholepath,
      }
      const palen = paths[pacnt].points.length

      // pathpoints loop
      for (let pcnt = 0; pcnt < palen; pcnt++) {
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
            ].direction = this._getdirection(
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
            direction: this._getdirection(
              paths[pacnt].points[pcnt].x,
              paths[pacnt].points[pcnt].y,
              (paths[pacnt].points[pcnt].x + paths[pacnt].points[nextidx].x) /
                2,
              (paths[pacnt].points[pcnt].y + paths[pacnt].points[nextidx].y) / 2
            ),
          })
        }

        // interpolate between two path points
        ins[pacnt].points.push({
          x: (paths[pacnt].points[pcnt].x + paths[pacnt].points[nextidx].x) / 2,
          y: (paths[pacnt].points[pcnt].y + paths[pacnt].points[nextidx].y) / 2,
          direction: this._getdirection(
            paths[pacnt].points[pcnt].x + paths[pacnt].points[nextidx].x,
            paths[pacnt].points[pcnt].y + paths[pacnt].points[nextidx].y,
            paths[pacnt].points[nextidx].x + paths[pacnt].points[nextidx2].x,
            paths[pacnt].points[nextidx].y + paths[pacnt].points[nextidx2].y
          ),
        })
      }
    }

    return ins
  }

  private _testrightangle(
    path: PointInfo,
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

  private _getdirection(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): DirectionValue {
    if (x1 < x2) {
      if (y1 < y2) {
        return DIRECTION_TYPE.RIGHT_BOTTOM
      }
      if (y1 > y2) {
        return DIRECTION_TYPE.RIGHT_TOP
      }
      return DIRECTION_TYPE.RIGHT_TOP
    }
    if (x1 > x2) {
      if (y1 < y2) {
        return DIRECTION_TYPE.LEFT_BOTTOM
      }
      if (y1 > y2) {
        return DIRECTION_TYPE.LEFT_TOP
      }
      return DIRECTION_TYPE.LEFT
    }

    if (y1 < y2) {
      return DIRECTION_TYPE.BOTTOM
    }
    if (y1 > y2) {
      return DIRECTION_TYPE.TOP
    }
    return DIRECTION_TYPE.CENTER
  }

  // 5. tracepath() : recursively trying to fit straight and quadratic spline segments on the 8 direction internode path

  // 5.1. Find sequences of points with only 2 segment types
  // 5.2. Fit a straight line on the sequence
  // 5.3. If the straight line fails (distance error > ltres), find the point with the biggest error
  // 5.4. Fit a quadratic spline through errorpoint (project this to get controlpoint), then measure errors on every point in the sequence
  // 5.5. If the spline fails (distance error > qtres), find the point with the biggest error, set splitpoint = fitting point
  // 5.6. Split sequence and recursively apply 5.2. - 5.6. to startpoint-splitpoint and splitpoint-endpoint sequences

  public tracepath(path: PointInfo): SmartPath {
    let pcnt = 0
    const commands: Command[] = []
    while (pcnt < path.points.length) {
      // 5.1. Find sequences of points with only 2 segment types
      const segtype1: DirectionValue = path.points[pcnt].direction
      let segtype2: DirectionValue = DIRECTION_TYPE.EMPTY
      let seqend = pcnt + 1
      while (
        (path.points[seqend].direction === segtype1 ||
          path.points[seqend].direction === segtype2 ||
          segtype2 === -1) &&
        seqend < path.points.length - 1
      ) {
        if (
          path.points[seqend].direction !== segtype1 &&
          segtype2 === DIRECTION_TYPE.EMPTY
        ) {
          segtype2 = path.points[seqend].direction || DIRECTION_TYPE.RIGHT
        }
        seqend++
      }
      if (seqend === path.points.length - 1) {
        commands.push(...this.fitseq(path, pcnt, 0))
        pcnt = path.points.length
      } else {
        commands.push(...this.fitseq(path, pcnt, seqend))
        pcnt = seqend
      }

      // 5.2. - 5.6. Split sequence and recursively apply 5.2. - 5.6. to startpoint-splitpoint and splitpoint-endpoint sequences
    }

    return {
      commands,
      boundingbox: path.boundingbox,
      holechildren: path.holechildren,
      isholepath: path.isholepath,
    }
  }

  // 5.2. - 5.6. recursively fitting a straight or quadratic line segment on this sequence of path nodes,
  // called from tracepath()
  public fitseq(path: PointInfo, seqstart: number, seqend: number): Command[] {
    const ltres = this.ltres
    const qtres = this.qtres
    // return if invalid seqend
    if (seqend > path.points.length || seqend < 0) {
      return []
    }
    // letiables
    let errorpoint = seqstart
    let errorval = 0
    let curvepass = true
    let px
    let py
    let dist2
    let tl = seqend - seqstart
    if (tl < 0) {
      tl += path.points.length
    }
    const vx = (path.points[seqend].x - path.points[seqstart].x) / tl
    const vy = (path.points[seqend].y - path.points[seqstart].y) / tl

    // 5.2. Fit a straight line on the sequence
    let pcnt = (seqstart + 1) % path.points.length
    while (pcnt != seqend) {
      let pl = pcnt - seqstart
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
        new Command('L', [
          path.points[seqstart].x,
          path.points[seqstart].y,
          path.points[seqend].x,
          path.points[seqend].y,
        ]),
      ]
    }

    // 5.3. If the straight line fails (distance error>ltres), find the point with the biggest error
    const fitpoint = errorpoint
    curvepass = true
    errorval = 0

    // 5.4. Fit a quadratic spline through this point, measure errors on every point in the sequence
    // helpers and projecting to get control point
    let t = (fitpoint - seqstart) / tl
    let t1 = (1 - t) * (1 - t)
    let t2 = 2 * (1 - t) * t
    let t3 = t * t
    const cpx =
      (t1 * path.points[seqstart].x +
        t3 * path.points[seqend].x -
        path.points[fitpoint].x) /
      -t2
    const cpy =
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
        new Command('Q', [
          path.points[seqstart].x,
          path.points[seqstart].y,
          cpx,
          cpy,
          path.points[seqend].x,
          path.points[seqend].y,
        ]),
      ]
    }
    // 5.5. If the spline fails (distance error>qtres), find the point with the biggest error
    const splitpoint = fitpoint // Earlier: Math.floor((fitpoint + errorpoint)/2);

    // 5.6. Split sequence and recursively apply 5.2. - 5.6. to startpoint-splitpoint and splitpoint-endpoint sequences
    return this.fitseq(path, seqstart, splitpoint).concat(
      this.fitseq(path, splitpoint, seqend)
    )
  }

  // Rounding to given decimals https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
  private _toDecimal(val: number): number {
    if (this.decimalPlace < 0) return val
    return +val.toFixed(this.decimalPlace)
  }

  // Getting SVG path element string from a traced path
  public commandToString(commands: Command[]): string {
    let str = ''

    // Creating non-hole path string
    str += `M ${commands[0].value
      .slice(0, 2)
      .map((p) => this._toDecimal(p * this.scale))
      .join(' ')} `
    for (let pcnt = 0; pcnt < commands.length; pcnt++) {
      const segm = commands[pcnt]
      str += `${segm.type} ${segm.value
        .slice(2)
        .map((p) => this._toDecimal(p * this.scale))
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
      const commands = layer[smp.holechildren[hcnt]].commands
      const startIndex = commands.length - 1
      str += `M ${commands[startIndex].value
        .slice(
          commands[startIndex].value.length - 2,
          commands[startIndex].value.length
        )
        .map((p) => this._toDecimal(p * this.scale))
        .join(' ')} `

      for (let pcnt = startIndex; pcnt >= 0; pcnt--) {
        const segm = commands[pcnt]
        str += `${segm.type} `
        if (segm.value.length > 4) {
          str += `${segm.value
            .slice(2, 4)
            .map((p) => this._toDecimal(p * this.scale))
            .join(' ')} `
        }
        str += `${segm.value
          .slice(0, 2)
          .map((p) => this._toDecimal(p * this.scale))
          .join(' ')} `
      }

      str += 'Z '
    }
    return str
  }

  // Converting tracedata to an SVG string
  public traceDataToSVGElement({
    width,
    height,
    layers,
    palette,
  }: TraceData): SVGSVGElement {
    const svg = new Svg({
      width: width * this.scale,
      height: height * this.scale,
    })
    for (let lcnt = 0; lcnt < layers.length; lcnt++) {
      for (let pcnt = 0; pcnt < layers[lcnt].length; pcnt++) {
        const layer = layers[lcnt]
        const smp = layer[pcnt]
        if (!smp.isholepath) {
          // Line filter
          if (this.linefilter && smp.commands.length < 3) continue
          let d = this.commandToString(smp.commands)
          if (d) {
            d += this.complementCommandToString(layer, pcnt)
            const rgba = palette[lcnt]
            const color = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
            const path = new Path({
              stroke: color,
              fill: color,
              strokeWidth: this.strokewidth + '',
              opacity: String(rgba.a / 255.0),
            })
            path.parseCommandString(d)
            svg.addPath(path)
          }
        }
      }
    }

    return svg.toElement()
  }
}
