import { Selector } from './selector'
import type { SelectObject } from '../types'

describe('Selector', () => {
  const selectedPath: SelectObject = { type: 'path', key: 'path_id_1' }
  const selectedCommand: SelectObject = {
    type: 'path-command',
    key: 'path_id_2',
    index: { command: 0 },
  }
  const selectedPoint: SelectObject = {
    type: 'path-point',
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
  describe('Return selected paths only status.', () => {
    it('Return false when paths is not selected', () => {
      const selector = new Selector()

      expect(selector.selectedBoundingBox).toBe(false)
    })
    it('Return true when paths is selected.', () => {
      const selector = new Selector()
      selector.select(selectedPath)

      expect(selector.selectedBoundingBox).toBe(true)
    })

    it('Return false when point is selected.', () => {
      const selector = new Selector()
      selector.select(selectedPoint)

      expect(selector.selectedBoundingBox).toBe(false)
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

  describe('Return selected status.', () => {
    it('Return false when not selected', () => {
      const selector = new Selector()
      expect(selector.selected).toBe(false)
    })

    it('Return true when path is selected', () => {
      const selector = new Selector()
      selector.select(selectedPath)

      expect(selector.selected).toBe(true)
    })
    it('Return true when command is selected', () => {
      const selector = new Selector()
      selector.select(selectedCommand)

      expect(selector.selected).toBe(true)
    })

    it('select point', () => {
      const selector = new Selector()
      selector.select(selectedPoint)

      expect(selector.selected).toBe(true)
    })
  })

  it('Clear selected status', () => {
    const selector = new Selector()
    selector.select(selectedPath)
    selector.clear()

    expect(selector.selected).toBe(false)
  })

  describe('To unselect selected status', () => {
    const setupSelector = (): Selector => {
      const selector = new Selector()
      selector.select(selectedPath, true)
      selector.select(selectedCommand, true)
      selector.select(selectedPoint, true)

      return selector
    }

    it('unselect path', () => {
      const selector = setupSelector()
      selector.unselect(selectedPath)

      expect(selector.toJson()).toMatchInlineSnapshot(`
        Array [
          Object {
            "index": Object {
              "command": 0,
            },
            "key": "path_id_2",
            "type": "path-command",
          },
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

    it('unselect command', () => {
      const selector = setupSelector()
      selector.unselect(selectedCommand)

      expect(selector.toJson()).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "path_id_1",
            "type": "path",
          },
          Object {
            "key": "path_id_2",
            "type": "path",
          },
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

    it('unselect point', () => {
      const selector = setupSelector()
      selector.unselect(selectedPoint)

      expect(selector.toJson()).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "path_id_1",
            "type": "path",
          },
          Object {
            "index": Object {
              "command": 0,
            },
            "key": "path_id_2",
            "type": "path-command",
          },
          Object {
            "key": "path_id_3",
            "type": "path",
          },
        ]
      `)
    })
  })
})
