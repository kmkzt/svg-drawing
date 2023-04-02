import { PressedKeyHandler } from './pressedKeyHandler'

describe('pressedKeyHandler', () => {
  it('setup', () => {
    const handler = new PressedKeyHandler()

    jest.spyOn(self, 'addEventListener')

    handler.setup()

    expect(self.addEventListener).toBeCalledWith(
      'keydown',
      expect.any(Function)
    )
    expect(self.addEventListener).toBeCalledWith('keyup', expect.any(Function))
  })

  it('cleanup', () => {
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
