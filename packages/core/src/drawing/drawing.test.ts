import { createLineCommands } from './convert'
import { Drawing } from './drawing'
import { Path, Svg } from '../svg'
import type { DrawFactory } from '../types'

const drawMockFactory: DrawFactory = {
  createPath: () => new Path({}),
  createCommand: createLineCommands,
}

describe('Drawing', () => {
  it('Drawing.start', () => {
    const updateHandler = jest.fn()
    const svg = new Svg({ width: 100, height: 100 })

    const drawing = new Drawing(svg, drawMockFactory, updateHandler)
    drawing.start()

    expect(svg.paths.length).toBe(1)
    expect(updateHandler).not.toBeCalled()
  })

  it('Drawing.dot', () => {
    const updateHandler = jest.fn()
    const svg = new Svg({ width: 100, height: 100 })

    const drawing = new Drawing(svg, drawMockFactory, updateHandler)
    drawing.start()
    drawing.dot({ x: 10, y: 10 })

    expect(svg.paths.length).toBe(1)
    expect(svg.paths[0].getCommandString()).toEqual('M10 10')
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

    expect(svg.paths.length).toBe(2)
    expect(svg.paths[0].getCommandString()).toEqual('M10 10 l10 10')
    expect(svg.paths[1].getCommandString()).toEqual('M30 30 l10 10')
    expect(updateHandler).toBeCalledTimes(6)
    expect(updateHandler).toBeCalledWith(svg)
  })
})
