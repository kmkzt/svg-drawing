import { SvgDrawing } from './drawing'

describe('drawing.ts', () => {
  describe('SvgDrawing', () => {
    it('default', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.drawStart()
      draw.drawMove(0, 0)
      draw.drawMove(1, 1)
      draw.drawMove(2, 1)
      draw.drawMove(3, 0)
      draw.drawEnd()
      expect(draw.toElement()).toMatchSnapshot()
    })
    it('close', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.close = true
      draw.drawStart()
      draw.drawMove(0, 0)
      draw.drawMove(1, 1)
      draw.drawMove(2, 1)
      draw.drawMove(3, 0)
      draw.drawEnd()
      expect(draw.toElement()).toMatchSnapshot()
    })
    it('curve = false', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.curve = false
      draw.drawStart()
      draw.drawMove(0, 0)
      draw.drawMove(1, 1)
      draw.drawMove(2, 1)
      draw.drawMove(3, 0)
      draw.drawEnd()
      expect(draw.toElement()).toMatchSnapshot()
    })
    it('clear()', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.curve = false
      draw.drawStart()
      draw.drawMove(0, 0)
      draw.drawEnd()
      draw.clear()
      expect(draw.toElement()).toMatchSnapshot()
    })

    /**
     * TODO: Fix NaN
     */
    it('undo()', () => {
      const draw: SvgDrawing = new SvgDrawing(document.createElement('div'))
      draw.drawStart()
      draw.drawMove(0, 0)
      draw.drawEnd()
      draw.drawStart()
      draw.drawMove(0, 0)
      draw.drawEnd()
      draw.undo()
      expect(draw).toMatchSnapshot()
    })
  })
})
