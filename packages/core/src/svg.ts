import { roundUp } from './shared/roundUp'
import { camel2kebab } from './shared/camel2kebab'
import { kebab2camel } from './shared/kebab2camel'
import { svg2base64 } from './shared/svg2base64'
import {
  createSvgElement,
  createSvgChildElement,
} from './shared/createSvgElement'
import { download } from './shared/download'

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
  QUADRATIC_CURVE_RELATIVE: 'q', // q 10 60 10 30
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

  public clone(): Command {
    return new Command(this.type, this.value.slice())
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

// TODO: improve key types
export interface PathObject {
  [key: string]: string | undefined
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

  public addCommand(param: Command | Command[]): this {
    if (Array.isArray(param)) {
      this.commands.push(...param)
    } else {
      this.commands.push(param)
    }
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
  public toElement(): SVGElement {
    const attrs = Object.entries(this.attrs).reduce(
      (acc, [key, val], _i) =>
        val
          ? {
              ...acc,
              [camel2kebab(key)]: val,
            }
          : acc,
      {}
    )
    return createSvgChildElement('path', {
      ...attrs,
      d: this.getCommandString(),
    })
  }

  public clone(): Path {
    const path = new Path(this.attrs)
    this.commands.map((c) => {
      path.commands.push(c.clone())
    })
    return path
  }
}

export interface SvgOption {
  width: number
  height: number
  background?: string
}

export interface SvgObject {
  width: number
  height: number
  background?: string
  paths: PathObject[]
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

  public scalePath(r: number): this {
    if (r !== 1) {
      for (let i = 0; i < this.paths.length; i += 1) {
        this.paths[i].scale(r)
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
      this.scalePath(this.width / svg.width)
    }
    return this
  }

  public toElement(): SVGSVGElement {
    const size = { width: String(this.width), height: String(this.height) }
    const bgEl = this.background
      ? [createSvgChildElement('rect', { ...size, fill: this.background })]
      : []

    return createSvgElement(
      { width: String(this.width), height: String(this.height) },
      bgEl.concat(this.paths.map((p) => p.toElement()))
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
    svgEl.querySelectorAll('path').forEach((pEl) => {
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

  // TODO: Add filename config
  public download(
    ext: 'svg' | 'png' | 'jpg' = 'svg',
    cb: typeof download = download
  ): void {
    if (ext === 'svg') {
      cb({
        data: this.toBase64(),
        extension: 'svg',
      })
      return
    }

    const img: any = new Image()
    const renderCanvas = () => {
      const canvas = document.createElement('canvas')
      canvas.setAttribute('width', String(this.width))
      canvas.setAttribute('height', String(this.height))
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      if (this.background || ext === 'jpg') {
        ctx.fillStyle = this.background || '#fff'
        ctx.fillRect(0, 0, this.width, this.height)
      }
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
