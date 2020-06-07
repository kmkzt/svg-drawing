import { SvgDrawing } from './drawing'

describe('drawing.ts', () => {
  describe('SvgDrawing', () => {
    it('default', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.drawingStart()
      draw.drawingMove({ x: 0, y: 0 })
      draw.drawingMove({ x: 1, y: 1 })
      draw.drawingMove({ x: 2, y: 1 })
      draw.drawingMove({ x: 3, y: 0 })
      draw.drawingEnd()
      expect(draw.toElement()).toMatchSnapshot()
    })
    it('close', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.close = true
      draw.drawingStart()
      draw.drawingMove({ x: 0, y: 0 })
      draw.drawingMove({ x: 1, y: 1 })
      draw.drawingMove({ x: 2, y: 1 })
      draw.drawingMove({ x: 3, y: 0 })
      draw.drawingEnd()
      expect(draw.toElement()).toMatchSnapshot()
    })
    it('curve = false', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.curve = false
      draw.drawingStart()
      draw.drawingMove({ x: 0, y: 0 })
      draw.drawingMove({ x: 1, y: 1 })
      draw.drawingMove({ x: 2, y: 1 })
      draw.drawingMove({ x: 3, y: 0 })
      draw.drawingEnd()
      expect(draw.toElement()).toMatchSnapshot()
    })
  })
})
