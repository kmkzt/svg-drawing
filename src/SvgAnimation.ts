import Two, { ConstructorParams } from 'two.js'
import { svgFormatting } from './utils/svgFormatting'
export interface AnimationOption extends ConstructorParams {
  el: SvgAnimation['el']
  shakingRange?: SvgAnimation['shakingRange']
}

export class SvgAnimation extends Two {
  public shakingRange: number
  private el: HTMLElement
  constructor(params: AnimationOption) {
    super(params)
    /**
     * bind methods
     */
    this.animationStart = this.animationStart.bind(this)
    this.shaking = this.shaking.bind(this)
    this.initSvgXml = this.initSvgXml.bind(this)
    this.strokeAnimation = this.strokeAnimation.bind(this)
    this.loadScene = this.loadScene.bind(this)
    this.loadSvgXml = this.loadSvgXml.bind(this)
    /**
     * Setup parameter
     */
    // TODO: Fix Two.vector constructor params
    this.shakingRange = params.shakingRange || 2
    this.type = params.type || Two.Types.canvas
    this.el = params.el
    this.width = params.width || this.el.clientWidth
    this.height = params.height || this.el.clientHeight
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

    const sceneChildrenRestore = () =>
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
    this.bind('update', updateShake).play()
    return () => {
      this.unbind('update', updateShake)
      sceneChildrenRestore()
    }
  }
  /**
   * Load SCENE
   * @param {Two.Group} scene
   */
  public loadScene(scene: Two.Group) {
    this.clear()
    scene.children.map((twoObj: Two.Object) => {
      this.scene.add(twoObj.clone())
    })
    this.update()
  }
  /**
   * Load SVGXML
   * @param {string | SVGSVGElement} svgXml
   */
  public loadSvgXml(svgXml: string | SVGSVGElement) {
    const svgElement: SVGSVGElement | null = svgFormatting(svgXml)
    if (!svgElement) return
    const svgTwo: Two.Group = this.interpret(svgElement)
    this.clear()
    // get element width
    // TODO: getelement Refactor
    document.body.appendChild(svgElement)
    const originWidth = svgElement.clientWidth
    document.body.removeChild(svgElement)
    this.scene.scale = this.width / originWidth
    svgTwo.children.map((twoObj: Two.Object) => {
      this.scene.add(twoObj.clone())
    })
    this.scene.center().translation.set(this.width / 2, this.height / 2)
    this.update()
  }
  /**
   * DrawingStart
   */
  private animationStart(): SvgAnimation {
    this.appendTo(this.el)
    return this
  }
  // TODO: SvgElement XML test
  public initSvgXml(svgNode: SVGElement) {
    this.clear()
    const fresh: Two.Group = this.interpret(svgNode)
    ;(fresh as any).subdivide()
    this.scene.add(fresh)
  }

  public strokeAnimation() {
    const distances = calculateDistances(this.scene)
    const total = distances.reduce((to: number, d: number) => to + d, 0)
    const setEnding = (group: Two.Group, ti: number) => {
      const traversed: number = ti * total
      let current = 0
      group.children.map((child: Two.Object, i: number) => {
        const distance = distances[i]
        const min = current
        const max = current + distance
        ;(child as Two.Path).ending = cmap(traversed, min, max, 0, 1)
        current = max
      })
    }
    let t = 0
    const update = (...arg: any[]) => {
      if (t < 0.9999) {
        t += 0.00625
      } else {
        t = 0
      }
      setEnding(this.scene, t)
    }
    this.bind('update', update).play()
    return () => this.unbind('update', update)
  }
}

function calculateDistances(group: Two.Group): number[] {
  return group.children.reduce((distances: number[], child: Two.Object) => {
    let d: number = 0
    let a: Two.Vector
    if (!(child as Two.Path).vertices) return distances
    ;(child as Two.Path).vertices.map((b: Two.Vector, i: number) => {
      if (i > 0) {
        d += a.distanceTo(b)
      }
      a = b
    })
    return [...distances, d]
  }, [])
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(Math.min(v, max), min)

const map = (v: number, i1: number, i2: number, o1: number, o2: number) =>
  o1 + (o2 - o1) * ((v - i1) / (i2 - i1))

const cmap = (v: number, i1: number, i2: number, o1: number, o2: number) =>
  clamp(map(v, i1, i2, o1, o2), o1, o2)
