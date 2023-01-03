import { BoundingBox } from './boundingBox'
import { Path } from '../svg/path'
import type { BoundingBoxObject } from '../types'

const exampleData = new Path({}, 'path_key').addCommand([
  { type: 'M', values: [0, 0] },
  { type: 'C', values: [20, 20, 60, 80, 100, 100] },
  {
    type: 'C',
    values: [140, 120, 160, 120, 200, 100],
  },
  {
    type: 'C',
    values: [240, 80, 280, 20, 300, 0],
  },
])

describe('BoundingBox', () => {
  describe('BoundingBox of Curve Path', () => {
    const boundingBox = new BoundingBox([exampleData])

    const testData: BoundingBoxObject = {
      elementKeys: ['path_key'],
      position: {
        x: 0,
        y: 0,
      },
      size: {
        height: 115,
        width: 300,
      },

      vertexes: [
        {
          type: 'LeftTop',
          point: {
            x: 0,
            y: 0,
          },
        },
        {
          type: 'RightTop',
          point: {
            x: 300,
            y: 0,
          },
        },
        {
          type: 'RightBottom',
          point: {
            x: 300,
            y: 115,
          },
        },
        {
          type: 'LeftBottom',
          point: {
            x: 0,
            y: 115,
          },
        },
      ],
    }

    it('boundingBox.toJson()', () => {
      expect(boundingBox.toJson()).toStrictEqual(testData)
    })

    describe('boundingBox.resizeParams', () => {
      it('Move the vertex and scale double', () => {
        const scale = {
          x: 2,
          y: 2,
        }

        expect(
          boundingBox.resizeParams('LeftTop', {
            x: -testData.size.width,
            y: -testData.size.height,
          })
        ).toEqual({
          move: {
            x: -testData.size.width,
            y: -testData.size.height,
          },
          scale,
        })

        expect(
          boundingBox.resizeParams('RightTop', {
            x: testData.size.width,
            y: -testData.size.height,
          })
        ).toEqual({
          move: {
            x: -0,
            y: -testData.size.height,
          },
          scale,
        })

        expect(
          boundingBox.resizeParams('RightBottom', {
            x: testData.size.width,
            y: testData.size.height,
          })
        ).toEqual({
          move: {
            x: -0,
            y: -0,
          },
          scale,
        })

        expect(
          boundingBox.resizeParams('LeftBottom', {
            x: -testData.size.width,
            y: testData.size.height,
          })
        ).toEqual({
          move: {
            x: -testData.size.width,
            y: -0,
          },
          scale,
        })
      })
    })
  })
})
