import { svgObjectToElement } from './renderer'
import { Svg, Path, Move, Point, Curve, Line, Close } from './svg'

describe('renderer.ts', () => {
  const svg = new Svg({ width: 500, height: 500 })
    // TODO: rewrite bezier curve test
    .addPath(
      new Path()
        .addCommand(new Move(new Point(0, 0)))
        .addCommand(
          new Curve([new Point(0.2, 0.2), new Point(0.6, 0.8), new Point(1, 1)])
        )
        .addCommand(
          new Curve([new Point(1.4, 1.2), new Point(1.6, 1.2), new Point(2, 1)])
        )
        .addCommand(
          new Curve([new Point(2.4, 0.8), new Point(2.8, 0.2), new Point(3, 0)])
        )
    )
    .addPath(
      new Path({
        strokeLinecap: 'square',
        strokeLinejoin: 'mitter',
      })
        .addCommand(new Move(new Point(4, 4)))
        .addCommand(new Line(new Point(9, 4)))
        .addCommand(new Line(new Point(9, 8)))
        .addCommand(new Line(new Point(3, 0)))
        .addCommand(new Close())
    )

  it('svgObjectToElement', () => {
    const el = svgObjectToElement(svg.toJson())
    expect(el).toMatchInlineSnapshot(`
      <svg
        height="500"
        version="1.1"
        width="500"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M0 0 c0.2 0.2 0.6 0.8 1 1 c0.4 0.2 0.6 0.2 1 0 c0.4 -0.2 0.8 -0.8 1 -1"
        />
        <path
          d="M4 4 l5 0 l0 4 l-6 -8 z"
          stroke-linecap="square"
          stroke-linejoin="mitter"
        />
      </svg>
    `)
  })
})
