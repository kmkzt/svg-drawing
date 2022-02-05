import { BoundingBox } from './boundingBox'
import { Curve, Move, Path, Point } from '../svg'

const exampleData = new Path()
  .addCommand(new Move(new Point(0, 0)))
  .addCommand(
    new Curve([new Point(20, 20), new Point(60, 80), new Point(100, 100)])
  )
  .addCommand(
    new Curve([new Point(140, 120), new Point(160, 120), new Point(200, 100)])
  )
  .addCommand(
    new Curve([new Point(240, 80), new Point(280, 20), new Point(300, 0)])
  )

describe('BoundingBox', () => {
  describe('BoundingBox of Curve Path', () => {
    const boundingBox = new BoundingBox([exampleData])
    it('boundingBox property', () => {
      expect(boundingBox.min).toEqual({ x: 0, y: 0 })
      expect(boundingBox.max).toEqual({ x: 300, y: 115 })

      expect(boundingBox.width).toEqual(300)
      expect(boundingBox.height).toEqual(120)
      expect(boundingBox.vertex).toEqual({
        LeftTop: { x: 0, y: 0 },
        RightTop: { x: 300, y: 0 },
        RightBottom: { x: 300, y: 115 },
        LeftBottom: { x: 0, y: 115 },
      })
    })

    it('boundingBox.resizeParams', () => {
      expect(boundingBox.resizeParams('LeftTop', { x: 0, y: 0 })).toEqual({
        scale: { x: 1, y: 1 },
        move: { x: 0, y: 0 },
      })
    })
  })
})
