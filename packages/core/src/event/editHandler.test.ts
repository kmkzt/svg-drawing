import { EditHandler } from './editHandler'
import { Editing } from '../edit/editing'
import { Svg } from '../svg/svg'

const setupTestEditHandler = (): EditHandler => {
  const svg = new Svg({ width: 200, height: 200 })
  const editing = new Editing(svg)
  const editHandler = new EditHandler(editing, {})
  return editHandler
}

describe('editHandler', () => {
  describe('setup', () => {
    it('addEventListener is called when setup method is executed', () => {
      const el = document.createElement('div')
      jest.spyOn(el, 'addEventListener')

      const editHandler = setupTestEditHandler()

      editHandler.setup(el)
      expect(el.addEventListener).toBeCalledWith(
        'mousedown',
        expect.any(Function)
      )
      expect(el.addEventListener).toBeCalledWith(
        'touchstart',
        expect.any(Function)
      )
    })
  })

  describe('cleanup', () => {
    it('removeEventListener is called when setup method is executed', () => {
      const el = document.createElement('div')
      jest.spyOn(el, 'addEventListener')
      jest.spyOn(el, 'removeEventListener')

      const editHandler = setupTestEditHandler()
      editHandler.setup(el)

      editHandler.cleanup()

      expect(el.removeEventListener).toBeCalledWith(
        'mousedown',
        expect.any(Function)
      )

      expect(el.removeEventListener).toBeCalledWith(
        'touchstart',
        expect.any(Function)
      )
    })
  })
})
