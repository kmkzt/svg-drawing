import { EditSvg } from './editSvg'
import { parseSVGString } from '../parser'
import { Svg } from '../svg/svg'
import type { EditSvgObject } from '../types'

/** 'd' attributes must to be relative. */
const testSvgData =
  '<svg width="200" height="200">' +
  '<path id="path_0" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '<path id="path_1" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '<path id="path_2" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '</svg>'

describe('EditSvg', () => {
  let edit: EditSvg
  beforeEach(() => {
    const parsedSvg = parseSVGString(testSvgData)
    const svg = new Svg({ width: parsedSvg.width, height: parsedSvg.height })
    parsedSvg.elements.forEach((p, i) => {
      p.key = `path_key_${i}`
      svg.updateElement(p)
    })

    edit = new EditSvg(svg)
  })
  describe('changeAttributes', () => {
    it('Change attributes of selected paths', () => {
      const { key } = edit.svg.elements[0]
      edit.select({
        type: 'path',
        key,
      })
      edit.changeAttributes({ fill: '#ff0' })
      expect(edit.svg.elements[0].attrs.fill).toBe('#ff0')
    })
    it.todo('Selecting commands')
    it.todo('Selecting point')
    it.todo('Selecting Multiple path')
  })

  describe('translate', () => {
    const pathIndex = 0
    it('Translate selected path', () => {
      const { key } = edit.svg.elements[pathIndex]
      expect(edit.svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c2 2 4 2 6 2 z'
      )

      edit.select({
        type: 'path',
        key,
      })
      edit.translate({ x: 1, y: -1 })
      expect(edit.svg.elements[pathIndex].getCommandString()).toBe(
        'M2 0 l1 1 c2 2 4 2 6 2 z'
      )
    })
    it('Translate selected commands', () => {
      const key = edit.svg.elements[pathIndex].key
      expect(edit.svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c2 2 4 2 6 2 z'
      )

      edit.select({
        type: 'path/command',
        key,
        index: {
          command: 1,
        },
      })
      edit.translate({ x: 1, y: -1 })
      expect(edit.svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l2 0 c1 3 3 3 5 3 z'
      )
    })
    it('Translate selected point', () => {
      const editKey = edit.svg.elements[pathIndex].key
      expect(edit.svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c2 2 4 2 6 2 z'
      )

      edit.select({
        type: 'path/point',
        key: editKey,
        index: {
          command: 2,
          point: 0,
        },
      })
      edit.translate({ x: 1, y: -1 })
      expect(edit.svg.elements[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c3 1 4 2 6 2 z'
      )
    })
    it.todo('Selecting Multiple path')
  })

  describe('scale', () => {
    it('Selecting path', () => {
      const editKey = edit.svg.elements[0].key
      edit.select({ type: 'path', key: editKey })
      edit.scale(2)
      expect(edit.svg.elements[0].getCommandString()).toBe(
        'M2 2 l2 2 c4 4 8 4 12 4 z'
      )
    })
    it.todo('Selecting Multiple path')
  })

  describe('scaleX', () => {
    it('Selecting path', () => {
      const editKey = edit.svg.elements[0].key
      edit.select({ type: 'path', key: editKey })
      edit.scaleX(2)
      expect(edit.svg.elements[0].getCommandString()).toBe(
        'M2 1 l2 1 c4 2 8 2 12 2 z'
      )
    })
    it.todo('Selecting Multiple path')
  })

  describe('scaleY', () => {
    it('Selecting path', () => {
      const editKey = edit.svg.elements[0].key
      edit.select({ type: 'path', key: editKey })
      edit.scaleY(2)
      expect(edit.svg.elements[0].getCommandString()).toBe(
        'M1 2 l1 2 c2 4 4 4 6 4 z'
      )
    })
    it.todo('Selecting Multiple path')
  })

  describe('resizeFixedPosition', () => {
    it.todo('Selecting path')
    it.todo('Selecting commands')
    it.todo('Selecting point')
    it.todo('Selecting Multiple path')
  })

  describe('delete', () => {
    describe('Delete Selected path.', () => {
      it('Update paths', () => {
        const editKey = edit.svg.elements[0].key
        edit.select({ type: 'path', key: editKey })

        expect(edit.svg.elements.length).toBe(3)
        expect(edit.svg.elements[0].attrs.id).toBe('path_0')
        expect(edit.svg.elements[1].attrs.id).toBe('path_1')
        expect(edit.svg.elements[2].attrs.id).toBe('path_2')

        edit.delete()
        expect(edit.svg.elements.length).toBe(2)
        expect(edit.svg.elements[0].attrs.id).toBe('path_1')
        expect(edit.svg.elements[1].attrs.id).toBe('path_2')
      })
      it('Update selected status.', () => {
        const editKey = edit.svg.elements[0].key
        edit.select({ type: 'path', key: editKey })

        expect(edit.selected).toBe(true)

        edit.delete()
        expect(edit.selected).toBe(false)
      })
    })
    it.todo('Selecting commands')
    it.todo('Selecting point')
    it.todo('Selecting Multiple path')
  })

  it.todo('preview')

  it('toJson', () => {
    const { key } = edit.svg.elements[0]
    edit.select({ type: 'path', key })

    const result: EditSvgObject = {
      boundingBox: {
        position: {
          x: 1,
          y: 1,
        },
        size: {
          height: 3,
          width: 7,
        },
        vertexes: [
          {
            type: 'LeftTop',
            point: {
              x: 1,
              y: 1,
            },
          },
          {
            type: 'RightTop',
            point: {
              x: 8,
              y: 1,
            },
          },
          {
            type: 'RightBottom',
            point: {
              x: 8,
              y: 4,
            },
          },
          {
            type: 'LeftBottom',
            point: {
              x: 1,
              y: 4,
            },
          },
        ],
        selected: true,
      },
      elements: [
        {
          path: {
            attributes: {
              d: 'M1 1 l1 1 c2 2 4 2 6 2 z',
              fill: '#f00',
              id: 'path_0',
              stroke: '#00f',
              strokeWidth: '4',
            },
            key: 'path_key_0',
            type: 'path',
          },
          anchorPoints: [
            {
              d: 'M 2 2',
              points: [
                {
                  index: {
                    command: 0,
                    path: 'path_key_0',
                    point: 0,
                  },
                  selected: false,
                  value: {
                    x: 1,
                    y: 1,
                  },
                },
              ],
            },
            {
              d: 'M 4 4',
              points: [
                {
                  index: {
                    command: 1,
                    path: 'path_key_0',
                    point: 0,
                  },
                  selected: false,
                  value: {
                    x: 2,
                    y: 2,
                  },
                },
              ],
            },
            {
              d: 'M 6 4L 8 4',
              points: [
                {
                  index: {
                    command: 2,
                    path: 'path_key_0',
                    point: 0,
                  },
                  selected: false,
                  value: {
                    x: 4,
                    y: 4,
                  },
                },
                {
                  index: {
                    command: 2,
                    path: 'path_key_0',
                    point: 1,
                  },
                  selected: false,
                  value: {
                    x: 6,
                    y: 4,
                  },
                },
                {
                  index: {
                    command: 2,
                    path: 'path_key_0',
                    point: 2,
                  },
                  selected: false,
                  value: {
                    x: 8,
                    y: 4,
                  },
                },
              ],
            },
          ],
        },
      ],
    }

    expect(edit.toJson()).toStrictEqual(result)
  })
})
