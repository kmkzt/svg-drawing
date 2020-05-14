import { download } from './utils/download'
const roundUp = (num: number) => Number(num.toFixed(2))

export class Point {
  public x: number
  public y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public toVector(): Vector {
    const value = Math.sqrt(Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0))
    const angle = Math.atan2(this.y, this.x)
    return new Vector(value, angle)
  }

  public scale(r: number): Point {
    return new Point(this.x * r, this.y * r)
  }

  public add(p: Point): Point {
    return new Point(this.x + p.x, this.y + p.y)
  }

  public sub(p: Point): Point {
    return new Point(this.x - p.x, this.y - p.y)
  }
  public commandMove(): string {
    return `M ${this.x} ${this.y}`
  }

  public commandLine(): string {
    return `L ${this.x} ${this.y}`
  }

  public commandCirculer(cl: Point, cr: Point): string {
    return `C ${cl.x} ${cl.y} ${cr.x} ${cr.y} ${this.x} ${this.y}`
  }
}

export enum CommandType {
  MOVE,
  LINE,
  CURVE
}

export class Command {
  public point: Point
  public type: CommandType
  public cl?: Point
  public cr?: Point
  constructor(type: CommandType, point: Point) {
    this.point = point
    this.type = type
  }

  public toString(): string {
    switch (this.type) {
      case CommandType.MOVE:
        return this.point.commandMove()
      case CommandType.LINE:
        return this.point.commandLine()
      case CommandType.CURVE:
        if (!this.cl || !this.cr) return this.point.commandLine()
        return this.point.commandCirculer(this.cl, this.cr)
    }
  }

  public scale(r: number): Command {
    const upd = new Command(this.type, this.point.scale(r))
    upd.cr = this.cr?.scale(r)
    upd.cl = this.cl?.scale(r)
    return upd
  }
}

export class Vector {
  public angle: number
  public value: number
  constructor(v: number, a: number) {
    this.value = v
    this.angle = a
  }

  public toPoint(): Point {
    const x = Math.cos(this.angle) * this.value
    const y = Math.sin(this.angle) * this.value
    return new Point(roundUp(x), roundUp(y))
  }

  public scale(r: number): Vector {
    return new Vector(this.value * r, this.angle)
  }
}

export interface PathOption {
  close?: boolean
  circuler?: boolean
  strokeWidth?: number
  stroke?: string
  fill?: string
}
export class Path {
  public close: boolean
  public circuler: boolean
  public strokeWidth: number
  public stroke: string
  public fill: string
  public smoothRatio: number
  public points: Point[]
  public commands: Command[]

  constructor({ close, circuler, strokeWidth, stroke, fill }: PathOption = {}) {
    this.close = close ?? false
    this.circuler = circuler ?? true
    this.strokeWidth = strokeWidth ?? 1
    this.stroke = stroke ?? '#000'
    this.fill = fill ?? 'none'
    this.smoothRatio = 0.2
    this.points = []
    this.commands = []
  }

  public scale(r: number): this {
    this.points = this.points.map((p: Point) => p.scale(r))
    this.commands = this.commands.map((c: Command) => c.scale(r))
    this.strokeWidth *= r
    return this
  }

  public addPoint(p: Point): this {
    this.points.push(p)
    return this
  }

  public addCommand(c: Command): this {
    this.commands.push(c)
    return this
  }

  public formatCommand(): this {
    const isCirculer = this.circuler && this.points.length > 2
    const points = this.close
      ? [...this.points, this.points[0]]
      : [...this.points]
    this.commands = isCirculer
      ? this._formatCurveCommand(points)
      : this._formatLineCommand(points)
    return this
  }

  public getCommandString(): string {
    if (this.commands.length === 0) return ''

    let d = this.commands
      .map((com: Command, _i: number) => com.toString())
      .join(' ')
    if (this.close) {
      d += ` Z`
    }
    return d
  }

  public toElement(): HTMLElement {
    const path = document.createElement('path')
    path.setAttribute('stroke-width', String(this.strokeWidth))
    path.setAttribute('stroke', this.stroke)
    path.setAttribute('fill', this.fill)
    path.setAttribute('stroke-linejoin', this.circuler ? 'round' : 'mitter')
    path.setAttribute('stroke-linecap', this.circuler ? 'round' : 'square')
    path.setAttribute('d', this.getCommandString())
    return path
  }

  public clone(): Path {
    const path = new Path({
      close: this.close,
      circuler: this.circuler,
      strokeWidth: this.strokeWidth,
      stroke: this.stroke,
      fill: this.fill
    })
    this.points.map(p => {
      path.addPoint(new Point(p.x, p.y))
    })
    this.commands.map(c => {
      const add = new Command(c.type, c.point)
      add.cl = c.cl ? new Point(c.cl.x, c.cl.y) : undefined
      add.cr = c.cr ? new Point(c.cr.x, c.cr.y) : undefined
      path.addCommand(add)
    })
    return path
  }

