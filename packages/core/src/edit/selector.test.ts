import { Selector } from './selector'
import type { SelectEventObject } from '../types'

describe('Selector', () => {
  const selectedPath: SelectEventObject = { type: 'path', key: 'path_id_1' }
  const selectedCommand: SelectEventObject = {
    type: 'path/command',
    key: 'path_id_2',
    index: { command: 0 },
  }
  const selectedPoint: SelectEventObject = {
    type: 'path/anchorPoint',
    key: 'path_id_3',
    index: { command: 0, point: 0 },
  }

  describe('Selected status reflect', () => {
    it('Select path', () => {
      const selector = new Selector()
      selector.select(selectedPath)

      expect(selector.toJson()).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "path_id_1",
            "type": "path",
          },
        ]
      `)
    })
    it('Select comamnd', () => {
      const selector = new Selector()
      selector.select(selectedCommand)

      expect(selector.toJson()).toMatchInlineSnapshot(`
        Array [
          Object {
            "index": Object {
              "command": 0,
            },
            "key": "path_id_2",
            "type": "path-command",
          },
        ]
      `)
    })
    it('Select point', () => {
      const selector = new Selector()
      selector.select(selectedPoint)

      expect(selector.toJson()).toMatchInlineSnapshot(`
        Array [
          Object {
            "index": Object {
              "command": 0,
              "point": 0,
            },
            "key": "path_id_3",
            "type": "path-point",
          },
        ]
      `)
    })
  })
})
