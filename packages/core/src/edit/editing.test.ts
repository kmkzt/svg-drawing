import exp from 'constants'
import { Editing } from './editing'
import { parseCommandString } from '../parser'
import { Path } from '../svg/path'
import { Svg } from '../svg/svg'
import type { RenderParams } from '../types'

describe('Editing', () => {
  describe('select', () => {
    it('Select edit path and update screen.', () => {
      const svg = new Svg({ width: 100, height: 100 })
      svg.replaceElements([
        new Path({}, 'path-1').setCommands(
          parseCommandString('M 0 0 L 100 100')
        ),
      ])

      const render = jest.fn()

      const editing = new Editing(svg, render)
      editing.select({ key: 'path-1', type: 'path' })

      const result: RenderParams = {
        svg: svg.toJson(),
        edit: {
          elements: expect.any(Array),
          boundingBox: {
            position: { x: 0, y: 0 },
            size: {
              width: 100,
              height: 100,
            },
            vertexes: expect.any(Array),
            selected: true,
          },
        },
      }

      expect(render).toBeCalledTimes(1)
      expect(render).toBeCalledWith(result)
    })
  })
  describe('cancel', () => {
    it('Clear selected status and update screen.', () => {
      const svg = new Svg({ width: 100, height: 100 })
      svg.replaceElements([
        new Path({}, 'path-1').setCommands(
          parseCommandString('M 0 0 L 100 100')
        ),
      ])
      const render = jest.fn()

      const editing = new Editing(svg, render)
      editing.select({ key: 'path-1', type: 'path' })

      expect(render).toBeCalledTimes(1)

      editing.cancel()

      expect(render).toBeCalledTimes(2)
      expect(render).toBeCalledWith({ svg: svg.toJson(), edit: undefined })
    })
  })

  describe('update', () => {
    it('Call render methods to update screen.', () => {
      const svg = new Svg({ width: 100, height: 100 })
      const render = jest.fn()

      const editing = new Editing(svg, render)
      editing.update()

      expect(render).toBeCalledTimes(1)
    })
  })

  describe('deleteElements', () => {
    it.todo('Select edit path and update screen.')
  })

  describe('changeAttributes', () => {
    it.todo('Change attributes and update screen.')
  })

  describe('translate', () => {
    it.todo('Translate the selected path and update screen.')

    it.todo('Preview for translation. svg should be the same.')
  })

  describe('resizeBoundingBox', () => {
    it.todo('Resize the bounding box of the selected path and update screen.')

    it.todo('Preview for resize the bounding box. svg should be the same.')
  })

  describe('transform', () => {
    it.todo('Resize bounding box and update screen.')

    it.todo('Preview the translation. svg should be the same.')
  })
})
