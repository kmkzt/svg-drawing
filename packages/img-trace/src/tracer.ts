import { Rgba } from './palette'
import { convertRGBAImage } from './utils/convertRGBAImage'
import { Svg, Path, Command, PathObject } from '@svg-drawing/core'

type ColorQuantization = number[][]
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

interface PathInfo {
  commands: Command[]
  holeCommands: Command[]
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
  pathLayer: PathInfo[][]
  palette: Rgba[]
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
  rightangleenhance?: boolean
  // filter
  pathOmit?: number
  commandOmit?: number
  // override path element attribute
  pathAttrs?: PathObject
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
  public pathOmit: number
  public commandOmit: number
  public rightangleenhance: boolean

  // Path element attribute
  public pathAttrs: PathObject

  // Palettes
  public palettes: Rgba[]

  // creating options object, setting defaults for missing values
  constructor(palette: Rgba[], opts: TracerOption = {}) {
    // Tracing
    this.ltres = opts.ltres ?? 1
    this.qtres = opts.qtres ?? 1
    this.rightangleenhance = opts.rightangleenhance ?? true

    // filterring
    this.pathOmit = opts.pathOmit ?? 8
    this.commandOmit = opts.commandOmit ?? 0

    // SVG rendering
    this.pathAttrs = { strokeWidth: '1', ...(opts.pathAttrs || {}) }

    // Palette
    this.palettes = palette
  }

  public fromImgData(argImgd: ImageData): SVGSVGElement {
    const imgd = convertRGBAImage(argImgd)
    const cq = this._colorQuantization(imgd)
    const pathLayer: PathInfo[][] = []
    for (let paletteId = 0; paletteId < this.palettes.length; paletteId++) {
      const edge = this._edgeDetection(cq, paletteId)
      const path = this._pathScan(edge)
      const interporation = this._interpolation(path)
      const tracedpath = interporation.map(this._tracePath.bind(this))
      pathLayer.push(tracedpath)
    }

    const svg = new Svg({
      width: cq[0].length - 2,
      height: cq.length - 2,
    }).addPath(
      this._traceDataToPath({
        pathLayer,
        palette: this.palettes,
      })
    )

    return svg.toElement()
  }

  private _colorQuantization(imgd: ImageData): ColorQuantization {
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

  private _edgeDetection(cq: ColorQuantization, palId: number): EdgeLayer {
    const res: EdgeLayer = []
    const ah = cq.length
    const aw = cq[0].length

    for (let h = 0; h < ah; h++) {
      res[h] = []
      for (let w = 0; w < aw; w++) {
        res[h][w] =
          h === 0 || w === 0
            ? 0
            : (((cq[h - 1][w - 1] === palId ? 1 : 0) +
                (cq[h - 1][w] === palId ? 2 : 0) +
                (cq[h][w - 1] === palId ? 8 : 0) +
                (cq[h][w] === palId ? 4 : 0)) as EdgeType)
      }
    }

    return res
  }

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

  private _pathScan(edge: EdgeLayer): PointInfo[] {
    const width = edge[0].length
    const height = edge.length
    const paths: PointInfo[] = []
    let pacnt = 0

    for (let h = 0; h < height; h++) {
      for (let w = 0; w < width; w++) {
        const edgeType = edge[h][w]
        if (edgeType !== 4 && edgeType !== 11) {
          // Related for edgeDetection methods
          continue
        }
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

        while (!pathfinished) {
          paths[pacnt].points[pcnt] = {
            x: px - 1,
            y: py - 1,
            direction: DIRECTION_TYPE.EMPTY,
          }

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

          const lookuprow = pathscanCombinedLookup[edge[py][px]][dir]
          edge[py][px] = lookuprow[0]
          dir = lookuprow[1]
          px += lookuprow[2]
          py += lookuprow[3]

          // Close path
          if (
            px - 1 === paths[pacnt].points[0].x &&
            py - 1 === paths[pacnt].points[0].y
          ) {
            pathfinished = true

            if (paths[pacnt].points.length < this.pathOmit) {
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
  private _interpolation(paths: PointInfo[]): PointInfo[] {
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

      for (let pcnt = 0; pcnt < palen; pcnt++) {
        nextidx = (pcnt + 1) % palen
        nextidx2 = (pcnt + 2) % palen
        previdx = (pcnt - 1 + palen) % palen
        previdx2 = (pcnt - 2 + palen) % palen

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

  private _tracePath(path: PointInfo): PathInfo {
    let pcnt = 0
    const comms: Command[] = []
    const holes: Command[] = []
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
        comms.push(...this._fitseq(path, pcnt, 0))
        holes.push(...this._fitseq(path, pcnt, 0, true))
        pcnt = path.points.length
      } else {
        comms.push(...this._fitseq(path, pcnt, seqend))
        holes.push(...this._fitseq(path, pcnt, seqend, true))
        pcnt = seqend
      }
    }

    const commands = [
      new Command('M', [path.points[0].x, path.points[0].y]),
      ...comms,
      new Command('Z'),
    ]
    holes.reverse()
    const holeCommands = [
      new Command('M', holes[holes.length - 1].value.slice(0, 2)),
      ...holes,
      new Command('Z'),
    ]
    return {
      commands,
      holeCommands,
      holechildren: path.holechildren,
      isholepath: path.isholepath,
    }
  }

  private _fitseq(
    path: PointInfo,
    seqstart: number,
    seqend: number,
    isHolePath?: boolean
  ): Command[] {
    const ltres = this.ltres
    const qtres = this.qtres
    if (seqend > path.points.length || seqend < 0) {
      return []
    }
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

    if (curvepass) {
      return [
        new Command(
          'L',
          isHolePath
            ? [path.points[seqstart].x, path.points[seqstart].y]
            : [path.points[seqend].x, path.points[seqend].y]
        ),
      ]
    }

    const fitpoint = errorpoint
    curvepass = true
    errorval = 0

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
    if (curvepass) {
      return [
        new Command('Q', [
          cpx,
          cpy,
          path.points[seqend].x,
          path.points[seqend].y,
        ]),
      ]
    }
    const splitpoint = fitpoint

    return this._fitseq(path, seqstart, splitpoint, isHolePath).concat(
      this._fitseq(path, splitpoint, seqend, isHolePath)
    )
  }

  private _complementCommand(info: PathInfo[], layerIndex: number): Command[] {
    const p = info[layerIndex]
    const complement = []
    for (let hcnt = 0; hcnt < p.holechildren.length; hcnt++) {
      complement.push(...info[p.holechildren[hcnt]].holeCommands)
    }
    return complement
  }

  private _traceDataToPath({ pathLayer, palette }: TraceData): Path[] {
    const result: Path[] = []
    for (let lcnt = 0; lcnt < pathLayer.length; lcnt++) {
      for (let pcnt = 0; pcnt < pathLayer[lcnt].length; pcnt++) {
        const layer = pathLayer[lcnt]
        const smp = layer[pcnt]
        if (smp.isholepath || smp.commands.length < this.commandOmit) continue
        const rgba = palette[lcnt]
        const color = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`
        const path = new Path({
          ...this.pathAttrs,
          stroke: color,
          fill: color,
          opacity: String(rgba.a / 255.0),
        })
        path.addCommand([
          ...smp.commands,
          ...this._complementCommand(layer, pcnt),
        ])
        result.push(path)
      }
    }

    return result
  }
}
