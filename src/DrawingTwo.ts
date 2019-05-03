import Two, { ConstructorParams } from 'two.js'

// TODO: Fix Two.vector constructor params
export interface DrawingOption extends ConstructorParams {
  penColor?: Two.Color
  penWidth?: number
  shakingRange?: number
}
export default class DrawingTwo extends Two {
  public penColor: Two.Color
  public penWidth: number
  public shakingRange: number
  private line: Two.Path | null
  private current: Two.Vector
  constructor(params: DrawingOption) {
    super(params)
    this.line = null
    this.current = new Two.Vector(0, 0)
    this.penColor = params.penColor || '#333'
    this.penWidth = params.penWidth || 10
    this.shakingRange = params.shakingRange || 2
    this.clearListner = this.clearListner.bind(this)
    this.move = this.move.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.mouseMove = this.mouseMove.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
    this.shaking
    window.addEventListener('mousedown', this.mouseDown)
    window.addEventListener('touchstart', this.touchStart)
  }

  /**
   * Shaking Drawing line
   */
  public shaking(): void {
    const random: number = this.shakingRange
    const updateShake = (frameCount: any, timeDelta: any) => {
      this.scene.children.map((child: Two.Object | any) => {
        child.vertices.map((v: any) => {
          if (!v.position) {
            return
          }
          v.x = v.position.x + (Math.random() * random - random / 2)
          v.y = v.position.y + (Math.random() * random - random / 2)
        })
      })
    }
    this.bind('update', updateShake)
  }

  /**
   * listner clear
   */
  public clearListner() {
    window.removeEventListener('mousedown', this.mouseDown)
    window.removeEventListener('touchstart', this.touchStart)
  }
  private move({ x, y }: { x: number; y: number }): void {
    const makePoint = (mx: number, my: number) => {
      const v: { position: Two.Vector } & Two.Vector = new Two.Vector(mx, my)
      v.position = new Two.Vector(0, 0).copy(v)
      return v as Two.Vector
    }
    if (!this.line) {
      const vprev: Two.Vector = makePoint(this.current.x, this.current.y)
      const vnext: Two.Vector = makePoint(x, y)
      this.line = this.makeCurve([vprev, vnext], true)
      this.line.noFill().stroke = this.penColor
      this.line.linewidth = this.penWidth
      this.line.vertices.map(v => {
        if (!this.line) return
        v.addSelf(this.line.translation)
      })
      this.line.translation.clear()
    } else {
      const v = makePoint(x, y)
      this.line.vertices.push(v as Two.Anchor)
    }
    this.current.set(x, y)
  }

  private mouseMove(e: MouseEvent): void {
    return this.move({ x: e.clientX, y: e.clientY })
  }
  private mouseUp(e: MouseEvent) {
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mouseup', this.mouseUp)
  }
  private mouseDown(e: MouseEvent) {
    this.current.set(e.clientX, e.clientY)
    this.line = null
    window.addEventListener('mousemove', this.mouseMove)
    window.addEventListener('mouseup', this.mouseUp)
  }

  private touchMove(e: TouchEvent) {
    e.preventDefault()
    const touch = e.touches[0]
    this.move({
      x: touch.pageX,
      y: touch.pageY
    })
    return false
  }
  private touchEnd(e: TouchEvent) {
    e.preventDefault()
    window.removeEventListener('touchmove', this.touchMove)
    window.removeEventListener('touchend', this.touchEnd)
    return false
  }
  private touchStart(e: TouchEvent) {
    e.preventDefault()
    const touch = e.touches[0]
    this.current.set(touch.pageX, touch.pageY)
    this.line = null
    window.addEventListener('touchmove', this.touchMove)
    window.addEventListener('touchend', this.touchEnd)
    return false
  }
}
