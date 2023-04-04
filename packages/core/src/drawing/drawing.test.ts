import { createLineCommands } from './convert'
import { Drawing } from './drawing'
import { Path } from '../svg/path'
import { Svg } from '../svg/svg'
import type { DrawFactory, RenderParams } from '../types'

const drawMockFactory = (): DrawFactory => {
  let i = 0
  return {
    createElement: () => new Path({}, `path_key_${i++}`),
    updateElement: (element, points) =>
      element.setCommands(createLineCommands(points)),
  }
}

describe('Drawing', () => {
  it('Drawing.start', () => {
    const render = jest.fn()
    const svg = new Svg({ width: 100, height: 100 })
    const drawing = new Drawing(svg, drawMockFactory(), render)

    drawing.start()

    expect(svg.elements.length).toBe(1)
    expect(render).not.toBeCalled()
  })

  it('Drawing.dot', () => {
    const render = jest.fn()
    const svg = new Svg({ width: 100, height: 100 })
    const drawing = new Drawing(svg, drawMockFactory(), render)

    drawing.start()
    drawing.dot({ x: 10, y: 10 })

    const expected: RenderParams = {
      svg: {
        background: undefined,
        elements: [
          {
            attributes: {
              d: 'M10 10',
            },
            key: 'path_key_0',
            type: 'path',
          },
        ],
        height: 100,
        width: 100,
      },
    }

    expect(svg.elements.length).toBe(1)
    expect(svg.elements[0].getCommandString()).toEqual('M10 10')
    expect(render).toBeCalledTimes(1)
    expect(render).toBeCalledWith(expected)
  })

  it('Drawing.end', () => {
    const render = jest.fn()
    const svg = new Svg({ width: 100, height: 100 })
    const drawing = new Drawing(svg, drawMockFactory(), render)

    drawing.start()
    drawing.dot({ x: 10, y: 10 })
    drawing.dot({ x: 20, y: 20 })
    drawing.end()

    drawing.start()
    drawing.dot({ x: 30, y: 30 })
    drawing.dot({ x: 40, y: 40 })
    drawing.end()

    const expected: RenderParams = {
      svg: {
        background: undefined,
        elements: [
          {
            attributes: {
              d: 'M10 10 l10 10',
            },
            key: 'path_key_0',
            type: 'path',
          },
          {
            attributes: {
              d: 'M30 30 l10 10',
            },
            key: 'path_key_1',
            type: 'path',
          },
        ],
        height: 100,
        width: 100,
      },
    }

    expect(svg.elements.length).toBe(2)
    expect(svg.elements[0].getCommandString()).toEqual('M10 10 l10 10')
    expect(svg.elements[1].getCommandString()).toEqual('M30 30 l10 10')
    expect(render).toBeCalledTimes(4)
    expect(render).toBeCalledWith(expected)
  })
})
