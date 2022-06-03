import { createLineCommands } from './convert'
import { Drawing } from './drawing'
import { Path, Svg } from '../svg'
import type { DrawFactory } from '../types'

const drawMockFactory: DrawFactory = {
  createPath: () => new Path({}),
  createCommand: createLineCommands,
}

const noop = () => undefined

describe('Drawing', () => {
  it('Drawing.start', () => {
    const svg = new Svg({ width: 100, height: 100 })

    const drawing = new Drawing(svg, drawMockFactory, noop)
    drawing.start()

    expect(svg.paths.length).toBe(1)
  })

  it('Drawing.dot', () => {
    const svg = new Svg({ width: 100, height: 100 })

    const drawing = new Drawing(svg, drawMockFactory, noop)
    drawing.start()
    drawing.dot({ x: 10, y: 10 })

    expect(svg.paths.length).toBe(1)
    expect(svg.paths[0].getCommandString()).toEqual('M10 10')
  })

  it('Drawing.end', () => {
    const svg = new Svg({ width: 100, height: 100 })

    const drawing = new Drawing(svg, drawMockFactory, noop)
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
  })
})
