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
      expect(boundingBox.min).toMatchInlineSnapshot(`
        Object {
          "x": 0,
          "y": 0,
        }
      `)
      expect(boundingBox.max).toMatchInlineSnapshot(`
        Object {
          "x": 300,
          "y": 115,
        }
      `)

      expect(boundingBox.width).toMatchInlineSnapshot(`300`)
      expect(boundingBox.height).toMatchInlineSnapshot(`115`)
      expect(boundingBox.vertex).toMatchInlineSnapshot(`
        Object {
          "LeftBottom": Object {
            "x": 0,
            "y": 115,
          },
          "LeftTop": Object {
            "x": 0,
            "y": 0,
          },
          "RightBottom": Object {
            "x": 300,
            "y": 115,
          },
          "RightTop": Object {
            "x": 300,
            "y": 0,
          },
        }
      `)
    })

    it('boundingBox.resizeParams', () => {
      expect(
        boundingBox.resizeParams('LeftTop', {
          x: -boundingBox.width,
          y: -boundingBox.height,
        })
      ).toMatchInlineSnapshot(`
        Object {
          "move": Object {
            "x": -300,
            "y": -115,
          },
          "scale": Object {
            "x": 2,
            "y": 2,
          },
        }
      `)

      expect(
        boundingBox.resizeParams('RightTop', {
          x: boundingBox.width,
          y: -boundingBox.height,
        })
      ).toMatchInlineSnapshot(`
        Object {
          "move": Object {
            "x": -0,
            "y": -115,
          },
          "scale": Object {
            "x": 2,
            "y": 2,
          },
        }
      `)

      expect(
        boundingBox.resizeParams('RightBottom', {
          x: boundingBox.width,
          y: boundingBox.height,
        })
      ).toMatchInlineSnapshot(`
        Object {
          "move": Object {
            "x": -0,
            "y": -0,
          },
          "scale": Object {
            "x": 2,
            "y": 2,
          },
        }
      `)

      expect(
        boundingBox.resizeParams('LeftBottom', {
          x: -boundingBox.width,
          y: boundingBox.height,
        })
      ).toMatchInlineSnapshot(`
        Object {
          "move": Object {
            "x": -300,
            "y": -0,
          },
          "scale": Object {
            "x": 2,
            "y": 2,
          },
        }
      `)
    })
  })
})
