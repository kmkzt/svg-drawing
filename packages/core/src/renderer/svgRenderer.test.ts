import { toElement } from './svgRenderer'
import { Path } from '../svg/path'
import { Svg } from '../svg/svg'

describe('svgRenderer.ts', () => {
  const svg = new Svg({ width: 500, height: 500 })
    // TODO: rewrite bezier curve test
    .addElement(
      new Path()
        .addCommand({ type: 'M', values: [0, 0] })
        .addCommand({ type: 'C', values: [0.2, 0.2, 0.6, 0.8, 1, 1] })
        .addCommand({ type: 'C', values: [1.4, 1.2, 1.6, 1.2, 2, 1] })
        .addCommand({ type: 'C', values: [2.4, 0.8, 2.8, 0.2, 3, 0] })
    )
    .addElement(
      new Path({
        strokeLinecap: 'square',
        strokeLinejoin: 'miter',
      })
        .addCommand({ type: 'M', values: [4, 4] })
        .addCommand({ type: 'L', values: [9, 4] })
        .addCommand({ type: 'L', values: [9, 8] })
        .addCommand({ type: 'L', values: [3, 0] })
        .addCommand({ type: 'Z', values: [] })
    )

  it('svgObjectToElement', () => {
    const el = toElement({ svg: svg.toJson() })
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
          stroke-linejoin="miter"
        />
      </svg>
    `)
  })
})
