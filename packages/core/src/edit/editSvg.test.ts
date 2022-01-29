import { EditSvg } from './editSvg'
import { parseSVGString } from '../parser'

/** 'd' attributes must to be relative. */
const testSvgData =
  '<svg width="200" height="200">' +
  '<path id="path_0" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '<path id="path_1" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '<path id="path_2" fill="#f00" stroke="#00f" stroke-width="4" d="M1 1 l1 1 c2 2 4 2 6 2 z"></path>' +
  '</svg>'

describe('EditSvg', () => {
  let edit: EditSvg
  beforeEach(() => {
    edit = new EditSvg(parseSVGString(testSvgData))
  })
  describe('changeAttributes', () => {
    it('Change attributes of selected paths', () => {
      const editKey = edit.svg.paths[0].key
      edit.select({
        path: editKey,
      })
      edit.changeAttributes({ fill: '#ff0' })
      expect(edit.svg.paths[0].attrs.fill).toBe('#ff0')
    })
    it.todo('Selecting commands')
    it.todo('Selecting point')
    it.todo('Selecting Multiple path')
  })

  describe('translate', () => {
    const pathIndex = 0
    it('Translate selected path', () => {
      const editKey = edit.svg.paths[pathIndex].key
      expect(edit.svg.paths[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c2 2 4 2 6 2 z'
      )

      edit.select({
        path: editKey,
      })
      edit.translate({ x: 1, y: -1 })
      expect(edit.svg.paths[pathIndex].getCommandString()).toBe(
        'M2 0 l1 1 c2 2 4 2 6 2 z'
      )
    })
    it('Translate selected commands', () => {
      const editKey = edit.svg.paths[pathIndex].key
      expect(edit.svg.paths[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c2 2 4 2 6 2 z'
      )

      edit.select({
        path: editKey,
        command: 1,
      })
      edit.translate({ x: 1, y: -1 })
      expect(edit.svg.paths[pathIndex].getCommandString()).toBe(
        'M1 1 l2 0 c1 3 3 3 5 3 z'
      )
    })
    it('Translate selected point', () => {
      const editKey = edit.svg.paths[pathIndex].key
      expect(edit.svg.paths[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c2 2 4 2 6 2 z'
      )

      edit.select({
        path: editKey,
        command: 2,
        point: 0,
      })
      edit.translate({ x: 1, y: -1 })
      expect(edit.svg.paths[pathIndex].getCommandString()).toBe(
        'M1 1 l1 1 c3 1 4 2 6 2 z'
      )
    })
    it.todo('Selecting Multiple path')
  })

  describe('scale', () => {
    it('Selecting path', () => {
      const editKey = edit.svg.paths[0].key
      edit.select({ path: editKey })
      edit.scale(2)
      expect(edit.svg.paths[0].getCommandString()).toBe(
        'M2 2 l2 2 c4 4 8 4 12 4 z'
      )
    })
    it.todo('Selecting Multiple path')
  })

  describe('scaleX', () => {
    it('Selecting path', () => {
      const editKey = edit.svg.paths[0].key
      edit.select({ path: editKey })
      edit.scaleX(2)
      expect(edit.svg.paths[0].getCommandString()).toBe(
        'M2 1 l2 1 c4 2 8 2 12 2 z'
      )
    })
    it.todo('Selecting Multiple path')
  })

  describe('scaleY', () => {
    it('Selecting path', () => {
      const editKey = edit.svg.paths[0].key
      edit.select({ path: editKey })
      edit.scaleY(2)
      expect(edit.svg.paths[0].getCommandString()).toBe(
        'M1 2 l1 2 c2 4 4 4 6 4 z'
      )
    })
    it.todo('Selecting Multiple path')
  })

  describe('resizeFixedPosition', () => {
    it.todo('Selecting path')
    it.todo('Selecting commands')
    it.todo('Selecting point')
    it.todo('Selecting Multiple path')
  })

  describe('delete', () => {
    it('Delete Selected path', () => {
      const editKey = edit.svg.paths[0].key
      edit.select({ path: editKey })
      edit.delete()
      expect(edit.svg.paths.length).toBe(2)
      expect(edit.svg.paths[0].attrs.id).toBe('path_1')
      expect(edit.svg.paths[1].attrs.id).toBe('path_2')
    })
    it.todo('Selecting commands')
    it.todo('Selecting point')
    it.todo('Selecting Multiple path')
  })

  it.todo('preview')

  it.todo('toJson')
})
