import { createLineCommands } from './convert'
import { Drawing } from './drawing'
import { Path } from '../svg/path'
import { Svg } from '../svg/svg'
import type { DrawFactory } from '../types'

const drawMockFactory: DrawFactory = {
  createElement: () => new Path({}),
  updateElement: (element, points) =>
    element.setCommands(createLineCommands(points)),
}

describe('Drawing', () => {
  it('Drawing.start', () => {
    const updateHandler = jest.fn()
    const svg = new Svg({ width: 100, height: 100 })

    const drawing = new Drawing(svg, drawMockFactory, updateHandler)
    drawing.start()

    expect(svg.elements.length).toBe(1)
    expect(updateHandler).not.toBeCalled()
  })

  it('Drawing.dot', () => {
    const updateHandler = jest.fn()
    const svg = new Svg({ width: 100, height: 100 })

    const drawing = new Drawing(svg, drawMockFactory, updateHandler)
    drawing.start()
    drawing.dot({ x: 10, y: 10 })

    expect(svg.elements.length).toBe(1)
    expect(svg.elements[0].getCommandString()).toEqual('M10 10')
    expect(updateHandler).toBeCalledTimes(1)
    expect(updateHandler).toBeCalledWith(svg)
  })

  it('Drawing.end', () => {
    const updateHandler = jest.fn()
    const svg = new Svg({ width: 100, height: 100 })

    const drawing = new Drawing(svg, drawMockFactory, updateHandler)
    drawing.start()
    drawing.dot({ x: 10, y: 10 })
    drawing.dot({ x: 20, y: 20 })
    drawing.end()

    drawing.start()
    drawing.dot({ x: 30, y: 30 })
    drawing.dot({ x: 40, y: 40 })
    drawing.end()

    expect(svg.elements.length).toBe(2)
    expect(svg.elements[0].getCommandString()).toEqual('M10 10 l10 10')
    expect(svg.elements[1].getCommandString()).toEqual('M30 30 l10 10')
    expect(updateHandler).toBeCalledTimes(4)
    expect(updateHandler).toBeCalledWith(svg)
  })
})
