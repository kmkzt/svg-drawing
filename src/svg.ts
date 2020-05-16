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

  public eql(p: Point): boolean {
    return this.x === p.x && this.y === p.y
  }

  public clone(): Point {
    return new Point(this.x, this.y)
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

  public clone(): Command {
    const copy = new Command(this.type, this.point.clone())
    copy.cl = this.cl?.clone()
    copy.cr = this.cr?.clone()
    return copy
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

export interface PathObject {
  stroke: string
  strokeWidth: number
  strokeLinecap: 'round' | 'square'
  strokeLinejoin: 'round' | 'mitter'
  fill: string
  d: string
}
export class Path {
  public close: boolean
  public circuler: boolean
  public strokeWidth: number
  public stroke: string
  public fill: string
  public smoothRatio: number
  public commands: Command[]

  constructor({ close, circuler, strokeWidth, stroke, fill }: PathOption = {}) {
    this.close = close ?? false
    this.circuler = circuler ?? true
    this.strokeWidth = strokeWidth ?? 1
    this.stroke = stroke ?? '#000'
    this.fill = fill ?? 'none'
    this.smoothRatio = 0.2
    this.commands = []
  }

  public scale(r: number): this {
    this.commands = this.commands.map((c: Command) => c.scale(r))
    this.strokeWidth *= r
    return this
  }

  public addCommand(param: Command | Point): this {
    if (param instanceof Point) {
      if (!this.circuler || this.commands.length < 2) {
        this.commands.push(
          new Command(
            this.commands.length === 0 ? CommandType.MOVE : CommandType.LINE,
            param
          )
        )
      } else {
        const p1 =
          this.commands.length === 2
            ? this.commands[this.commands.length - 2].point
            : this.commands[this.commands.length - 3].point
        const p2 = this.commands[this.commands.length - 2].point
        const p3 = this.commands[this.commands.length - 1].point
        const p4 = param
        this.commands[
          this.commands.length - 1
        ] = this._createBezierCurveCommand(p1, p2, p3, p4)
        this.commands.push(this._createBezierCurveCommand(p2, p3, p4, p4))
      }
    } else {
      this.commands.push(param)
    }
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

  public toJson(): PathObject {
    return {
      fill: this.fill,
      d: this.getCommandString(),
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      strokeLinecap: this.circuler ? 'round' : 'square',
      strokeLinejoin: this.circuler ? 'round' : 'mitter'
    }
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
    this.commands.map(c => {
      path.addCommand(c.clone())
    })
    return path
  }

  private _createBezierCurveCommand(
    p1: Point,
    p2: Point,
    p3: Point,
    p4: Point
  ): Command {
    const cmd = new Command(CommandType.CURVE, p3)
    cmd.cl = this._createControlPoint(p1, p2, p3)
    cmd.cr = this._createControlPoint(p4, p3, p2)
    return cmd
  }

  private _createControlPoint(prev: Point, start: Point, next: Point): Point {
    const contolVectorPoint = next
      .sub(prev)
      .toVector()
      .scale(this.smoothRatio)
      .toPoint()
    return start.add(contolVectorPoint)
  }
}

export interface SvgOption {
  width: number
  height: number
}

export interface SvgObject {
  width: number
  height: number
  paths: PathObject[]
}
export class Svg {
  private _paths: Path[]
  protected _width: number
  protected _height: number
  constructor({ width, height }: SvgOption) {
    this._paths = []
    this._width = width
    this._height = height
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

  public addCommand(po: Point): this {
    if (this._paths.length === 0) return this
    const updateIndex = this._paths.length - 1
    this._paths[updateIndex].addCommand(po)
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

  public toJson(): SvgObject {
    return {
      width: this._width,
      height: this._height,
      paths: this.paths.map(p => p.toJson())
    }
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
}
