import { PathSelector } from './pathSelector'

describe('PathSelector', () => {
  let pathSelector: PathSelector

  beforeEach(() => {
    pathSelector = new PathSelector()
  })
  describe('Return selected paths only status.', () => {
    it('Return false when paths is not selected', () => {
      expect(pathSelector.selectedOnlyPaths).toBe(false)
    })
    it('Return true when paths is selected.', () => {
      pathSelector.select({ path: 'path_id' })

      expect(pathSelector.selectedOnlyPaths).toBe(true)
    })

    it('Return false when command is selected.', () => {
      pathSelector.select({ path: 'path_id', command: 0 })

      expect(pathSelector.pathsIndex).toEqual(['path_id'])
    })

    it('Return false when point is selected.', () => {
      pathSelector.select({ path: 'path_id', command: 0, point: 0 })

      expect(pathSelector.selectedOnlyPaths).toBe(false)
    })
  })
  describe('Return select index information', () => {
    it('Return paths index array of selected.', () => {
      pathSelector.select({ path: 'path_id' })

      expect(pathSelector.selectedOnlyPaths).toBe(true)
      expect(pathSelector.pathsIndex).toEqual(['path_id'])
    })

    it('Return commands index array of selected.', () => {
      pathSelector.select({ path: 'path_id', command: 0 })

      expect(pathSelector.pathsIndex).toEqual(['path_id'])
      expect(pathSelector.getCommandsIndex('path_id')).toEqual([0])
    })

    it('Return points index array of selected.', () => {
      pathSelector.select({ path: 'path_id', command: 0, point: 0 })

      expect(pathSelector.getCommandsIndex('path_id')).toEqual([0])
      expect(pathSelector.getPointsIndex('path_id', 0)).toEqual([0])
    })
  })

  describe('Return selected status.', () => {
    it('Return false when not selected', () => {
      expect(pathSelector.selected).toBe(false)
    })

    it('Return true when path is selected', () => {
      pathSelector.select({ path: 'path_id' })

      expect(pathSelector.selected).toBe(true)
    })
    it('Return true when command is selected', () => {
      pathSelector.select({ path: 'path_id', command: 0 })

      expect(pathSelector.selected).toBe(true)
    })

    it('select point', () => {
      pathSelector.select({ path: 'path_id', command: 0, point: 0 })

      expect(pathSelector.selected).toBe(true)
    })
  })

  it('Clear selected status', () => {
    pathSelector.select({ path: 'path_id' })
    pathSelector.clear()

    expect(pathSelector.selected).toBe(false)
    expect(pathSelector.pathsIndex).toEqual([])
  })

  it('To select multiple paths by selectMerge method.', () => {
    pathSelector.select({ path: 'path_id_1' }, true)
    pathSelector.select({ path: 'path_id_2', command: 0 }, true)
    pathSelector.select({ path: 'path_id_3', command: 0, point: 0 }, true)

    expect(pathSelector.selectedOnlyPaths).toBe(false)
    expect(pathSelector.selected).toBe(true)

    expect(pathSelector.pathsIndex).toEqual([
      'path_id_1',
      'path_id_2',
      'path_id_3',
    ])
    expect(pathSelector.getCommandsIndex('path_id_1')).toEqual(undefined)
    expect(pathSelector.getCommandsIndex('path_id_2')).toEqual([0])
    expect(pathSelector.getCommandsIndex('path_id_3')).toEqual([0])

    expect(pathSelector.getPointsIndex('path_id_2', 0)).toEqual(undefined)
    expect(pathSelector.getPointsIndex('path_id_3', 0)).toEqual([0])
  })

  describe('To unselect selected status', () => {
    const setupSelected = (selector: PathSelector) => {
      selector.select({ path: 'path_id_1' }, true)
      selector.select({ path: 'path_id_2', command: 0 }, true)
      selector.select({ path: 'path_id_3', command: 0, point: 0 }, true)
    }

    it('unselect path', () => {
      setupSelected(pathSelector)
      pathSelector.unselect({ path: 'path_id_1' })

      expect(pathSelector.pathsIndex).toEqual(['path_id_2', 'path_id_3'])
    })

    it('unselect command', () => {
      setupSelected(pathSelector)
      pathSelector.unselect({ path: 'path_id_2', command: 0 })

      expect(pathSelector.getCommandsIndex('path_id_2')).toEqual(undefined)
      expect(pathSelector.pathsIndex).toEqual([
        'path_id_1',
        'path_id_2',
        'path_id_3',
      ])
    })

    it('unselect point', () => {
      setupSelected(pathSelector)

      pathSelector.unselect({ path: 'path_id_3', command: 0, point: 0 })

      expect(pathSelector.getPointsIndex('path_id_3', 0)).toEqual(undefined)
      expect(pathSelector.pathsIndex).toEqual([
        'path_id_1',
        'path_id_2',
        'path_id_3',
      ])
    })
  })
})
