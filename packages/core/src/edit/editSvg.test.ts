import { EditSvg } from './editSvg'
import { Selector } from './selector'
import { parseSVGString } from '../parser'
import { Svg } from '../svg/svg'
import type { EditSvgObject, SvgClass } from '../types'

/** 'd' attributes must to be relative. */
const testSvgData =
  '<svg width="200" height="200">' +
  '<path id="path_0" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '<path id="path_1" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '<path id="path_2" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '</svg>'

describe('EditSvg', () => {
  let svg: SvgClass
  const selector = new Selector()

  beforeEach(() => {
    const parsedSvg = parseSVGString(testSvgData)
    svg = new Svg({ width: parsedSvg.width, height: parsedSvg.height })
    parsedSvg.elements.forEach((p, i) => {
      p.key = `path_key_${i}`
      svg.setElement(p)
    })
  })
  describe('changeAttributes', () => {
    it('Change attributes of paths', () => {
      const { key } = svg.elements[0]
      selector.select({
        type: 'path',
        key,
      })

      const edit = new EditSvg(svg, selector)

      edit.changeAttributes({ fill: '#ff0' })
      expect(svg.elements[0].attrs.fill).toBe('#ff0')
    })
    it.todo('Change attributes of multiple paths')
  })

  describe('translate', () => {
    const pathIndex = 0
    it('Translate path', () => {
      expect(svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c2 2 4 2 6 2 z'
      )

      selector.select({
        type: 'path',
        key: svg.elements[pathIndex].key,
      })
      const edit = new EditSvg(svg, selector)
      edit.translate({ x: 1, y: -1 })

      expect(svg.elements[pathIndex].getCommandString()).toBe(
        'M2 0 l1 1 c2 2 4 2 6 2 z'
      )
    })
    it('Translate command', () => {
      expect(svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c2 2 4 2 6 2 z'
      )

      selector.select({
        type: 'path/command',
        key: svg.elements[pathIndex].key,
        index: {
          command: 1,
        },
      })
      const edit = new EditSvg(svg, selector)
      edit.translate({ x: 1, y: -1 })

      expect(svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l2 0 c1 3 3 3 5 3 z'
      )
    })
    it('Translate anchor point', () => {
      selector.select({
        type: 'path/anchorPoint',
        key: svg.elements[pathIndex].key,
        index: {
          command: 2,
          point: 0,
        },
      })
      const edit = new EditSvg(svg, selector)
      edit.translate({ x: 1, y: -1 })

      expect(svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c3 1 4 2 6 2 z'
      )
    })
    it.todo('Translate multiple paths')
  })

  describe('scale', () => {
    it('Scale path', () => {
      selector.select({ type: 'path', key: svg.elements[0].key })
      const edit = new EditSvg(svg, selector)
      edit.scale(2)

      expect(svg.elements[0].getCommandString()).toBe(
        'M2 2 l2 2 c4 4 8 4 12 4 z'
      )
    })
    it.todo('Scale multiple path')
  })

  describe('scaleX', () => {
    it('Scale path on X axis.', () => {
      selector.select({ type: 'path', key: svg.elements[0].key })
      const edit = new EditSvg(svg, selector)
      edit.scaleX(2)

      expect(svg.elements[0].getCommandString()).toBe(
        'M2 1 l2 1 c4 2 8 2 12 2 z'
      )
    })
    it.todo('Scale multiple paths on X axis.')
  })

  describe('scaleY', () => {
    it('Scale path on Y axis.', () => {
      selector.select({
        type: 'path',
        key: svg.elements[0].key,
      })
      const edit = new EditSvg(svg, selector)
      edit.scaleY(2)

      expect(svg.elements[0].getCommandString()).toBe(
        'M1 2 l1 2 c2 4 4 4 6 4 z'
      )
    })
    it.todo('Scale multiple paths on Y axis.')
  })

  describe('resizeBoundingBox', () => {
    it.todo('Resize bounding box of selected path.')
    it.todo('Resize bounding box of selected multiple path.')
  })

  describe('delete', () => {
    describe('Delete path.', () => {
      it('Update paths', () => {
        expect(svg.elements.length).toBe(3)
        expect(svg.elements[0].attrs.id).toBe('path_0')
        expect(svg.elements[1].attrs.id).toBe('path_1')
        expect(svg.elements[2].attrs.id).toBe('path_2')

        selector.select({
          type: 'path',
          key: svg.elements[0].key,
        })
        const edit = new EditSvg(svg, selector)
        edit.delete()

        expect(svg.elements.length).toBe(2)
        expect(svg.elements[0].attrs.id).toBe('path_1')
        expect(svg.elements[1].attrs.id).toBe('path_2')
      })
    })
    it.todo('Delete commands')
    it.todo('Delete anchor point')
    it.todo('Delete multiple path')
  })

  describe('toJson', () => {
    it('Return EditSvgObject when selected path.', () => {
      selector.select({ type: 'path', key: svg.elements[0].key })
      const edit = new EditSvg(svg, selector)

      const result: EditSvgObject = {
        boundingBox: {
          position: {
            x: 1,
            y: 1,
          },
          selected: true,
          size: {
            height: 3,
            width: 7,
          },
          vertexes: [
            {
              point: {
                x: 1,
                y: 1,
              },
              type: 'LeftTop',
            },
            {
              point: {
                x: 8,
                y: 1,
              },
              type: 'RightTop',
            },
            {
              point: {
                x: 8,
                y: 4,
              },
              type: 'RightBottom',
            },
            {
              point: {
                x: 1,
                y: 4,
              },
              type: 'LeftBottom',
            },
          ],
        },
        elements: [
          {
            key: 'path_key_0',
            type: 'path',
            attributes: {
              d: 'M1 1 l1 1 c2 2 4 2 6 2 z',
              fill: '#f00',
              id: 'path_0',
              stroke: '#00f',
              strokeWidth: '4',
            },
            commands: [
              {
                anchorPoints: [],
                index: 0,
                outline: undefined,
                selected: false,
                value: {
                  x: 1,
                  y: 1,
                },
              },
              {
                anchorPoints: [],
                index: 1,
                outline: undefined,
                selected: false,
                value: {
                  x: 2,
                  y: 2,
                },
              },
              {
                anchorPoints: [
                  {
                    index: {
                      command: 2,
                      point: 1,
                    },
                    selected: false,
                    value: {
                      x: 6,
                      y: 4,
                    },
                  },
                ],
                index: 2,
                outline: 'M 6 4L 8 4',
                selected: false,
                value: {
                  x: 8,
                  y: 4,
                },
              },
            ],
          },
        ],
      }
      expect(edit.toJson()).toStrictEqual(result)
    })
  })
})
