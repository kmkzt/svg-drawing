import { download } from './utils/download'
const roundUp = (num: number) => Number(num.toFixed(2))

export class Point {
  public x: number
  public y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y

    this.toVector = this.toVector.bind(this)
    this.scale = this.scale.bind(this)
    this.sub = this.sub.bind(this)
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
  public commandMove() {
    return `M ${this.x} ${this.y}`
  }

  public commandLine() {
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

interface SvgPathOption {
  close?: boolean
  circuler?: boolean
  strokeWidth?: number
  stroke?: string
  fill?: string
}
export class SvgPath {
  public close: boolean
  public circuler: boolean
  public strokeWidth: number
  public stroke: string
  public fill: string
  public smoothRatio: number
  public points: Point[]
  public commands: Command[]

  constructor({
    close,
    circuler,
    strokeWidth,
    stroke,
    fill
  }: SvgPathOption = {}) {
    this.close = close ?? false
    this.circuler = circuler ?? true
    this.strokeWidth = strokeWidth ?? 1
    this.stroke = stroke ?? '#000'
    this.fill = fill ?? 'none'
    this.smoothRatio = 0.2
    this.points = []
    this.commands = []
  }

  public scale(r: number) {
    const update = this.points.map((p: Point) => p.scale(r))
    this.points = update
    this.strokeWidth *= r
  }

  public addPoint(p: Point) {
    this.points.push(p)
    this.formatCommand()
  }

  public createCommand(): string {
    if (this.commands.length === 0) return ''

    let d = this.commands
      .map((com: Command, _i: number) => com.toString())
      .join(' ')
    if (this.close) {
      d += ` Z`
    }
    return d
  }

  public formatCommand() {
    const isCirculer = this.circuler && this.points.length > 2
    this.commands = isCirculer
      ? this._createCurveCommand()
      : this._createLineCommand()
  }

  private _createControlPoint(prev: Point, start: Point, next: Point): Point {
    const contolVectorPoint = next
      .sub(prev)
      .toVector()
      .scale(this.smoothRatio)
      .toPoint()
    return start.add(contolVectorPoint)
  }
  private _createCurveCommand(): Command[] {
    let update = []
    const endIndex = this.points.length - 1
    update.push(new Command(CommandType.MOVE, this.points[0]))
    for (let i = 1; i < this.points.length; i += 1) {
      const p1 = i === 1 ? this.points[0] : this.points[i - 2]
      const p2 = this.points[i - 1]
      const p3 = this.points[i]
      const p4 = i === endIndex ? this.points[i] : this.points[i + 1]
      const curveCommand = new Command(CommandType.CURVE, this.points[i])
      curveCommand.cl = this._createControlPoint(p1, p2, p3)
      curveCommand.cr = this._createControlPoint(p4, p3, p2)
      update.push(curveCommand)
    }
    if (this.close) {
      const curveCommand = new Command(CommandType.CURVE, this.points[0])
      curveCommand.cl = this._createControlPoint(
        this.points[endIndex - 1],
        this.points[endIndex],
        this.points[0]
      )
      curveCommand.cr = this._createControlPoint(
        this.points[1],
        this.points[0],
        this.points[endIndex]
      )
      update.push(curveCommand)
    }
    return update
  }

  private _createLineCommand(): Command[] {
    let update = []
    update.push(new Command(CommandType.MOVE, this.points[0]))
    for (let i = 1; i < this.points.length; i += 1) {
      update.push(new Command(CommandType.LINE, this.points[i]))
    }
    if (this.close) {
      update.push(new Command(CommandType.LINE, this.points[0]))
    }
    return update
  }

  public toElement(): HTMLElement {
    const path = document.createElement('path')
    path.setAttribute('stroke-width', String(this.strokeWidth))
    path.setAttribute('stroke', this.stroke)
    path.setAttribute('fill', this.fill)
    path.setAttribute('stroke-linejoin', this.circuler ? 'round' : 'mitter')
    path.setAttribute('stroke-linecap', this.circuler ? 'round' : 'square')
    path.setAttribute('d', this.createCommand())
    return path
  }
}

interface RendererOption {
  width: number
  height: number
  background?: string
}
export class Renderer {
  public background: string
  private width: number
  private height: number
  private paths: SvgPath[]
  constructor({ width, height, background }: RendererOption) {
    this.paths = []
    this.width = width
    this.height = height
    this.background = background ?? '#fff'
    this.scalePath = this.scalePath.bind(this)
    this.toElement = this.toElement.bind(this)
    this.toBase64 = this.toBase64.bind(this)
    this.resizeElement = this.resizeElement.bind(this)
  }

  public resizeElement(width: number, height: number) {
    this.width = width
    this.height = height
    // TODO: Resizing improve
    this.scalePath(width / this.width)
  }

  public scalePath(r: number) {
    for (let i = 0; i < this.paths.length; i += 1) {
      this.paths[i].scale(r)
    }
  }

  public addPath(pa: SvgPath) {
    this.paths.push(pa)
  }

  public undoPath(): SvgPath | undefined {
    return this.paths.pop()
  }

  public addPoint(po: Point) {
    if (this.paths.length === 0) return
    const updateIndex = this.paths.length - 1
    this.paths[updateIndex].addPoint(po)
  }

  public updatePath(pa: SvgPath, i?: number) {
    const updateIndex = i || this.paths.length - 1
    if (updateIndex < 0) this.paths.push(pa)
    this.paths[updateIndex] = pa
  }

  public clear() {
    this.paths = []
  }

  public toElement(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', String(this.width))
    svg.setAttribute('height', String(this.height))
    for (let i = 0; i < this.paths.length; i += 1) {
      svg.appendChild(this.paths[i].toElement())
    }
    return svg
  }

  public toBase64(): string {
    const data = `<svg width="${this.width}" height="${
      this.width
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
      canvas.setAttribute('width', String(this.width))
      canvas.setAttribute('height', String(this.height))
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.fillStyle = this.background
      ctx.fillRect(0, 0, this.width, this.height)
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