  private _createControlPoint(prev: Point, start: Point, next: Point): Point {
    const contolVectorPoint = next
      .sub(prev)
      .toVector()
      .scale(this.smoothRatio)
      .toPoint()
    return start.add(contolVectorPoint)
  }
  private _formatCurveCommand(pts: Point[]): Command[] {
    let update = []
    const endIndex = pts.length - 1
    update.push(new Command(CommandType.MOVE, this.points[0]))
    for (let i = 1; i < pts.length; i += 1) {
      const p1 = i === 1 ? pts[0] : pts[i - 2]
      const p2 = pts[i - 1]
      const p3 = pts[i]
      // TODO: Refactor
      const p4 = this.close
        ? i === endIndex
          ? pts[1]
          : i === endIndex - 1
          ? pts[i]
          : pts[i + 1]
        : i === endIndex
        ? pts[i]
        : pts[i + 1]
      const curveCommand = new Command(CommandType.CURVE, pts[i])
      curveCommand.cl = this._createControlPoint(p1, p2, p3)
      curveCommand.cr = this._createControlPoint(p4, p3, p2)
      update.push(curveCommand)
    }
    return update
  }

  private _formatLineCommand(pts: Point[]): Command[] {
    let update = []
    update.push(new Command(CommandType.MOVE, pts[0]))
    for (let i = 1; i < pts.length; i += 1) {
      update.push(new Command(CommandType.LINE, pts[i]))
    }
    return update
  }
}

export interface SvgOption {
  width: number
  height: number
  background?: string
}
export class Svg {
  public background: string
  private _width: number
  private _height: number
  private _paths: Path[]
  constructor({ width, height, background }: SvgOption) {
    this._paths = []
    this._width = width
    this._height = height
    this.background = background ?? '#fff'
    // this.scalePath = this.scalePath.bind(this)
    // this.toElement = this.toElement.bind(this)
    // this.toBase64 = this.toBase64.bind(this)
    // this.resizeElement = this.resizeElement.bind(this)
  }

  /**
   * @returns {boolean} resize?
   */
  public resizeElement(width: number, height: number): boolean {
    // TODO: Resizing improve
    if (this._width !== width || this._height !== height) {
      this.scalePath(width / this._width)
      this._width = width
      this._height = height
      return true
    }
    return false
  }

  public scalePath(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this._paths.length; i += 1) {
        this._paths[i].scale(r)
      }
    }
    return this
  }

  public addPath(pa: Path): this {
    this._paths.push(pa)
    return this
  }

  public undoPath(): Path | undefined {
    return this._paths.pop()
  }

  public replacePaths(paths: Path[]): this {
    this._paths = paths
    return this
  }

  public clonePaths(): Path[] {
    return this._paths.map(p => p.clone())
  }

  public addPoint(po: Point): this {
    if (this._paths.length === 0) return this
    const updateIndex = this._paths.length - 1
    this._paths[updateIndex].addPoint(po)
    return this
  }

  public updatePath(pa: Path, i?: number): this {
    const updateIndex = i || this._paths.length - 1
    if (updateIndex < 0) this._paths.push(pa)
    this._paths[updateIndex] = pa
    return this
  }

  public clearPath() {
    this._paths = []
    return this
  }

  public get paths(): Path[] {
    return this._paths
  }

  public toElement(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(this._width))
    svg.setAttribute('height', String(this._height))
    for (let i = 0; i < this._paths.length; i += 1) {
      svg.appendChild(this._paths[i].toElement())
    }
    return svg
  }

  public toBase64(): string {
    const data = `<svg width="${this._width}" height="${
      this._height
    }" version="1.1" xmlns="http://www.w3.org/2000/svg">${
      this.toElement().innerHTML
    }</svg>`
    return `data:image/svg+xml;base64,${btoa(data)}`
  }

  // TODO: Add filename config
  public download(
    ext: 'svg' | 'png' | 'jpg' = 'svg',
    cb: typeof download = download
  ) {
    if (ext === 'svg') {
      cb({
        data: this.toBase64(),
        extension: 'svg'
      })
    }

    const img: any = new Image()
    const renderCanvas = () => {
      const canvas = document.createElement('canvas')
      canvas.setAttribute('width', String(this._width))
      canvas.setAttribute('height', String(this._height))
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = this.background
      ctx.fillRect(0, 0, this._width, this._height)
      ctx.drawImage(img, 0, 0)
      if (ext === 'png') {
        cb({ data: canvas.toDataURL('image/png'), extension: 'png' })
      } else {
        cb({ data: canvas.toDataURL('image/jpeg'), extension: 'jpg' })
      }
    }
    img.addEventListener('load', renderCanvas, false)
    img.src = this.toBase64()
  }
}