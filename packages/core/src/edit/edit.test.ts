import { EditSvg } from './edit'
import { parseSVGString } from '../parser'

const testSvgData =
  '<svg width="200" height="200">' +
  '<path id="path_0" fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>' +
  '<path id="path_1" fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>' +
  '<path id="path_2" fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>' +
  '</svg>'

describe('edit.ts', () => {
  let edit: EditSvg
  describe('EditSvg', () => {
    beforeEach(() => {
      edit = new EditSvg(parseSVGString(testSvgData))
    })
    describe('changeAttributes', () => {
      it('Change attributes of selected paths', () => {
        const editKey = edit.svg.paths[0].key
        edit.select({ [editKey]: {} })
        edit.changeAttributes({ fill: '#ff0' })
        expect(edit.svg.paths[0].attrs.fill).toBe('#ff0')
      })
      it.todo('Selecting commands')
      it.todo('Selecting point')
      it.todo('Selecting Multiple path')
    })

    describe('translate', () => {
      it.todo('Selecting path')
      it.todo('Selecting commands')
      it.todo('Selecting point')
      it.todo('Selecting Multiple path')
    })

    describe('scale', () => {
      it.todo('Selecting path')
      it.todo('Selecting commands')
      it.todo('Selecting point')
      it.todo('Selecting Multiple path')
    })

    describe('scaleX', () => {
      it.todo('Selecting path')
      it.todo('Selecting commands')
      it.todo('Selecting point')
      it.todo('Selecting Multiple path')
    })

    describe('scaleY', () => {
      it.todo('Selecting path')
      it.todo('Selecting commands')
      it.todo('Selecting point')
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
        edit.select({ [editKey]: {} })
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
  describe('EditPath', () => {
    it.todo('points')

    it.todo('vertex')

    it.todo('boundingBox')
  })
})
