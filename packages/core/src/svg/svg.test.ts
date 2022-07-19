import { Close, Curve, Line, Move } from './command'
import { Path } from './path'
import { Point } from './point'
import { Svg } from './svg'

describe('Svg', () => {
  it('Initialize attributes', () => {
    const attributes = { width: 500, height: 300, background: '#f00' }
    const svg = new Svg(attributes)

    expect(svg.width).toBe(attributes.width)
    expect(svg.height).toBe(attributes.height)
    expect(svg.background).toBe(attributes.background)
  })

  describe('addPath', () => {
    it('Add an array of paths', () => {
      const svg = new Svg({ width: 500, height: 500 }).addPath([
        new Path(undefined, 'p1')
          .addCommand(new Move(new Point(0, 0)))
          .addCommand(
            new Curve([
              new Point(0.2, 0.2),
              new Point(0.6, 0.8),
              new Point(1, 1),
            ])
          )
          .addCommand(
            new Curve([
              new Point(1.4, 1.2),
              new Point(1.6, 1.2),
              new Point(2, 1),
            ])
          )
          .addCommand(
            new Curve([
              new Point(2.4, 0.8),
              new Point(2.8, 0.2),
              new Point(3, 0),
            ])
          ),
        new Path(
          {
            strokeLinecap: 'square',
            strokeLinejoin: 'mitter',
          },
          'p2'
        )
          .addCommand(new Move(new Point(4, 4)))
          .addCommand(new Line(new Point(9, 4)))
          .addCommand(new Line(new Point(9, 8)))
          .addCommand(new Line(new Point(3, 0)))
          .addCommand(new Close()),
      ])

      expect(svg.toJson()).toMatchInlineSnapshot(`
        Object {
          "background": undefined,
          "height": 500,
          "paths": Array [
            Object {
              "attributes": Object {
                "d": "M0 0 c0.2 0.2 0.6 0.8 1 1 c0.4 0.2 0.6 0.2 1 0 c0.4 -0.2 0.8 -0.8 1 -1",
              },
              "key": "p1",
              "type": "path",
            },
            Object {
              "attributes": Object {
                "d": "M4 4 l5 0 l0 4 l-6 -8 z",
                "strokeLinecap": "square",
                "strokeLinejoin": "mitter",
              },
              "key": "p2",
              "type": "path",
            },
          ],
          "width": 500,
        }
      `)
    })

    it('Add path', () => {
      const svg = new Svg({ width: 500, height: 500 })
        .addPath(
          new Path(undefined, 'p1')
            .addCommand(new Move(new Point(0, 0)))
            .addCommand(
              new Curve([
                new Point(0.2, 0.2),
                new Point(0.6, 0.8),
                new Point(1, 1),
              ])
            )
            .addCommand(
              new Curve([
                new Point(1.4, 1.2),
                new Point(1.6, 1.2),
                new Point(2, 1),
              ])
            )
            .addCommand(
              new Curve([
                new Point(2.4, 0.8),
                new Point(2.8, 0.2),
                new Point(3, 0),
              ])
            )
        )
        .addPath(
          new Path(
            {
              strokeLinecap: 'square',
              strokeLinejoin: 'mitter',
            },
            'p2'
          )
            .addCommand(new Move(new Point(4, 4)))
            .addCommand(new Line(new Point(9, 4)))
            .addCommand(new Line(new Point(9, 8)))
            .addCommand(new Line(new Point(3, 0)))
            .addCommand(new Close())
        )

      expect(svg.toJson()).toMatchInlineSnapshot(`
        Object {
          "background": undefined,
          "height": 500,
          "paths": Array [
            Object {
              "attributes": Object {
                "d": "M0 0 c0.2 0.2 0.6 0.8 1 1 c0.4 0.2 0.6 0.2 1 0 c0.4 -0.2 0.8 -0.8 1 -1",
              },
              "key": "p1",
              "type": "path",
            },
            Object {
              "attributes": Object {
                "d": "M4 4 l5 0 l0 4 l-6 -8 z",
                "strokeLinecap": "square",
                "strokeLinejoin": "mitter",
              },
              "key": "p2",
              "type": "path",
            },
          ],
          "width": 500,
        }
      `)
    })
  })

  describe('clone', () => {
    let svg: Svg
    beforeEach(() => {
      svg = new Svg({ width: 500, height: 500 })
        .addPath(
          new Path(undefined, 'p1')
            .addCommand(new Move(new Point(0, 0)))
            .addCommand(
              new Curve([
                new Point(0.2, 0.2),
                new Point(0.6, 0.8),
                new Point(1, 1),
              ])
            )
            .addCommand(
              new Curve([
                new Point(1.4, 1.2),
                new Point(1.6, 1.2),
                new Point(2, 1),
              ])
            )
            .addCommand(
              new Curve([
                new Point(2.4, 0.8),
                new Point(2.8, 0.2),
                new Point(3, 0),
              ])
            )
        )
        .addPath(
          new Path(
            {
              strokeLinecap: 'square',
              strokeLinejoin: 'mitter',
            },
            'p2'
          )
            .addCommand(new Move(new Point(4, 4)))
            .addCommand(new Line(new Point(9, 4)))
            .addCommand(new Line(new Point(9, 8)))
            .addCommand(new Line(new Point(3, 0)))
            .addCommand(new Close())
        )
    })

    it('Return the same object.', () => {
      const cloneSvg = svg.clone()

      expect(cloneSvg.toJson()).toEqual(svg.toJson())
    })

    it('Cloned object changes have no effect the original object.', () => {
      const cloneSvg = svg.clone()

      cloneSvg.updatePath(cloneSvg.paths[0].scale(2))

      expect(cloneSvg.paths[0].toJson()).not.toEqual(svg.paths[0].toJson())
    })
  })
})
