import Two from 'two.js'
import { createGrid } from './createGrid'
function main() {
  //   const type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg'
  const type = 'svg'
  const two = new Two({
    type: Two.Types[type],
    fullscreen: true,
    autostart: true
  }).appendTo(document.body)

  let x: number
  let y: number
  let line: Two.Path | null
  let mouse: Two.Vector = new Two.Vector()
  const randomness = 2

  const drag = (
    e:
      | MouseEvent
      | {
          clientX: number
          clientY: number
        }
  ) => {
    x = e.clientX
    y = e.clientY
    if (!line) {
      const v1: Two.Vector = makePoint(mouse)
      const v2: Two.Vector = makePoint(x, y)
      line = two.makeCurve([v1, v2], true)
      line.noFill().stroke = '#333'
      line.linewidth = 10
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

  const dragEnd = (e: MouseEvent) => {
    window.removeEventListener('mousemove', drag)
    window.removeEventListener('mouseup', dragEnd)
  }

  const touchDrag = function(e: TouchEvent) {
    e.preventDefault()
    // jQuery -> originalEvent
    // const touch = e.originalEvent.changedTouches[0]
    const touch = e.touches[0]
    drag({
      clientX: touch.pageX,
      clientY: touch.pageY
    })
    return false
  }

  const touchEnd = (e: TouchEvent) => {
    e.preventDefault()
    window.removeEventListener('touchmove', touchDrag)
    window.removeEventListener('touchend', touchEnd)
    return false
  }
  const mouseDown = (e: MouseEvent) => {
    mouse.set(e.clientX, e.clientY)
    line = null
    window.addEventListener('mousemove', drag)
    window.addEventListener('mouseup', dragEnd)
  }
  window.addEventListener('mousedown', mouseDown)
  const touchStart = (e: TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    mouse.set(touch.pageX, touch.pageY)
    line = null
    window.addEventListener('touchmove', touchDrag)
    window.addEventListener('touchend', touchEnd)
    return false
  }
  window.addEventListener('touchstart', touchStart)

  two.bind('update', (frameCount, timeDelta) => {
    two.scene.children.map((child: Two.Object | any) => {
      child.vertices.map((v: any) => {
        if (!v.position) {
          return
        }
        v.x = v.position.x + (Math.random() * randomness - randomness / 2)
        v.y = v.position.y + (Math.random() * randomness - randomness / 2)
      })
    })
  })

  function makePoint(x: number | any, y?: number) {
    if (arguments.length <= 1) {
      y = x.y
      x = x.x
    }
    const v: any = new Two.Vector(x, y)
    v.position = new Two.Vector().copy(v)
    return v as Two.Vector
  }
}

main()
createGrid()
