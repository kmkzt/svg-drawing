import { toElement } from './svgRenderer'
import { EditSvg } from '../edit/editSvg'
import { Selector } from '../edit/selector'
import { createCommand } from '../svg/command'
import { Path } from '../svg/path'
import { Svg } from '../svg/svg'

describe('svgRenderer.ts', () => {
  const svg = new Svg({ width: 500, height: 500 })
    .setElement(
      new Path({}, 'p1').setCommands([
        createCommand({ type: 'M', values: [0, 0] }),
        createCommand({ type: 'C', values: [0.2, 0.2, 0.6, 0.8, 1, 1] }),
        createCommand({ type: 'C', values: [1.4, 1.2, 1.6, 1.2, 2, 1] }),
        createCommand({ type: 'C', values: [2.4, 0.8, 2.8, 0.2, 3, 0] }),
      ])
    )
    .setElement(
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

  describe('toElement', () => {
    it('SvgObject convert element', () => {
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

    it('EditSvgObject convert elemet', () => {
      const selector = new Selector()
      selector.select({
        key: 'p1',
        type: 'path',
      })

      const el = toElement({
        svg: svg.toJson(),
        edit: new EditSvg(svg, selector).toJson(),
      })

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
          <rect
            data-edit-type="bounding-box"
            fill="rgba(0,0,0,0.1)"
            height="1.15"
            stroke="#09f"
            width="3"
            x="0"
            y="0"
          />
          <circle
            cx="0"
            cy="0"
            data-edit-type="bounding-box/vertex"
            data-vertex-type="LeftTop"
            fill="rgba(0,0,0,0.1)"
            r="3"
            stroke="#09f"
          />
          <circle
            cx="3"
            cy="0"
            data-edit-type="bounding-box/vertex"
            data-vertex-type="RightTop"
            fill="rgba(0,0,0,0.1)"
            r="3"
            stroke="#09f"
          />
          <circle
            cx="3"
            cy="1.15"
            data-edit-type="bounding-box/vertex"
            data-vertex-type="RightBottom"
            fill="rgba(0,0,0,0.1)"
            r="3"
            stroke="#09f"
          />
          <circle
            cx="0"
            cy="1.15"
            data-edit-type="bounding-box/vertex"
            data-vertex-type="LeftBottom"
            fill="rgba(0,0,0,0.1)"
            r="3"
            stroke="#09f"
          />
          <g>
            <path
              data-edit-type="path"
              data-element-key="p1"
              fill="none"
              stroke-width="1"
            />
            <g>
              <circle
                cx="0"
                cy="0"
                data-command-index="0"
                data-edit-type="path/command"
                data-element-key="p1"
                fill="#f90"
                r="3"
              />
            </g>
            <g>
              <circle
                cx="1"
                cy="1"
                data-command-index="1"
                data-edit-type="path/command"
                data-element-key="p1"
                fill="#f90"
                r="3"
              />
            </g>
            <g>
              <circle
                cx="2"
                cy="1"
                data-command-index="2"
                data-edit-type="path/command"
                data-element-key="p1"
                fill="#f90"
                r="3"
              />
            </g>
            <g>
              <circle
                cx="3"
                cy="0"
                data-command-index="3"
                data-edit-type="path/command"
                data-element-key="p1"
                fill="#f90"
                r="3"
              />
            </g>
          </g>
        </svg>
      `)
    })
  })
})
