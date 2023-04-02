import type { DrawingClass } from '../types'

const setupDrawingMock = (): DrawingClass => {
  return {
    start: jest.fn(),
    dot: jest.fn(),
    end: jest.fn(),
  }
}

describe('PenHandler', () => {
  describe('setup', () => {
    beforeEach(() => {
      jest.resetModules()
    })
    it('Add mouseEvent listener when SUPPORT_POINTER_EVENT is false and SUPPORT_TOUCH_ON_START', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'addEventListener')
      jest.spyOn(self, 'addEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: false,
        SUPPORT_ON_TOUCH_START: false,
      }))

      return import('./penHandler').then(({ PenHandler }) => {
        const draw = setupDrawingMock()
        const penHandler = new PenHandler(draw)
        penHandler.setup(el)

        expect(self.addEventListener).toBeCalledWith(
          'mouseup',
          expect.any(Function)
        )
      })
    })

    it('Add pointerEvent listener when SUPPORT_POINTER_EVENT is true', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'addEventListener')
      jest.spyOn(self, 'addEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: true,
        SUPPORT_ON_TOUCH_START: false,
      }))

      return import('./penHandler').then(({ PenHandler }) => {
        const draw = setupDrawingMock()
        const penHandler = new PenHandler(draw)
        penHandler.setup(el)

        expect(self.addEventListener).toBeCalledWith(
          'pointerup',
          expect.any(Function)
        )
      })
    })

    it('Add touchEvent listener when SUPPORT_TOUCH_ON_START is true and SUPPORT_POINTER_EVENT is false.', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'addEventListener')
      jest.spyOn(self, 'addEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: false,
        SUPPORT_ON_TOUCH_START: true,
      }))

      return import('./penHandler').then(({ PenHandler }) => {
        const draw = setupDrawingMock()
        const penHandler = new PenHandler(draw)
        penHandler.setup(el)

        expect(self.addEventListener).toBeCalledWith(
          'touchstart',
          expect.any(Function)
        )
      })
    })
  })
})
