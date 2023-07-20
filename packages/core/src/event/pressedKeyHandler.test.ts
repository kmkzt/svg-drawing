import { PressedKeyHandler } from './pressedKeyHandler'

describe('pressedKeyHandler', () => {
  describe('setup', () => {
    it('Execute addEventListener.', () => {
      const handler = new PressedKeyHandler()

      jest.spyOn(self, 'addEventListener')

      handler.setup()

      expect(self.addEventListener).toBeCalledWith(
        'keydown',
        expect.any(Function)
      )
      expect(self.addEventListener).toBeCalledWith(
        'keyup',
        expect.any(Function)
      )
    })
  })

  describe('cleanup', () => {
    it('Execute removeEventListener.', () => {
      const handler = new PressedKeyHandler()

      jest.spyOn(self, 'removeEventListener')

      handler.setup()
      handler.cleanup()

      expect(self.removeEventListener).toBeCalledWith(
        'keydown',
        expect.any(Function)
      )
      expect(self.removeEventListener).toBeCalledWith(
        'keyup',
        expect.any(Function)
      )
    })
  })
})
