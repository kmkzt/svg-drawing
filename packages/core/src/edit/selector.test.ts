import { Selector } from './selector'

describe('Selector', () => {
  let selector: Selector

  beforeEach(() => {
    selector = new Selector()
  })
  describe('Return selected paths only status.', () => {
    it('Return false when paths is not selected', () => {
      expect(selector.selectedOnlyPaths).toBe(false)
    })
    it('Return true when paths is selected.', () => {
      selector.select({ path: 'path_id' })

      expect(selector.selectedOnlyPaths).toBe(true)
    })

    it('Return false when command is selected.', () => {
      selector.select({ path: 'path_id', command: 0 })

      expect(selector.elementsIndex).toEqual(['path_id'])
    })

    it('Return false when point is selected.', () => {
      selector.select({ path: 'path_id', command: 0, point: 0 })

      expect(selector.selectedOnlyPaths).toBe(false)
    })
  })
  describe('Return select index information', () => {
    it('Return paths index array of selected.', () => {
      selector.select({ path: 'path_id' })

      expect(selector.selectedOnlyPaths).toBe(true)
      expect(selector.elementsIndex).toEqual(['path_id'])
    })

    it('Return commands index array of selected.', () => {
      selector.select({ path: 'path_id', command: 0 })

      expect(selector.elementsIndex).toEqual(['path_id'])
      expect(selector.getCommandsIndex('path_id')).toEqual([0])
    })

    it('Return points index array of selected.', () => {
      selector.select({ path: 'path_id', command: 0, point: 0 })

      expect(selector.getCommandsIndex('path_id')).toEqual([0])
      expect(selector.getPointsIndex('path_id', 0)).toEqual([0])
    })
  })

  describe('Return selected status.', () => {
    it('Return false when not selected', () => {
      expect(selector.selected).toBe(false)
    })

    it('Return true when path is selected', () => {
      selector.select({ path: 'path_id' })

      expect(selector.selected).toBe(true)
    })
    it('Return true when command is selected', () => {
      selector.select({ path: 'path_id', command: 0 })

      expect(selector.selected).toBe(true)
    })

    it('select point', () => {
      selector.select({ path: 'path_id', command: 0, point: 0 })

      expect(selector.selected).toBe(true)
    })
  })

  it('Clear selected status', () => {
    selector.select({ path: 'path_id' })
    selector.clear()

    expect(selector.selected).toBe(false)
    expect(selector.elementsIndex).toEqual([])
  })

  it('To select multiple paths by selectMerge method.', () => {
    selector.select({ path: 'path_id_1' }, true)
    selector.select({ path: 'path_id_2', command: 0 }, true)
    selector.select({ path: 'path_id_3', command: 0, point: 0 }, true)

    expect(selector.selectedOnlyPaths).toBe(false)
    expect(selector.selected).toBe(true)

    expect(selector.elementsIndex).toEqual([
      'path_id_1',
      'path_id_2',
      'path_id_3',
    ])
    expect(selector.getCommandsIndex('path_id_1')).toEqual(undefined)
    expect(selector.getCommandsIndex('path_id_2')).toEqual([0])
    expect(selector.getCommandsIndex('path_id_3')).toEqual([0])

    expect(selector.getPointsIndex('path_id_2', 0)).toEqual(undefined)
    expect(selector.getPointsIndex('path_id_3', 0)).toEqual([0])
  })

  describe('To unselect selected status', () => {
    const setupSelected = (selector: Selector) => {
      selector.select({ path: 'path_id_1' }, true)
      selector.select({ path: 'path_id_2', command: 0 }, true)
      selector.select({ path: 'path_id_3', command: 0, point: 0 }, true)
    }

    it('unselect path', () => {
      setupSelected(selector)
      selector.unselect({ path: 'path_id_1' })

      expect(selector.elementsIndex).toEqual(['path_id_2', 'path_id_3'])
    })

    it('unselect command', () => {
      setupSelected(selector)
      selector.unselect({ path: 'path_id_2', command: 0 })

      expect(selector.getCommandsIndex('path_id_2')).toEqual(undefined)
      expect(selector.elementsIndex).toEqual([
        'path_id_1',
        'path_id_2',
        'path_id_3',
      ])
    })

    it('unselect point', () => {
      setupSelected(selector)

      selector.unselect({ path: 'path_id_3', command: 0, point: 0 })

      expect(selector.getPointsIndex('path_id_3', 0)).toEqual(undefined)
      expect(selector.elementsIndex).toEqual([
        'path_id_1',
        'path_id_2',
        'path_id_3',
      ])
    })
  })
})
