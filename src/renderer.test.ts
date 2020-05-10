import { Point, Vector, SvgPath, Renderer } from './renderer'

describe('renderer', () => {
  describe('Point', () => {
    it('add', () => {
      const po = new Point(1.0, 1.0).add(new Point(2.0, 2.0))
      expect(po.x).toBe(3.0)
      expect(po.y).toBe(3.0)
    })

    it('sub', () => {
      const po = new Point(3.0, 3.0).sub(new Point(1.0, 1.0))
      expect(po.x).toBe(2.0)
      expect(po.y).toBe(2.0)
    })

    it('sub', () => {
      const po = new Point(1.0, 1.0).scale(3)
      expect(po.x).toBe(3.0)
      expect(po.y).toBe(3.0)
    })

    it('toVector', () => {
      const vec = new Point(1.0, 1.0).toVector()
      expect(vec.value).toBe(1.4142135623730951)
      expect(vec.angle).toBe(0.7853981633974483)
    })
  })
  describe('Vector', () => {
    it('toPoint', () => {
      const po = new Vector(1.4142135, 0.7853982).toPoint()
      expect(po.x).toBe(1.0)
      expect(po.y).toBe(1.0)
    })
    it('scale', () => {
      const vec = new Vector(1.0, 0.5).scale(0.3)
      expect(vec.value).toBe(0.3)
      expect(vec.angle).toBe(0.5)
    })
  })
  describe('SvgPath', () => {
    it('addPoint', () => {
      const path = new SvgPath()
      path.addPoint(new Point(1, 1))
      expect(path.data.length).toBe(1)
      expect(path.data[0].x).toBe(1)
      expect(path.data[0].y).toBe(1)
    })
    it('scale', () => {
      const path = new SvgPath({ strokeWidth: 1 })
      path.addPoint(new Point(1, 1))
      path.scale(2)
      expect(path.strokeWidth).toBe(2)
      expect(path.data[0].x).toBe(2)
      expect(path.data[0].y).toBe(2)
    })
    it('createCommand Line', () => {
      const path = new SvgPath({ circuler: false, close: false })
      path.addPoint(new Point(0, 0))
      path.addPoint(new Point(1, 1))
      path.addPoint(new Point(-1, -1))
      expect(path.createCommand()).toBe('M 0 0 L 1 1 L -1 -1')
    })
    it('createCommand Line Close', () => {
      const path = new SvgPath({ circuler: false, close: true })
      path.addPoint(new Point(0, 0))
      path.addPoint(new Point(1, 1))
      path.addPoint(new Point(-1, -1))
      expect(path.createCommand()).toBe('M 0 0 L 1 1 L -1 -1 L 0 0 Z')
    })
    it('createCommand Circuler', () => {
      const path = new SvgPath({ circuler: true, close: false })
      path.addPoint(new Point(0, 0))
      path.addPoint(new Point(1, 1))
      path.addPoint(new Point(2, 1))
      path.addPoint(new Point(3, 0))
      expect(path.createCommand()).toBe(
        'M 0 0 C 0.2 0.2 0.6 0.8 1 1 C 1.4 1.2 1.6 1.2 2 1 C 2.4 0.8 2.8 0.2 3 0'
      )
    })
    it('createCommand Circuler Close', () => {
      const path = new SvgPath({ circuler: true, close: true })
      path.addPoint(new Point(0, 0))
      path.addPoint(new Point(1, 1))
      path.addPoint(new Point(2, 1))
      path.addPoint(new Point(3, 0))
      expect(path.createCommand()).toBe(
        'M 0 0 C 0.2 0.2 0.6 0.8 1 1 C 1.4 1.2 1.6 1.2 2 1 C 2.4 0.8 2.8 0.2 3 0 C 2.6 -0.2 0.4 -0.2 0 0 Z'
      )
    })
    it('toElement', () => {
      const path = new SvgPath({ circuler: true, close: false })
      path.addPoint(new Point(0, 0))
      path.addPoint(new Point(1, 1))
      path.addPoint(new Point(2, 1))
      path.addPoint(new Point(3, 0))
      expect(path.toElement()).toMatchSnapshot()
    })
  })
  describe('Renderer', () => {
    it('toElement', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const renderer = new Renderer(el)
      const path = new SvgPath({ circuler: true, close: false })
      path.addPoint(new Point(0, 0))
      path.addPoint(new Point(1, 1))
      path.addPoint(new Point(2, 1))
      path.addPoint(new Point(3, 0))
      renderer.addPath(path)
      expect(renderer.toElement()).toMatchSnapshot()
    })
  })
})
