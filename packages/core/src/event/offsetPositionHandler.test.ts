import { OffsetPositionHandler } from './offsetPositionHandler'

describe('OffsetPositionHandler', () => {
  describe('setup', () => {
    it('Set offset position and addEventListener is called', () => {
      const el = document.createElement('div')
      const handler = new OffsetPositionHandler()

      jest
        .spyOn(el, 'getBoundingClientRect')
        .mockReturnValue({ left: 0, top: 0 } as any)
      jest.spyOn(self, 'addEventListener')

      handler.setup(el)
      expect(handler.position).toEqual({ x: 0, y: 0 })

      expect(self.addEventListener).toBeCalledWith(
        'resize',
        expect.any(Function)
      )
      expect(self.addEventListener).toBeCalledWith(
        'scroll',
        expect.any(Function)
      )
    })
  })

  describe('cleanup', () => {
    it('removeEventListener is called', () => {
      const el = document.createElement('div')
      const handler = new OffsetPositionHandler()

      jest.spyOn(self, 'addEventListener')
      jest.spyOn(self, 'removeEventListener')

      handler.setup(el)
      handler.cleanup()

      expect(self.removeEventListener).toBeCalledWith(
        'resize',
        expect.any(Function)
      )
      expect(self.removeEventListener).toBeCalledWith(
        'scroll',
        expect.any(Function)
      )
    })
  })
})
