import { toElement } from './svgRenderer'
import { createCommand } from '../svg/command'
import { Path } from '../svg/path'
import { Svg } from '../svg/svg'

describe('svgRenderer.ts', () => {
  const svg = new Svg({ width: 500, height: 500 })
    .updateElement(
      new Path({}, 'p1').setCommands([
        createCommand({ type: 'M', values: [0, 0] }),
        createCommand({ type: 'C', values: [0.2, 0.2, 0.6, 0.8, 1, 1] }),
        createCommand({ type: 'C', values: [1.4, 1.2, 1.6, 1.2, 2, 1] }),
        createCommand({ type: 'C', values: [2.4, 0.8, 2.8, 0.2, 3, 0] }),
      ])
    )
    .updateElement(
      new Path(
        {
          strokeLinecap: 'square',
          strokeLinejoin: 'miter',
        },
        'p2'
      ).setCommands([
        createCommand({ type: 'M', values: [4, 4] }),
        createCommand({ type: 'L', values: [9, 4] }),
        createCommand({ type: 'L', values: [9, 8] }),
        createCommand({ type: 'L', values: [3, 0] }),
        createCommand({ type: 'Z', values: [] }),
      ])
    )

  it('toElement', () => {
    const el = toElement({ svg: svg.toJson() })
    expect(el).toMatchInlineSnapshot(`
      <svg
        data-edit-type="frame"
        height="500"
        version="1.1"
        width="500"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M0 0 c0.2 0.2 0.6 0.8 1 1 c0.4 0.2 0.6 0.2 1 0 c0.4 -0.2 0.8 -0.8 1 -1"
          data-edit-type="path"
          data-element-key="p1"
        />
        <path
          d="M4 4 l5 0 l0 4 l-6 -8 z"
          data-edit-type="path"
          data-element-key="p2"
          stroke-linecap="square"
          stroke-linejoin="miter"
        />
      </svg>
    `)
  })
})
