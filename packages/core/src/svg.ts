import { kebab2camel, roundUp, isNaN } from './utils'
import {
  PathObject,
  SvgObject,
  SvgOption,
  CommandType,
  PointObject,
} from './types'

export class Point {
  constructor(private _x: number, private _y: number) {}

  public get x(): number {
    return this._x
  }

  public get y(): number {
    return this._y
  }

  public toVector(): Vector {
    const value = Math.sqrt(Math.pow(this._x, 2.0) + Math.pow(this._y, 2.0))
    const angle = Math.atan2(this._y, this._x)
    return new Vector(value, angle)
  }

  public scale(r: number): Point {
    return new Point(this._x * r, this._y * r)
  }

  public scaleX(r: number): Point {
    return new Point(this._x * r, this._y)
  }

  public scaleY(r: number): Point {
    return new Point(this._x, this._y * r)
  }

  public add(p: Point): Point {
    return new Point(this._x + p.x, this._y + p.y)
  }

  public sub(p: Point): Point {
    return new Point(this._x - p.x, this._y - p.y)
  }

  public translate(p: Point): void {
    this._x += p.x
    this._y += p.y
  }

  public eql(p: Point): boolean {
    return this._x === p.x && this._y === p.y
  }

  public clone(): Point {
    return new Point(this._x, this._y)
  }

  public toJson(): PointObject {
    return {
      x: this._x,
      y: this._y,
    }
  }
}

export const COMMAND_TYPE: { [name: string]: CommandType } = {
  MOVE: 'M', // M 0 0
  MOVE_RELATIVE: 'm', // m 0 0
  LINE: 'L', // L 1 1
  LINE_RELATIVE: 'l', // l 1 1
  CUBIC_BEZIER_CURVE: 'C', // C 1 1 2 2 3 3
  CUBIC_BEZIER_CURVE_RELATIVE: 'c', // c 1 1 2 2 3 3
  CLOSE: 'Z', // Z, z
  HORIZONTAL: 'H', // H 10
  HORIZONTAL_RELATIVE: 'h', // h 10
  VERTICAL: 'V', // V 20
  VERTICAL_RELATIVE: 'v', // v 20
  ARC_CURVE: 'A', // A 6 4 10 0 1 14 10
  ARC_CURVE_RELATIVE: 'a', // A 6 4 10 0 1 14 10
  QUADRATIC_CURVE: 'Q', // Q 10 60 10 30
  QUADRATIC_CURVE_RELATIVE: 'q', // q 10 60 10 30
  SHORTCUT_CURVE: 'S', // S 10 60 10 30
  SHORTCUT_CURVE_RELATIVE: 's', // s 10 60 10 30
} as const

// TODO: compatible COMMAND_TYPE
export class Command {
  public type: CommandType
  public value: number[]
  // TODO: Convert data format to number array.
  constructor(type: CommandType, value: number[] = []) {
    this.value = value
    this.type = type
  }

  public set cr(po: Point | undefined) {
    if (!po) return
    if (!this.isCubicBezierCurve) {
      return
    }
    this.value.splice(2, 1, po.x)
    this.value.splice(3, 1, po.y)
  }
  public get cr(): Point | undefined {
    if (!this.isCubicBezierCurve) {
      return undefined
    }
    const [x, y] = this.value.slice(2, 4)
    return new Point(x, y)
  }
  public set cl(po: Point | undefined) {
    if (!po) return
    if (!this.isCurve) {
      return
    }
    this.value.splice(0, 1, po.x)
    this.value.splice(1, 1, po.y)
  }
  public get cl(): Point | undefined {
    if (!this.isCurve) {
      return undefined
    }
    const [x, y] = this.value.slice(0, 2)
    return new Point(x, y)
  }

  public set point(po: Point | undefined) {
    if (!po) return
    this.value.splice(this.value.length - 2, 1, po.x)
    this.value.splice(this.value.length - 1, 1, po.y)
  }
  public get point(): Point | undefined {
    const xy = this.value.slice(this.value.length - 2)
    return xy.length === 2 ? new Point(xy[0], xy[1]) : undefined
  }

