import { SvgDrawing } from './drawing'
import { svgObjectToElement } from './renderer'

describe('drawing.ts', () => {
  describe('SvgDrawing', () => {
    it('default', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.drawStart()
      draw.drawMove({ x: 0, y: 0 })
      draw.drawMove({ x: 1, y: 1 })
      draw.drawMove({ x: 2, y: 1 })
      draw.drawMove({ x: 3, y: 0 })
      draw.drawEnd()
      expect(svgObjectToElement(draw.svg.toJson())).toMatchSnapshot()
    })
    it('close', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.close = true
      draw.drawStart()
      draw.drawMove({ x: 0, y: 0 })
      draw.drawMove({ x: 1, y: 1 })
      draw.drawMove({ x: 2, y: 1 })
      draw.drawMove({ x: 3, y: 0 })
      draw.drawEnd()
      const el = svgObjectToElement(draw.svg.toJson())
      expect(el).toMatchSnapshot()
    })
    it('curve = false', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.curve = false
      draw.drawStart()
      draw.drawMove({ x: 0, y: 0 })
      draw.drawMove({ x: 1, y: 1 })
      draw.drawMove({ x: 2, y: 1 })
      draw.drawMove({ x: 3, y: 0 })
      draw.drawEnd()
      const el = svgObjectToElement(draw.svg.toJson())
      expect(el).toMatchSnapshot()
    })
    it('clear()', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.curve = false
      draw.drawStart()
      draw.drawMove({ x: 0, y: 0 })
      draw.drawEnd()
      draw.clear()
      const el = svgObjectToElement(draw.svg.toJson())
      expect(el).toMatchSnapshot()
    })

    // TODO: Fix NaN
    it('undo()', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.drawStart()
      draw.drawMove({ x: 0, y: 0 })
      draw.drawEnd()
      draw.drawStart()
      draw.drawMove({ x: 0, y: 0 })
      draw.drawEnd()
      draw.undo()
      const el = svgObjectToElement(draw.svg.toJson())
      expect(el).toMatchSnapshot()
    })
  })
})
