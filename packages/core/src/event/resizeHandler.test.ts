describe('resizeHandler', () => {
  describe('setup', () => {
    const originResizeObserver = window.ResizeObserver

    afterEach(() => {
      window.ResizeObserver = originResizeObserver
      jest.resetModules()
    })

    it('Execute addEventLister when ResizeObserver is undefined', () => {
      window.ResizeObserver = undefined as any
      jest.spyOn(self, 'addEventListener')

      return import('./resizeHandler').then(({ ResizeHandler }) => {
        const handler = new ResizeHandler()
        handler.setup(document.createElement('div'))

        expect(self.addEventListener).toBeCalledWith(
          'resize',
          expect.any(Function)
        )
      })
    })

    it('Execute ResizeObserver.observe', () => {
      const observe = jest.fn()
      const disconnect = jest.fn()

      window.ResizeObserver = jest.fn(() => ({
        observe,
        disconnect,
      })) as any

      jest.spyOn(self, 'addEventListener')

      return import('./resizeHandler').then(({ ResizeHandler }) => {
        const el = document.createElement('div')
        const handler = new ResizeHandler()

        handler.setup(el)

        expect(window.ResizeObserver).toBeCalled()
        expect(observe).toBeCalledWith(el)
      })
    })
  })

  describe('cleanup', () => {
    const originResizeObserver = window.ResizeObserver

    afterEach(() => {
      window.ResizeObserver = originResizeObserver
      jest.resetModules()
    })

    it('Execute removeEventListener when ResizeObserver is undefined', () => {
      window.ResizeObserver = undefined as any

      jest.spyOn(self, 'removeEventListener')

      return import('./resizeHandler').then(({ ResizeHandler }) => {
        const el = document.createElement('div')
        const handler = new ResizeHandler()
        handler.setup(el)
        handler.cleanup()

        expect(self.removeEventListener).toBeCalledWith(
          'resize',
          expect.any(Function)
        )
      })
    })

    it('Execute ResizeObserver.disconnect', () => {
      const observe = jest.fn()
      const disconnect = jest.fn()

      window.ResizeObserver = jest.fn(() => ({
        observe,
        disconnect,
      })) as any

      jest.spyOn(self, 'addEventListener')

      return import('./resizeHandler').then(({ ResizeHandler }) => {
        const el = document.createElement('div')
        const handler = new ResizeHandler()

        handler.setup(el)
        handler.cleanup()

        expect(disconnect).toBeCalled()
      })
    })
  })
})
