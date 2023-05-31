import { BoundingBox } from './boundingBox'
import { createCommand } from '../svg/command'
import { Path } from '../svg/path'
import type { BoundingBoxObject } from '../types'

describe('BoundingBox', () => {
  describe.each([
    {
      description: 'BoundingBox of Curve Path',
      path: new Path({}, 'path_key').setCommands([
        createCommand({ type: 'M', values: [0, 0] }),
        createCommand({ type: 'C', values: [20, 20, 60, 80, 100, 100] }),
        createCommand({
          type: 'C',
          values: [140, 120, 160, 120, 200, 100],
        }),
        createCommand({
          type: 'C',
          values: [240, 80, 280, 20, 300, 0],
        }),
      ]),
      boundingBoxObject: {
        position: {
          x: 0,
          y: 0,
        },
        size: {
          height: 114.81481481481481,
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
              y: 114.81481481481481,
            },
          },
          {
            type: 'LeftBottom',
            point: {
              x: 0,
              y: 114.81481481481481,
            },
          },
        ],
        selected: false,
      },
    },
    {
      description: 'BoundingBox of Line Path',
      path: new Path({}, 'path_key').setCommands([
        createCommand({ type: 'M', values: [0, 0] }),
        createCommand({ type: 'L', values: [100, 100] }),
        createCommand({
          type: 'L',
          values: [200, 100],
        }),
        createCommand({
          type: 'L',
          values: [300, 0],
        }),
      ]),
      boundingBoxObject: {
        position: {
          x: 0,
          y: 0,
        },
        size: {
          height: 100,
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
              y: 100,
            },
          },
          {
            type: 'LeftBottom',
            point: {
              x: 0,
              y: 100,
            },
          },
        ],
        selected: false,
      },
    },
  ] as Array<{
    description: string
    path: Path
    boundingBoxObject: BoundingBoxObject
  }>)('$description', ({ path, boundingBoxObject }) => {
    describe('boundingBox.toJson()', () => {
      it('Return boundingBoxObject', () => {
        expect(new BoundingBox([path]).toJson()).toStrictEqual(
          boundingBoxObject
        )
      })
    })
    describe('boundingBox.resizeParams', () => {
      const boundingBox = new BoundingBox([path])
      it('Move the vertex and scale double', () => {
        const scale = {
          x: 2,
          y: 2,
        }

        expect(
          boundingBox.resizeParams('LeftTop', {
            x: -boundingBoxObject.size.width,
            y: -boundingBoxObject.size.height,
          })
        ).toEqual({
          move: {
            x: -boundingBoxObject.size.width,
            y: -boundingBoxObject.size.height,
          },
          scale,
        })

        expect(
          boundingBox.resizeParams('RightTop', {
            x: boundingBoxObject.size.width,
            y: -boundingBoxObject.size.height,
          })
        ).toEqual({
          move: {
            x: -0,
            y: -boundingBoxObject.size.height,
          },
          scale,
        })

        expect(
          boundingBox.resizeParams('RightBottom', {
            x: boundingBoxObject.size.width,
            y: boundingBoxObject.size.height,
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
            x: -boundingBoxObject.size.width,
            y: boundingBoxObject.size.height,
          })
        ).toEqual({
          move: {
            x: -boundingBoxObject.size.width,
            y: -0,
          },
          scale,
        })
      })
    })
  })
})
