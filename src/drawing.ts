import Two, { ConstructorParams } from 'two.js'

// TODO: Fix Two.vector constructor params
interface DrawingOption extends ConstructorParams {
  penColor: Two.Color
  penWidth: number
}
const defaultOption: DrawingOption = {
  penColor: '#333',
  penWidth: 10,
  type: Two.Types.svg
}
export function drawing(el: HTMLElement, option?: Partial<DrawingOption>): Two {
  const { penColor, penWidth, type } = {
    ...defaultOption,
    ...option
  }
  const two: Two = new Two({
    type,
    // fullscreen: false,
    width: el.clientWidth,
    height: el.clientHeight,
    autostart: true
  }).appendTo(el)
  const current: Two.Vector = new Two.Vector(0, 0)
  let line: Two.Path | null

  const move = ({ x, y }: { x: number; y: number }) => {
    const makePoint = (x: number, y: number) => {
      const v: { position: Two.Vector } & Two.Vector = new Two.Vector(x, y)
      v.position = new Two.Vector(0, 0).copy(v)
      return v as Two.Vector
    }
    if (!line) {
      const vprev: Two.Vector = makePoint(current.x, current.y)
      const vnext: Two.Vector = makePoint(x, y)
      line = two.makeCurve([vprev, vnext], true)
      line.noFill().stroke = penColor
      line.linewidth = penWidth
      line.vertices.map(v => {
        v.addSelf(line.translation)
      })
      line.translation.clear()
    } else {
      const v = makePoint(x, y)
      line.vertices.push(v as Two.Anchor)
    }
    current.set(x, y)
  }

  const mouseMove = (e: MouseEvent) => move({ x: e.clientX, y: e.clientY })
  const mouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', mouseMove)
    window.removeEventListener('mouseup', mouseUp)
  }
  const mouseDown = (e: MouseEvent) => {
    current.set(e.clientX, e.clientY)
    line = null
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseup', mouseUp)
  }
  window.addEventListener('mousedown', mouseDown)

  const touchMove = function(e: TouchEvent) {
    e.preventDefault()
    const touch = e.touches[0]
    move({
      x: touch.pageX,
      y: touch.pageY
    })
    return false
  }
  const touchEnd = (e: TouchEvent) => {
    e.preventDefault()
    window.removeEventListener('touchmove', touchMove)
    window.removeEventListener('touchend', touchEnd)
    return false
  }
  const touchStart = (e: TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    current.set(touch.pageX, touch.pageY)
    line = null
    window.addEventListener('touchmove', touchMove)
    window.addEventListener('touchend', touchEnd)
    return false
  }
  window.addEventListener('touchstart', touchStart)

  return two
}