  public toString(): string {
    if (this.type === COMMAND_TYPE.CLOSE) return COMMAND_TYPE.CLOSE
    return `${this.type} ${this.value.map((v) => roundUp(v)).join(' ')}`
  }

  public scale(r: number): Command {
    const upd = new Command(
      this.type,
      this.value.map((p) => p * r)
    )
    return upd
  }

  public scaleX(r: number): Command {
    const point = this.point?.scaleX(r)
    const cl = this.cl?.scaleX(r)
    const cr = this.cr?.scaleX(r)
    return new Command(
      this.type,
      [cl, cr, point].reduce(
        (res: number[], po: Point | undefined) =>
          po ? [...res, po.x, po.y] : res,
        []
      )
    )
  }

  public scaleY(r: number): Command {
    const point = this.point?.scaleY(r)
    const cl = this.cl?.scaleY(r)
    const cr = this.cr?.scaleY(r)
    return new Command(
      this.type,
      [cl, cr, point].reduce(
        (res: number[], po: Point | undefined) =>
          po ? [...res, po.x, po.y] : res,
        []
      )
    )
  }

  public clone(): Command {
    return new Command(this.type, this.value.slice())
  }

  public get isCubicBezierCurve(): boolean {
    switch (this.type) {
      case COMMAND_TYPE.CUBIC_BEZIER_CURVE:
      case COMMAND_TYPE.CUBIC_BEZIER_CURVE_RELATIVE:
        return this.value.length === 6
      default:
        return false
    }
  }
  public get isCurve(): boolean {
    switch (this.type) {
      case COMMAND_TYPE.CUBIC_BEZIER_CURVE:
      case COMMAND_TYPE.CUBIC_BEZIER_CURVE_RELATIVE:
        return this.value.length === 6
      case COMMAND_TYPE.QUADRATIC_CURVE:
      case COMMAND_TYPE.QUADRATIC_CURVE_RELATIVE:
      case COMMAND_TYPE.SHORTCUT_CURVE:
      case COMMAND_TYPE.SHORTCUT_CURVE_RELATIVE:
        return this.value.length === 4
      default:
        return false
    }
  }

  public get isAbsolute(): boolean {
    return [
      COMMAND_TYPE.MOVE,
      COMMAND_TYPE.LINE,
      COMMAND_TYPE.CUBIC_BEZIER_CURVE,
      COMMAND_TYPE.ARC_CURVE,
      COMMAND_TYPE.QUADRATIC_CURVE,
      COMMAND_TYPE.SHORTCUT_CURVE_RELATIVE,
    ].includes(this.type)
  }
  public translate(p: PointObject) {
    if (!this.isAbsolute) return
    const po = new Point(p.x, p.y)
    this.point = this.point?.add(po)
    this.cr = this.cr?.add(po)
    this.cl = this.cl?.add(po)
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
    return new Point(x, y)
  }

  public scale(r: number): Vector {
    return new Vector(this.value * r, this.angle)
  }
}

/**
 * TODO: refactor command.
 * The following commands are not supported. Cannot support commands that use `M` or` z` more than once
 * `M 0 0 L 1 1 Z M 1 1 L 2 2 Z`
 */
export class Path {
  public attrs: PathObject
  public commands: Command[]

  constructor({ d, ...attrs }: PathObject = {}) {
    this.attrs = attrs
    this.commands = []
    if (d) this.parseCommandString(d)
  }

  public scale(r: number): this {
    this.commands = this.commands.map((c: Command) => c.scale(r))
    this.attrs.strokeWidth = String(r * +(this.attrs.strokeWidth || 0))
    return this
  }

  public scaleX(r: number): this {
    this.commands = this.commands.map((c: Command) => c.scaleX(r))
    return this
  }

  public scaleY(r: number): this {
    this.commands = this.commands.map((c: Command) => c.scaleY(r))
    return this
  }

  public addCommand(param: Command | Command[]): this {
    if (Array.isArray(param)) {
      this.commands.push(...param)
    } else {
      this.commands.push(param)
    }
    return this
  }

  public deleteCommand(i: number): this {
    this.commands.splice(i, 1)
    return this
  }

  public getCommandString(): string {
    if (this.commands.length === 0) return ''
    return this.commands
      .map((com: Command, _i: number) => com.toString())
      .join(' ')
      .trim()
  }

