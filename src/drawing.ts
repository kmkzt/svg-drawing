import Two from 'two.js'

interface DrawingOption {
  penColor: Two.Color
  penWidth: number
}
export function drawing(
  el: HTMLElement,
  { penColor, penWidth }: DrawingOption = {
    penColor: '#333',
    penWidth: 10
  }
): Two {
  //   const type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg'
  const type = 'svg'
  const two: Two = new Two({
    type: Two.Types[type],
    fullscreen: true,
    autostart: true
  }).appendTo(el)

  let x: number
  let y: number
  let line: Two.Path | null
  let mouse: Two.Vector = new Two.Vector()

  const setPoint = (m: Two.Vector) => makePoint(m.x, m.y)
  const makePoint = (x: number, y: number) => {
    const v: any = new Two.Vector(x, y)
    v.position = new Two.Vector().copy(v)
    return v as Two.Vector
  }
  const move = ({ x, y }: { x: number; y: number }) => {
    if (!line) {
      const v1: Two.Vector = setPoint(mouse)
      const v2: Two.Vector = makePoint(x, y)
      line = two.makeCurve([v1, v2], true)
      line.noFill().stroke = penColor
      line.linewidth = penWidth
      line.vertices.map(v => {
        v.addSelf(line.translation)
      })
      line.translation.clear()
    } else {
      var v1 = makePoint(x, y)
      line.vertices.push(v1 as any)
    }
    mouse.set(x, y)
  }

  const mouseMove = (e: MouseEvent) => move({ x: e.clientX, y: e.clientY })
  const mouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', mouseMove)
    window.removeEventListener('mouseup', mouseUp)
  }
  const mouseDown = (e: MouseEvent) => {
    mouse.set(e.clientX, e.clientY)
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
    mouse.set(touch.pageX, touch.pageY)
    line = null
    window.addEventListener('touchmove', touchMove)
    window.addEventListener('touchend', touchEnd)
    return false
  }
  window.addEventListener('touchstart', touchStart)

  return two
}
