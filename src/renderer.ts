const roundUp = (num: number) => Math.round(num * 100) / 100

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

  public command_move() {
    return `M ${this.x} ${this.y}`
  }

  public command_line() {
    return ` L ${this.x} ${this.y}`
  }

  public command_circuler(l: Point, r: Point) {
    return ` C ${l.x} ${l.y} ${r.x} ${r.y} ${this.x} ${this.y}`
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
  background?: string
}
export class SvgPath {
  public close: boolean
  public circuler: boolean
  public strokeWidth: number
  public stroke: string
  public fill: string
  public background: string
  public smoothRatio: number
  // TODO: replace private parameter
  public data: Point[]

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
    this.background = this.background ?? '#fff'
    this.smoothRatio = 0.2
    this.data = []
  }

  public scale(r: number) {
    const update = this.data.map((p: Point) => p.scale(r))
    this.data = update
    this.strokeWidth *= r
  }

  public addPoint(p: Point) {
    this.data.push(p)
  }

  public createCommand(): string {
    if (this.data.length === 0) return ''
    const createControlPoint = (
      prev: Point,
      start: Point,
      next: Point
    ): Point => {
      const contolVectorPoint = next
        .sub(prev)
        .toVector()
        .scale(this.smoothRatio)
        .toPoint()
      return start.add(contolVectorPoint)
    }
    let command = this.data[0].command_move()
    const isCirculer = this.circuler && this.data.length > 2
    const endIndex = this.data.length - 1
    if (isCirculer) {
      for (let i = 1; i < this.data.length; i += 1) {
        const p1 = i === 1 ? this.data[0] : this.data[i - 2]
        const p2 = this.data[i - 1]
        const p3 = this.data[i]
        const p4 = i === endIndex ? this.data[i] : this.data[i + 1]
        command += this.data[i].command_circuler(
          createControlPoint(p1, p2, p3),
          createControlPoint(p4, p3, p2)
        )
      }
    } else {
      for (let i = 1; i < this.data.length; i += 1) {
        command += this.data[i].command_line()
      }
    }
    if (this.close) {
      if (isCirculer) {
        command += this.data[0].command_circuler(
          createControlPoint(
            this.data[endIndex - 1],
            this.data[endIndex],
            this.data[0]
          ),
          createControlPoint(this.data[1], this.data[0], this.data[endIndex])
        )
      } else {
        command += this.data[0].command_line()
      }
      command += ` Z`
    }
    return command
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
}
export class Renderer {
  private width: number
  private height: number
  private el: Element
  private paths: SvgPath[]
  constructor(el: Element, opt?: RendererOption) {
    this.el = el
    this.paths = []
    const { width, height } = el.getBoundingClientRect()
    this.width = width
    this.height = height

    this.scalePath = this.scalePath.bind(this)
    this.toElement = this.toElement.bind(this)
    this.setupAutoResizeElement()
  }

  private setupAutoResizeElement() {
    // TODO: fallback resize
    if ((window as any).ResizeObserver) {
      const resizeObserver: any = new (window as any).ResizeObserver(
        (entries: any[]) => {
          const { width, height }: any = entries[0].contentRect
          this.resizeElement(width, height)
        }
      )
      resizeObserver.observe(this.el)
    }
  }

  private resizeElement(width: number, height: number) {
    this.width = width
    this.width = height
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

  public toBase64(ext: 'svg' | 'jpg' | 'png' = 'svg'): string {
    const svgResource = `data:image/svg+xml;base64,${btoa(
      String(this.toElement())
    )}`
    return svgResource
  }
}