  // TODO: Valid Command type
  public parseCommandString(d: string): void {
    this.commands = []
    let type: CommandType | null = null
    let value: number[] = []
    const c = d.split(' ')
    const checkType = (c: any): CommandType | null =>
      Object.values(COMMAND_TYPE).includes(c) ? c : null
    for (let i = 0; i < c.length; i += 1) {
      const t = checkType(c[i])
      // COMMAND Parse
      if (t) {
        if (!type) {
          type = t
          continue
        }
        this.commands.push(new Command(type, value))
        type = t
        value = []
        continue
      }
      if (isNaN(+c[i])) {
        return
      }
      value.push(+c[i])
    }

    if (type !== null) {
      this.commands.push(new Command(type, value))
    }
  }

  public parsePathElement(pEl: SVGPathElement): this {
    for (let i = 0; i < pEl.attributes.length; i += 1) {
      const attr: Attr | null = pEl.attributes.item(i)
      if (!attr || !attr.value) continue
      if (attr.name === 'd') {
        this.parseCommandString(attr.value)
        continue
      }
      this.attrs = {
        ...this.attrs,
        [kebab2camel(attr.name)]: attr.value,
      }
    }
    return this
  }

  public toJson(): PathObject {
    return {
      ...this.attrs,
      d: this.getCommandString(),
    }
  }

  public translate(po: PointObject): void {
    for (let i = 0; i < this.commands.length; i += 1) {
      this.commands[i].translate(po)
    }
  }

  public clone(): Path {
    const path = new Path(this.attrs)
    this.commands.map((c) => {
      path.commands.push(c.clone())
    })
    return path
  }
}
export class Svg {
  public paths: Path[]
  public width: number
  public height: number
  public background?: string

  constructor({ width, height, background }: SvgOption) {
    this.paths = []
    this.width = width
    this.height = height
    this.background = background
  }

  /**
   * @todo check height
   */
  public resize({ width, height }: { width: number; height: number }) {
    this.scale(width / this.width)
    this.width = width
    this.height = height
  }

  public scale(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scale(r)
      }
    }
    return this
  }

  public scaleX(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scaleX(r)
      }
    }
    return this
  }

  public scaleY(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scaleY(r)
      }
    }
    return this
  }

  public addPath(pa: Path | Path[]): this {
    if (Array.isArray(pa)) {
      this.paths.push(...pa)
    } else {
      this.paths.push(pa)
    }
    return this
  }

  public deletePath(i: number): this {
    this.paths.splice(i, 1)
    return this
  }

  public clonePaths(): Path[] {
    return this.paths.map((p) => p.clone())
  }

  public updatePath(pa: Path, i?: number): this {
    const updateIndex = i || this.paths.length - 1
    if (updateIndex < 0) this.paths.push(pa)
    this.paths[updateIndex] = pa
    return this
  }

  public toJson(): SvgObject {
    return {
      width: this.width,
      height: this.height,
      background: this.background,
      paths: this.paths.map((p) => p.toJson()),
    }
  }

  public copy(svg: any extends Svg ? Svg : never): this {
    this.paths = svg.clonePaths()
    if (svg.width && this.width) {
      this.scale(this.width / svg.width)
    }
    return this
  }

  public parseSVGString(svgStr: string): this {
    const svgEl: SVGSVGElement | null = new DOMParser()
      .parseFromString(svgStr, 'image/svg+xml')
      .querySelector('svg')
    if (!svgEl) {
      this.paths = []
      return this
    }
    return this.parseSVGElement(svgEl)
  }

  public parseSVGElement(svgEl: SVGSVGElement): this {
    const update: Path[] = []
    svgEl.querySelectorAll('path').forEach((pEl) => {
      const pa = new Path().parsePathElement(pEl)
      if (pa.commands.length !== 0) {
        update.push(pa)
      }
    })
    this.paths = update
    const width = Number(svgEl.getAttribute('width'))
    if (width && this.width) {
      this.scale(this.width / width)
    }
    return this
  }

  public clone(): Svg {
    const svg = new Svg({
      width: this.width,
      height: this.height,
      background: this.background,
    })
    svg.addPath(this.clonePaths())
    return svg
  }
}
