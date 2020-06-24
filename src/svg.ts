import { roundUp } from './utils/roundUp'
import { camel2kebab } from './utils/camel2kebab'
import { kebab2camel } from './utils/kebab2camel'
import { svg2base64 } from './utils/svg2base64'
import {
  createSvgElement,
  createSvgChildElement
} from './utils/createSvgElement'

const isNaN = (num: number) => num !== num

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
}

export const COMMAND_TYPE = {
  MOVE: 'M', // M 0 0
  MOVE_RELATIVE: 'm', // m 0 0
  LINE: 'L', // L 1 1
  LINE_RELATIVE: 'l', // l 1 1
  CURVE: 'C', // C 1 1 2 2 3 3
  CURVE_RELATIVE: 'c', // c 1 1 2 2 3 3
  CLOSE: 'Z', // Z, z
  HORIZONTAL: 'H', // H 10
  HORIZONTAL_RELATIVE: 'h', // h 10
  VERTICAL: 'V', // V 20
  VERTICAL_RELATIVE: 'v', // v 20
  ARC_CURVE: 'A', // A 6 4 10 0 1 14 10
  ARC_CURVE_RELATIVE: 'a', // A 6 4 10 0 1 14 10
  QUADRATIC_CURVE: 'Q', // Q 10 60 10 30
  QUADRATIC_CURVE_RELATIVE: 'q' // q 10 60 10 30
} as const

type COMMAND = typeof COMMAND_TYPE[keyof typeof COMMAND_TYPE]
// TODO: compatible COMMAND_TYPE
export class Command {
  public type: COMMAND
  public value: number[]
  // TODO: Convert data format to number array.
  constructor(type: COMMAND, value: number[] = []) {
    this.value = value
    this.type = type
  }

  public set cr(po: Point | undefined) {
    if (!po) return
    if ((this.type !== 'C' && this.type !== 'c') || this.value.length !== 6) {
      return
    }
    this.value.splice(2, 1, po.x)
    this.value.splice(3, 1, po.y)
  }
  public get cr(): Point | undefined {
    if ((this.type !== 'C' && this.type !== 'c') || this.value.length !== 6) {
      return undefined
    }
    const [x, y] = this.value.slice(2, 4)
    return new Point(x, y)
  }
  public set cl(po: Point | undefined) {
    if (!po) return
    if ((this.type !== 'C' && this.type !== 'c') || this.value.length !== 6) {
      return
    }
    this.value.splice(0, 1, po.x)
    this.value.splice(1, 1, po.y)
  }
  public get cl(): Point | undefined {
    if ((this.type !== 'C' && this.type !== 'c') || this.value.length !== 6) {
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
    return `${this.type} ${this.value.map(v => roundUp(v)).join(' ')}`
  }

  public scale(r: number): Command {
    const upd = new Command(
      this.type,
      this.value.map(p => p * r)
    )
    return upd
  }

  public clone(): Command {
    const copy = new Command(this.type, this.value.slice())
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
    return new Point(x, y)
  }

  public scale(r: number): Vector {
    return new Vector(this.value * r, this.angle)
  }
}

export interface PathOption {
  strokeWidth?: number
  attrs?: Attrs
  stroke?: string
  fill?: string
}

interface Attrs {
  [key: string]: string
}
export interface PathObject {
  attrs: Attrs
  d: string
}

const defaultAttrs: Attrs = {
  strokeLinecap: 'round', // 'mitter'
  strokeLinejoin: 'round' // 'square'
}
/**
 * TODO: refactor command.
 * The following commands are not supported. Cannot support commands that use `M` or` z` more than once
 * `M 0 0 L 1 1 Z M 1 1 L 2 2 Z`
 */
export class Path {
  public strokeWidth: number
  public attrs: { [key: string]: string }
  public stroke: string
  public fill: string
  public commands: Command[]

  constructor({ strokeWidth, fill, stroke, attrs }: PathOption = {}) {
    this.strokeWidth = strokeWidth ?? 1
    this.stroke = stroke ?? '#000'
    this.fill = fill ?? 'none'
    this.attrs = {
      ...defaultAttrs,
      ...attrs
    }
    this.commands = []
  }

  public scale(r: number): this {
    this.commands = this.commands.map((c: Command) => c.scale(r))
    this.strokeWidth *= r
    return this
  }

  public addCommand(param: Command): this {
    this.commands.push(param)
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
    let type: COMMAND | null = null
    let value: number[] = []
    const c = d.split(' ')
    const checkType = (c: any): COMMAND | null =>
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
    this.strokeWidth = 1
    this.stroke = '#000'
    this.fill = 'none'
    this.attrs = defaultAttrs
    for (let i = 0; i < pEl.attributes.length; i += 1) {
      const attr: Attr | null = pEl.attributes.item(i)
      if (!attr) continue
      if (attr.name === 'd') {
        this.parseCommandString(attr.value)
        continue
      }
      if (attr.name === 'stroke-width') {
        this.strokeWidth = Number(attr.value)
        continue
      }
      if (attr.name === 'fill') {
        this.fill = attr.value
        continue
      }
      if (attr.name === 'stroke') {
        this.stroke = attr.value
        continue
      }
      this.attrs = {
        ...this.attrs,
        [kebab2camel(attr.name)]: attr.value
      }
    }
    return this
  }

  public toJson(): PathObject {
    return {
      attrs: this.attrs,
      d: this.getCommandString()
    }
  }
  public toElement(): SVGElement {
    return createSvgChildElement('path', {
      fill: this.fill,
      stroke: this.stroke,
      ['stroke-width']: String(this.strokeWidth),
      d: this.getCommandString(),
      ...Object.entries(this.attrs).reduce(
        (acc, [key, val], _i) => ({
          ...acc,
          [camel2kebab(key)]: val
        }),
        {}
      )
    })
  }

  public clone(): Path {
    const path = new Path({
      strokeWidth: this.strokeWidth,
      fill: this.fill,
      stroke: this.stroke,
      attrs: { ...this.attrs }
    })
    this.commands.map(c => {
      path.commands.push(c.clone())
    })
    return path
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
  public paths: Path[]
  public width: number
  public height: number
  constructor({ width, height }: SvgOption) {
    this.paths = []
    this.width = width
    this.height = height
  }

  public scalePath(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scale(r)
      }
    }
    return this
  }

  public addPath(pa: Path): this {
    this.paths.push(pa)
    return this
  }
  public clonePaths(): Path[] {
    return this.paths.map(p => p.clone())
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
      paths: this.paths.map(p => p.toJson())
    }
  }

  public copy(svg: any extends Svg ? Svg : never): this {
    this.paths = svg.clonePaths()
    if (svg.width && this.width) {
      this.scalePath(svg.width / this.width)
    }
    return this
  }

  public toElement(): SVGSVGElement {
    return createSvgElement(
      { width: String(this.width), height: String(this.height) },
      this.paths.map(p => p.toElement())
    )
  }
  public toBase64(): string {
    return svg2base64(this.toElement().outerHTML)
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
    svgEl.querySelectorAll('path').forEach(pEl => {
      const pa = new Path().parsePathElement(pEl)
      if (pa.commands.length !== 0) {
        update.push(pa)
      }
    })
    this.paths = update
    const width = Number(svgEl.getAttribute('width'))
    if (width && this.width) {
      this.scalePath(this.width / width)
    }
    return this
  }
}
