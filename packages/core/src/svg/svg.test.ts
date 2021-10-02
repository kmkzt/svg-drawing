import { Close, Curve, Line, Move } from './command'
import { Path } from './path'
import { Point } from './point'
import { Svg } from './svg'

describe('Svg', () => {
  let svg: Svg
  beforeEach(() => {
    svg = new Svg({ width: 500, height: 500 })
      // TODO: rewrite bezier curve test
      .addPath(
        new Path()
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
  })

  it('parseSVGString', () => {
    expect(
      new Svg({ width: 400, height: 400 }).parseSVGString(`
      <svg width="200" height="200">
        <path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
      </svg>`)
    ).toMatchSnapshot()
  })
  it('parseSVGElement', () => {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgEl.setAttribute('width', '200')
    svgEl.setAttribute('height', '200')
    const pathEl = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    pathEl.setAttribute('fill', '#f00')
    pathEl.setAttribute('stroke', '#00f')
    pathEl.setAttribute('stroke-width', '4')
    pathEl.setAttribute('d', 'M 1 1 L 2 2 C 3 3 5 3 7 3 Z')
    svgEl.appendChild(pathEl)
    expect(
      new Svg({ width: 400, height: 400 }).parseSVGElement(svgEl)
    ).toMatchSnapshot()
  })
  // TODO: Fix width, height
  it('toJson', () => {
    expect(svg.toJson()).toMatchSnapshot()
  })
})
