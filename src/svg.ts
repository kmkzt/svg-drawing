const roundUp = (num: number) => Number(num.toFixed(2))
const isNaN = (num: Number) => num !== num

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

  public toString(): string {
    return `${this.x} ${this.y}`
  }
}

export enum CommandType {
  MOVE = 'M', // M 0 0
  // MOVE_RELATIVE = 'm', // m 0 0
  LINE = 'L', // L 1 1
  // LINE_RELATIVE = 'l' // l 1 1
  CURVE = 'C', // C 1 1 2 2 3 3
  // CURVE_RELATIVE = 'c', // c 1 1 2 2 3 3
  CLOSE = 'Z', // Z, z
  // HORIZONTAL = 'H', // H 10
  // HORIZONTAL_RELATIVE = 'h', // h 10
  // VERTICAL = 'V', // V 20
  // VERTICAL_RELATIVE = 'v', // v 20
  // ARC_CURVE = 'A', // A 6 4 10 0 1 14 10
  // ARC_CURVE_RELATIVE = 'a', // A 6 4 10 0 1 14 10
  // QUADRATIC_CURVE = 'Q' // Q 10 60 10 30
  // QUADRATIC_CURVE_RELATIVE = 'q' // q 10 60 10 30
}

// TODO: compatible CommandType
export class Command {
  public type: CommandType
  // TODO: Convert data format to number array.
  public point: Point
  public cl?: Point
  public cr?: Point
  constructor(type: CommandType, point: Point) {
    this.point = point
    this.type = type
  }

  public toString(): string {
    switch (this.type) {
      case CommandType.MOVE:
      case CommandType.LINE:
        return `${this.type} ${this.point.toString()}`
      case CommandType.CURVE:
        if (!this.cl || !this.cr)
          return `${CommandType.LINE} ${this.point.x} ${this.point.y}`
        return `${
          this.type
        } ${this.cl.toString()} ${this.cr.toString()} ${this.point.toString()}`
      default:
        return ''
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
  curve?: boolean
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

/**
 * TODO: refactor command.
 * The following commands are not supported. Cannot support commands that use `M` or` z` more than once
 * `M 0 0 L 1 1 Z M 1 1 L 2 2 Z`
 */
export class Path {
  public close: boolean
  public curve: boolean
  public strokeWidth: number
  public stroke: string
  public fill: string
  public smoothRatio: number
  public commands: Command[]

  constructor({ close, curve, strokeWidth, stroke, fill }: PathOption = {}) {
    this.close = close ?? false
    this.curve = curve ?? true
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
      if (!this.curve || this.commands.length < 2) {
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

    let d = this.commands.map((com: Command, _i: number) => com.toString())

    if (this.close) {
      d.push(CommandType.CLOSE)
    }
    return d.join(' ')
  }

  // TODO: Increase supported command types
  // TODO: Comma parse
  public parseCommandString(d: string): void {
    this.commands = []
    const c = d.split(' ')
    if (c[c.length - 1] === CommandType.CLOSE) {
      this.close = true
    }
    for (let i = 0; i < c.length; i += 1) {
      switch (c[i]) {
        case CommandType.MOVE:
        case CommandType.LINE: {
          if (i + 2 > c.length) return
          const p1 = Number(c[i + 1])
          const p2 = Number(c[i + 2])
          if (isNaN(p1) || isNaN(p2)) return // check NaN
          this.commands.push(
            new Command(c[i] as CommandType, new Point(p1, p2))
          )
          i += 2
          break
        }
        case CommandType.CURVE: {
          if (i + 6 > c.length) return
          const p1 = Number(c[i + 1])
          const p2 = Number(c[i + 2])
          const p3 = Number(c[i + 3])
          const p4 = Number(c[i + 4])
          const p5 = Number(c[i + 5])
          const p6 = Number(c[i + 6])
          if (
            isNaN(p1) ||
            isNaN(p2) ||
            isNaN(p3) ||
            isNaN(p4) ||
            isNaN(p5) ||
            isNaN(p6)
          )
            return // check NaN
          const curveComand = new Command(
            c[i] as CommandType,
            new Point(p5, p6)
          )
          curveComand.cl = new Point(p1, p2)
          curveComand.cr = new Point(p3, p4)

          this.commands.push(curveComand)
          i += 6
          break
        }
        default:
          break
      }
    }
  }

  public parsePathElement(pEl: SVGPathElement): this {
    const d = pEl.getAttribute('d')
    if (d) {
      this.parseCommandString(d)
    }
    const strokeWidth = pEl.getAttribute('stroke-width')
    if (strokeWidth) {
      this.strokeWidth = Number(strokeWidth)
    }
    const stroke = pEl.getAttribute('stroke')
    if (stroke) {
      this.stroke = stroke
    }
    const fill = pEl.getAttribute('fill')
    if (fill) {
      this.fill = fill
    }
    return this
  }

  public toJson(): PathObject {
    return {
      fill: this.fill,
      d: this.getCommandString(),
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      strokeLinecap: this.curve ? 'round' : 'square',
      strokeLinejoin: this.curve ? 'round' : 'mitter',
    }
  }
  public toElement(): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('stroke-width', String(this.strokeWidth))
    path.setAttribute('stroke', this.stroke)
    path.setAttribute('fill', this.fill)
    path.setAttribute('stroke-linejoin', this.curve ? 'round' : 'mitter')
    path.setAttribute('stroke-linecap', this.curve ? 'round' : 'square')
    path.setAttribute('d', this.getCommandString())
    return path
  }

  public clone(): Path {
    const path = new Path({
      close: this.close,
      curve: this.curve,
      strokeWidth: this.strokeWidth,
      stroke: this.stroke,
      fill: this.fill,
    })
    this.commands.map((c) => {
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
  public width: number
  public height: number
  constructor({ width, height }: SvgOption) {
    this._paths = []
    this.width = width
    this.height = height
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
    return this._paths.map((p) => p.clone())
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
      width: this.width,
      height: this.height,
      paths: this.paths.map((p) => p.toJson()),
    }
  }

  public copy(svg: any extends Svg ? Svg : never): this {
    this._paths = svg.clonePaths()
    this.scalePath(svg.width / this.width)
    return this
  }

  public toElement(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(this.width))
    svg.setAttribute('height', String(this.height))
    for (let i = 0; i < this._paths.length; i += 1) {
      svg.appendChild(this._paths[i].toElement())
    }
    return svg
  }

  public toBase64(): string {
    const data = `<svg width="${this.width}" height="${
      this.height
    }" version="1.1" xmlns="http://www.w3.org/2000/svg">${
      this.toElement().innerHTML
    }</svg>`
    return `data:image/svg+xml;base64,${btoa(data)}`
  }

  public parseSVGString(svgStr: string): this {
    const svgEl: SVGSVGElement | null = new DOMParser()
      .parseFromString(svgStr, 'image/svg+xml')
      .querySelector('svg')
    return !svgEl ? this.clearPath() : this.parseSVGElement(svgEl)
  }

  public parseSVGElement(svgEl: SVGSVGElement): this {
    const update: Path[] = []
    svgEl.querySelectorAll('path').forEach((pEl) => {
      const pa = new Path().parsePathElement(pEl)
      if (pa.commands.length !== 0) {
        update.push(pa)
      }
    })
    this.replacePaths(update)
    const width = Number(svgEl.getAttribute('width'))
    if (width) {
      this.scalePath(this.width / width)
    }
    return this
  }
}
