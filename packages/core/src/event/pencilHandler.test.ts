import type { DrawingClass } from '../types'

const setupDrawingMock = (): DrawingClass => {
  return {
    start: jest.fn(),
    dot: jest.fn(),
    end: jest.fn(),
  }
}

describe('pencilHandler', () => {
  describe('setup', () => {
    beforeEach(() => {
      jest.resetModules()
    })
    it('Add mouse event listener when SUPPORT_POINTER_EVENT is false and SUPPORT_ON_TOUCH_START is false', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'addEventListener')
      jest.spyOn(self, 'addEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: false,
        SUPPORT_ON_TOUCH_START: false,
        SUPPORT_EVENT_LISTENER_PASSIVE_OPTION: true,
      }))

      return import('./pencilHandler').then(({ PencilHandler }) => {
        const draw = setupDrawingMock()
        const handler = new PencilHandler(draw)
        handler.setup(el)

        expect(el.addEventListener).toBeCalledWith(
          'mousedown',
          expect.any(Function),
          { passive: false }
        )
        expect(el.addEventListener).toBeCalledWith(
          'mousemove',
          expect.any(Function),
          { passive: false }
        )
        expect(el.addEventListener).toBeCalledWith(
          'mouseleave',
          expect.any(Function),
          { passive: false }
        )
        expect(el.addEventListener).toBeCalledWith(
          'mouseout',
          expect.any(Function),
          { passive: false }
        )
        expect(self.addEventListener).toBeCalledWith(
          'mouseup',
          expect.any(Function),
          { passive: false }
        )
      })
    })
    it('Add pointer event listener when SUPPORT_POINTER_EVENT is true', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'addEventListener')
      jest.spyOn(self, 'addEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: true,
        SUPPORT_ON_TOUCH_START: false,
        SUPPORT_EVENT_LISTENER_PASSIVE_OPTION: true,
      }))

      return import('./pencilHandler').then(({ PencilHandler }) => {
        const draw = setupDrawingMock()
        const handler = new PencilHandler(draw)
        handler.setup(el)

        expect(el.addEventListener).toBeCalledWith(
          'pointerdown',
          expect.any(Function),
          { passive: false }
        )
        expect(el.addEventListener).toBeCalledWith(
          'pointermove',
          expect.any(Function),
          { passive: false }
        )
        expect(el.addEventListener).toBeCalledWith(
          'pointerleave',
          expect.any(Function),
          { passive: false }
        )
        expect(el.addEventListener).toBeCalledWith(
          'pointercancel',
          expect.any(Function),
          { passive: false }
        )
        expect(self.addEventListener).toBeCalledWith(
          'pointerup',
          expect.any(Function),
          { passive: false }
        )
      })
    })
    it('Add touche event listener when SUPPORT_POINTER_EVENT is false and SUPPORT_ON_TOUCH_START is true', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'addEventListener')
      jest.spyOn(self, 'addEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: false,
        SUPPORT_ON_TOUCH_START: true,
        SUPPORT_EVENT_LISTENER_PASSIVE_OPTION: true,
      }))

      return import('./pencilHandler').then(({ PencilHandler }) => {
        const draw = setupDrawingMock()
        const handler = new PencilHandler(draw)
        handler.setup(el)

        expect(el.addEventListener).toBeCalledWith(
          'touchstart',
          expect.any(Function),
          { passive: false }
        )
        expect(el.addEventListener).toBeCalledWith(
          'touchmove',
          expect.any(Function),
          { passive: false }
        )
        expect(el.addEventListener).toBeCalledWith(
          'touchend',
          expect.any(Function),
          { passive: false }
        )
        expect(self.addEventListener).toBeCalledWith(
          'touchcancel',
          expect.any(Function),
          { passive: false }
        )
      })
    })
  })

  describe('cleanup', () => {
    beforeEach(() => {
      jest.resetModules()
    })
    it('Remove mouse event listener when SUPPORT_POINTER_EVENT is false and SUPPORT_ON_TOUCH_START is false', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'removeEventListener')
      jest.spyOn(self, 'removeEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: false,
        SUPPORT_ON_TOUCH_START: false,
        SUPPORT_EVENT_LISTENER_PASSIVE_OPTION: true,
      }))

      return import('./pencilHandler').then(({ PencilHandler }) => {
        const draw = setupDrawingMock()
        const handler = new PencilHandler(draw)
        handler.setup(el)
        handler.cleanup()

        expect(el.removeEventListener).toBeCalledWith(
          'mousedown',
          expect.any(Function)
        )
        expect(el.removeEventListener).toBeCalledWith(
          'mousemove',
          expect.any(Function)
        )
        expect(el.removeEventListener).toBeCalledWith(
          'mouseleave',
          expect.any(Function)
        )
        expect(el.removeEventListener).toBeCalledWith(
          'mouseout',
          expect.any(Function)
        )
        expect(self.removeEventListener).toBeCalledWith(
          'mouseup',
          expect.any(Function)
        )
      })
    })

    it('Remove pointer event listener when SUPPORT_POINTER_EVENT is true', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'removeEventListener')
      jest.spyOn(self, 'removeEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: true,
        SUPPORT_ON_TOUCH_START: false,
        SUPPORT_EVENT_LISTENER_PASSIVE_OPTION: true,
      }))

      return import('./pencilHandler').then(({ PencilHandler }) => {
        const draw = setupDrawingMock()
        const handler = new PencilHandler(draw)
        handler.setup(el)
        handler.cleanup()

        expect(el.removeEventListener).toBeCalledWith(
          'pointerdown',
          expect.any(Function)
        )
        expect(el.removeEventListener).toBeCalledWith(
          'pointermove',
          expect.any(Function)
        )
        expect(el.removeEventListener).toBeCalledWith(
          'pointerleave',
          expect.any(Function)
        )
        expect(el.removeEventListener).toBeCalledWith(
          'pointercancel',
          expect.any(Function)
        )
        expect(self.removeEventListener).toBeCalledWith(
          'pointerup',
          expect.any(Function)
        )
      })
    })
    it('Remove touch event listener when SUPPORT_POINTER_EVENT is false and SUPPORT_ON_TOUCH_START is true', () => {
      const el = document.createElement('div')

      jest.spyOn(el, 'removeEventListener')
      jest.spyOn(self, 'removeEventListener')
      jest.doMock('./support', () => ({
        SUPPORT_POINTER_EVENT: false,
        SUPPORT_ON_TOUCH_START: true,
        SUPPORT_EVENT_LISTENER_PASSIVE_OPTION: true,
      }))

      return import('./pencilHandler').then(({ PencilHandler }) => {
        const draw = setupDrawingMock()
        const handler = new PencilHandler(draw)
        handler.setup(el)
        handler.cleanup()

        expect(el.removeEventListener).toBeCalledWith(
          'touchstart',
          expect.any(Function)
        )
        expect(el.removeEventListener).toBeCalledWith(
          'touchmove',
          expect.any(Function)
        )
        expect(el.removeEventListener).toBeCalledWith(
          'touchend',
          expect.any(Function)
        )
        expect(self.removeEventListener).toBeCalledWith(
          'touchcancel',
          expect.any(Function)
        )
      })
    })
  })
})
