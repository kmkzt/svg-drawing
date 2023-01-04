import { createCommand } from './command'
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

  describe('resize', () => {
    it('Update the values of the width and height properties.', () => {
      const attributes = { width: 100, height: 100 }
      const svg = new Svg(attributes)

      const resizeArgs = { width: 200, height: 300 }
      svg.resize(resizeArgs)

      expect(svg.width).toBe(resizeArgs.width)
      expect(svg.height).toBe(resizeArgs.height)
    })

    it('Resize the path to fit the resized width.', () => {
      const svg = new Svg({ width: 100, height: 100 })

      const testPath = new Path(undefined, 'p1').addCommand([
        {
          type: 'M',
          values: [0, 0],
        },
        {
          type: 'C',
          values: [0.2, 0.2, 0.6, 0.8, 1, 1],
        },
        {
          type: 'C',
          values: [1.4, 1.2, 1.6, 1.2, 2, 1],
        },
        {
          type: 'C',
          values: [2.4, 0.8, 2.8, 0.2, 3, 0],
        },
      ])

      svg.updateElement(testPath)

      const resizeArgs = { width: 200, height: 300 }
      svg.resize(resizeArgs)

      expect(testPath.scale(resizeArgs.width / svg.width).toJson()).toEqual(
        svg.elements[0].toJson()
      )
    })
  })

  describe('copy', () => {
    it('Resize path of copied object.', () => {
      const svg = new Svg({ width: 100, height: 100 })

      const testPath = new Path(undefined, 'p1').addCommand([
        {
          type: 'M',
          values: [0, 0],
        },
        {
          type: 'C',
          values: [0.2, 0.2, 0.6, 0.8, 1, 1],
        },
        {
          type: 'C',
          values: [1.4, 1.2, 1.6, 1.2, 2, 1],
        },
        {
          type: 'C',
          values: [2.4, 0.8, 2.8, 0.2, 3, 0],
        },
      ])

      const copiedSvg = new Svg({ width: 200, height: 200 })
      copiedSvg.updateElement(testPath)

      svg.copy(copiedSvg)

      expect(svg.elements[0].toJson()).toEqual(
        copiedSvg.elements[0].scale(svg.width / copiedSvg.width).toJson()
      )
    })
  })

  describe('setElements', () => {
    it('Add an array of paths', () => {
      const svg = new Svg({ width: 500, height: 500 }).setElements([
        new Path(undefined, 'p1').addCommand([
          {
            type: 'M',
            values: [0, 0],
          },
          {
            type: 'C',
            values: [0.2, 0.2, 0.6, 0.8, 1, 1],
          },
          {
            type: 'C',
            values: [1.4, 1.2, 1.6, 1.2, 2, 1],
          },
          {
            type: 'C',
            values: [2.4, 0.8, 2.8, 0.2, 3, 0],
          },
        ]),
        new Path(
          {
            strokeLinecap: 'square',
            strokeLinejoin: 'miter',
          },
          'p2'
        ).addCommand([
          {
            type: 'M',
            values: [4, 4],
          },
          {
            type: 'L',
            values: [9, 4],
          },
          {
            type: 'L',
            values: [9, 8],
          },
          {
            type: 'L',
            values: [3, 0],
          },
          {
            type: 'Z',
            values: [],
          },
        ]),
      ])

      expect(svg.toJson()).toMatchInlineSnapshot(`
        Object {
          "background": undefined,
          "elements": Array [
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
                "strokeLinejoin": "miter",
              },
              "key": "p2",
              "type": "path",
            },
          ],
          "height": 500,
          "width": 500,
        }
      `)
    })

    it('Add path', () => {
      const svg = new Svg({ width: 500, height: 500 })
        .updateElement(
          new Path(undefined, 'p1').addCommand([
            {
              type: 'M',
              values: [0, 0],
            },
            {
              type: 'C',
              values: [0.2, 0.2, 0.6, 0.8, 1, 1],
            },
            {
              type: 'C',
              values: [1.4, 1.2, 1.6, 1.2, 2, 1],
            },
            {
              type: 'C',
              values: [2.4, 0.8, 2.8, 0.2, 3, 0],
            },
          ])
        )
        .updateElement(
          new Path(
            {
              strokeLinecap: 'square',
              strokeLinejoin: 'miter',
            },
            'p2'
          ).addCommand([
            {
              type: 'M',
              values: [4, 4],
            },
            {
              type: 'L',
              values: [9, 4],
            },
            {
              type: 'L',
              values: [9, 8],
            },
            {
              type: 'L',
              values: [3, 0],
            },
            {
              type: 'Z',
              values: [],
            },
          ])
        )

      expect(svg.toJson()).toMatchInlineSnapshot(`
        Object {
          "background": undefined,
          "elements": Array [
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
                "strokeLinejoin": "miter",
              },
              "key": "p2",
              "type": "path",
            },
          ],
          "height": 500,
          "width": 500,
        }
      `)
    })
  })

  describe('clone', () => {
    let svg: Svg
    beforeEach(() => {
      svg = new Svg({ width: 500, height: 500 })
        .updateElement(
          new Path(undefined, 'p1').addCommand([
            {
              type: 'M',
              values: [0, 0],
            },
            {
              type: 'C',
              values: [0.2, 0.2, 0.6, 0.8, 1, 1],
            },
            {
              type: 'C',
              values: [1.4, 1.2, 1.6, 1.2, 2, 1],
            },
            {
              type: 'C',
              values: [2.4, 0.8, 2.8, 0.2, 3, 0],
            },
          ])
        )
        .updateElement(
          new Path(
            {
              strokeLinecap: 'square',
              strokeLinejoin: 'miter',
            },
            'p2'
          ).addCommand([
            {
              type: 'M',
              values: [4, 4],
            },
            {
              type: 'L',
              values: [9, 4],
            },
            {
              type: 'L',
              values: [9, 8],
            },
            {
              type: 'L',
              values: [3, 0],
            },
            {
              type: 'Z',
              values: [],
            },
          ])
        )
    })

    it('Return the same object.', () => {
      const cloneSvg = svg.clone()

      expect(cloneSvg.toJson()).toEqual(svg.toJson())
    })

    it('Cloned object changes have no effect the original object.', () => {
      const cloneSvg = svg.clone()

      cloneSvg.updateElement(cloneSvg.elements[0].scale(2))

      expect(cloneSvg.elements[0].toJson()).not.toEqual(
        svg.elements[0].toJson()
      )
    })
  })
})
