import { svgObjectToElement } from './renderer'
import { Svg, Path, Command } from './svg'

describe('renderer.ts', () => {
  const svg = new Svg({ width: 500, height: 500 })
    // TODO: rewrite bezier curve test
    .addPath(
      new Path()
        .addCommand(new Command('M', [0, 0]))
        .addCommand(new Command('C', [0.2, 0.2, 0.6, 0.8, 1, 1]))
        .addCommand(new Command('C', [1.4, 1.2, 1.6, 1.2, 2, 1]))
        .addCommand(new Command('C', [2.4, 0.8, 2.8, 0.2, 3, 0]))
    )
    .addPath(
      new Path({
        strokeLinecap: 'square',
        strokeLinejoin: 'mitter',
      })
        .addCommand(new Command('M', [4, 4]))
        .addCommand(new Command('L', [9, 4]))
        .addCommand(new Command('L', [9, 8]))
        .addCommand(new Command('L', [3, 0]))
        .addCommand(new Command('Z'))
    )

  it('svgObjectToElement', () => {
    const el = svgObjectToElement(svg.toJson())
    expect(el).toMatchSnapshot()
  })
})
