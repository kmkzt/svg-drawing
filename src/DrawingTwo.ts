import Two, { ConstructorParams } from 'two.js'

// TODO: Fix Two.vector constructor params
export interface DrawingOption extends ConstructorParams {
  el: HTMLElement
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
  private el: HTMLElement
  constructor(params: DrawingOption) {
    super(params)
    /**
     * bind methods
     */
    this.clearListner = this.clearListner.bind(this)
    this.move = this.move.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.mouseMove = this.mouseMove.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
    this.shaking = this.shaking.bind(this)
    /**
     * Setup parameter
     */
    this.line = null
    this.current = new Two.Vector(0, 0)
    this.penColor = params.penColor || '#333'
    this.penWidth = params.penWidth || 10
    this.shakingRange = params.shakingRange || 2
    this.el = params.el
    this.width = this.el.clientWidth
    this.height = this.el.clientHeight
    this.appendTo(this.el)
    this.el.addEventListener('mousedown', this.mouseDown)
    this.el.addEventListener('touchstart', this.touchStart)
  }
  /**
   * Shaking Drawing line
   */
  public shaking(): () => void {
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
    return () => this.unbind('update', updateShake)
  }

  /**
   * listner clear
   */
  public clearListner() {
    this.el.removeEventListener('mousedown', this.mouseDown)
    this.el.removeEventListener('touchstart', this.touchStart)
  }
  private move({ x, y }: { x: number; y: number }): void {
    const makePoint = (mx: number, my: number) => {
      const v = new Two.Vector(mx, my)
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
    this.el.removeEventListener('mousemove', this.mouseMove)
    this.el.removeEventListener('mouseup', this.mouseUp)
  }
  private mouseDown(e: MouseEvent) {
    this.current.set(e.clientX, e.clientY)
    this.line = null
    this.el.addEventListener('mousemove', this.mouseMove)
    this.el.addEventListener('mouseup', this.mouseUp)
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
    this.el.removeEventListener('touchmove', this.touchMove)
    this.el.removeEventListener('touchend', this.touchEnd)
    return false
  }
  private touchStart(e: TouchEvent) {
    e.preventDefault()
    const touch = e.touches[0]
    this.current.set(touch.pageX, touch.pageY)
    this.line = null
    this.el.addEventListener('touchmove', this.touchMove)
    this.el.addEventListener('touchend', this.touchEnd)
    return false
  }
}
