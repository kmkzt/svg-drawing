import Two, { ConstructorParams } from 'two.js'
export interface AnimationOption extends ConstructorParams {
  el: SvgAnimation['el']
  shakingRange?: SvgAnimation['shakingRange']
}

export default class SvgAnimation extends Two {
  public shakingRange: number
  private el: HTMLElement
  constructor(params: AnimationOption) {
    super(params)
    /**
     * bind methods
     */
    this.animationStart = this.animationStart.bind(this)
    this.shaking = this.shaking.bind(this)
    /**
     * Setup parameter
     */
    // TODO: Fix Two.vector constructor params
    this.shakingRange = params.shakingRange || 2
    this.type = params.type || Two.Types.canvas
    this.el = params.el
    this.width = this.el.clientWidth
    this.height = this.el.clientHeight
    this.animationStart()
  }
  /**
   * Shaking Drawing line
   */
  public shaking(): () => void {
    const randomShaking = (): number =>
      Math.random() * this.shakingRange - this.shakingRange / 2
    const updateShake = (frameCount: any, timeDelta: any) => {
      // shake speed
      if (frameCount % 5 !== 0) return
      this.scene.children.map((child: Two.Object) => {
        if (!(child as Two.Path).vertices) return
        ;(child as Two.Path).vertices.map((v: Two.Anchor | any) => {
          // TODO: define position types
          // v.position is base position
          if (!v.position) {
            v.position = v.clone()
          }
          v.x = v.position.x + randomShaking()
          v.y = v.position.y + randomShaking()
        })
      })
    }

    // to fix original position
    const toBasePosition = () =>
      this.scene.children.map((child: Two.Object) => {
        this.scene.children.map((child: Two.Object) => {
          const vertices = (child as Two.Path).vertices
          if (!vertices) return
          vertices.map((v: Two.Anchor | any) => {
            // TODO: define position types
            if (!v.position) {
              return
            }
            v.x = v.position.x
            v.y = v.position.y
            delete v.position
          })
        })
      })
    this.bind('update', updateShake).play()
    return () => {
      this.unbind('update', updateShake)
      toBasePosition()
    }
  }
  /**
   * DrawingStart
   */
  private animationStart(): SvgAnimation {
    this.appendTo(this.el)
    return this
  }
}

// Refference -> https://two.js.org/examples/animate-stroke.html
//
// $(function() {
//   var type = /(canvas|webgl)/.test(url.type) ? url.type : 'svg'
//   var two = new Two({
//     type: Two.Types[type],
//     fullscreen: true
//   }).appendTo(document.body)

//   $.get('../images/fresh.svg', function(doc) {
//     var fresh = two.interpret($(doc).find('svg')[0])
//     fresh.subdivide()
//     fresh.noFill()
//     var t = 0
//     var startOver,
//       movingmouse = false
//     var clearT = function() {
//       t = 0
//       setEnding(fresh, 0)
//       startOver = _.after(60, clearT)
//     }
//     var stopMouse = _.debounce(function() {
//       movingmouse = false
//     }, 1000)

//     fresh.center().translation.set(two.width / 2, two.height / 2)
//     fresh.distances = calculateDistances(fresh)
//     fresh.total = 0
//     fresh.stroke = 'white'
//     fresh.linewidth = 40
//     _.each(fresh.distances, function(d) {
//       fresh.total += d
//     })

//     clearT()

//     $(window)
//       .bind('mousemove', mousemove)
//       .bind('touchmove', function(e) {
//         var touch = e.originalEvent.changedTouches[0]
//         mousemove({
//           clientX: touch.pageX,
//           clientY: touch.pageY
//         })
//         return false
//       })

//     resize()
//     two
//       .bind('resize', resize)
//       .bind('update', function() {
//         if (movingmouse) {
//           return
//         }

//         if (t < 0.9999) {
//           t += 0.00625
//         } else {
//           startOver()
//         }

//         setEnding(fresh, t)
//       })
//       .play()

//     function resize() {
//       fresh.translation.set(two.width / 2, two.height / 2)
//     }

//     function mousemove(e) {
//       var rect = fresh.getBoundingClientRect()
//       movingmouse = true
//       t = cmap(e.clientX, rect.left, rect.right, 0, 1)
//       setEnding(fresh, t)
//       stopMouse()
//     }

//     function setEnding(group, t) {
//       var i = 0
//       var traversed = t * group.total
//       var current = 0

//       _.each(group.children, function(child) {
//         var distance = group.distances[i]
//         var min = current
//         var max = current + distance
//         var pct = cmap(traversed, min, max, 0, 1)
//         child.ending = pct
//         current = max
//         i++
//       })
//     }
//   })
// })

function calculateDistances(group: Two.Group) {
  return group.children.map((child: Two.Object) => {
    let d: number = 0
    let a: Two.Vector
    if (!(child as Two.Path).vertices) return
    ;(child as Two.Path).vertices.map((b: Two.Vector, i: number) => {
      if (i > 0) {
        d += a.distanceTo(b)
      }
      a = b
    })
    return d
  })
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(Math.min(v, max), min)

const map = (v: number, i1: number, i2: number, o1: number, o2: number) =>
  o1 + (o2 - o1) * ((v - i1) / (i2 - i1))

const cmap = (v: number, i1: number, i2: number, o1: number, o2: number) =>
  clamp(map(v, i1, i2, o1, o2), o1, o2)
