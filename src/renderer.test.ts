import { Point, Vector } from './renderer'

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
    // // command
    // {
    //     // move
    //     assert_eq!(Point { x: 1.0, y: 1.0 }.command_move(), "M 1 1");
    //     assert_eq!(Point { x: 1.1, y: 1.1 }.command_move(), "M 1.1 1.1");
    //     // line
    //     assert_eq!(Point { x: 1.0, y: 1.0 }.command_line(), " L 1 1");
    //     assert_eq!(Point { x: 1.1, y: 1.1 }.command_line(), " L 1.1 1.1");
    //     // Circuler
    //     assert_eq!(
    //         Point { x: 1.0, y: 1.0 }
    //             .command_circuler(&Point { x: 0.2, y: 1.2 }, &Point { x: 0.8, y: 1.2 }),
    //         " C 0.2 1.2 0.8 1.2 1 1"
    //     );
    // }
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
})
