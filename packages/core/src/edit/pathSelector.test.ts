import { PathSelector } from './pathSelector'

describe('PathSelector', () => {
  let pathSelector: PathSelector

  beforeEach(() => {
    pathSelector = new PathSelector()
  })
  describe('PathSelector.selectedPathsOnly', () => {
    it('not selected', () => {
      expect(pathSelector.selectedPathsOnly).toBe(false)
    })

    it('select path', () => {
      pathSelector.select({ path: 'path_id' })

      expect(pathSelector.selectedPathsOnly).toBe(true)
    })

    it('select command', () => {
      pathSelector.select({ path: 'path_id', command: 0 })

      expect(pathSelector.selectedPathsOnly).toBe(false)
    })

    it('select point', () => {
      pathSelector.select({ path: 'path_id', command: 0, point: 0 })

      expect(pathSelector.selectedPathsOnly).toBe(false)
    })
  })

  describe('PathSelector.selected', () => {
    it('not selected', () => {
      expect(pathSelector.selected).toBe(false)
    })

    it('selected path', () => {
      pathSelector.select({ path: 'path_id' })

      expect(pathSelector.selected).toBe(true)
    })
    it('selected command', () => {
      pathSelector.select({ path: 'path_id', command: 0 })

      expect(pathSelector.selected).toBe(true)
    })

    it('select point', () => {
      pathSelector.select({ path: 'path_id', command: 0, point: 0 })

      expect(pathSelector.selected).toBe(true)
    })
  })

  it('PathSelector.pathsIndex', () => {
    pathSelector.select({ path: 'path_id' })

    expect(pathSelector.pathsIndex).toEqual(['path_id'])
  })

  it('PathSelector.getCommandsIndex', () => {
    pathSelector.select({ path: 'path_id', command: 0 })

    expect(pathSelector.getCommandsIndex('path_id')).toEqual([0])
  })

  it('PathSelector.getPointsIndex', () => {
    pathSelector.select({ path: 'path_id', command: 0, point: 0 })

    expect(pathSelector.getPointsIndex('path_id', 0)).toEqual([0])
  })

  it('PathSelector.clear', () => {
    pathSelector.select({ path: 'path_id' })
    pathSelector.clear()

    expect(pathSelector.selected).toBe(false)
    expect(pathSelector.pathsIndex).toEqual([])
    expect(pathSelector.toJson()).toEqual({})
  })

  it('PathSelector.select', () => {
    pathSelector.select({ path: 'path_id' })
    pathSelector.select({ path: 'path_id_override' })

    expect(pathSelector.selectedPathsOnly).toBe(true)
    expect(pathSelector.selected).toBe(true)
    expect(pathSelector.toJson()).toEqual({ ['path_id_override']: {} })
  })

  it('PathSelector.selectMerge', () => {
    pathSelector.selectMerge({ path: 'path_id_1' })
    pathSelector.selectMerge({ path: 'path_id_2', command: 0 })
    pathSelector.selectMerge({ path: 'path_id_3', command: 0, point: 0 })

    expect(pathSelector.selectedPathsOnly).toBe(false)
    expect(pathSelector.selected).toBe(true)
    expect(pathSelector.toJson()).toEqual({
      ['path_id_1']: {},
      ['path_id_2']: { [0]: [] },
      ['path_id_3']: { [0]: [0] },
    })
  })

  describe('PathSelector.unselect', () => {
    const setupSelected = (selector: PathSelector) => {
      selector.selectMerge({ path: 'path_id_1' })
      selector.selectMerge({ path: 'path_id_2', command: 0 })
      selector.selectMerge({ path: 'path_id_3', command: 0, point: 0 })
    }

    it('unselect path', () => {
      setupSelected(pathSelector)
      pathSelector.unselect({ path: 'path_id_1' })

      expect(pathSelector.toJson()).toEqual({
        ['path_id_2']: { [0]: [] },
        ['path_id_3']: { [0]: [0] },
      })
    })

    it('unselect command', () => {
      setupSelected(pathSelector)
      pathSelector.unselect({ path: 'path_id_2', command: 0 })

      expect(pathSelector.toJson()).toEqual({
        ['path_id_1']: {},
        ['path_id_2']: {},
        ['path_id_3']: { [0]: [0] },
      })
    })

    it('unselect point', () => {
      setupSelected(pathSelector)

      pathSelector.unselect({ path: 'path_id_3', command: 0, point: 0 })
      expect(pathSelector.toJson()).toEqual({
        ['path_id_1']: {},
        ['path_id_2']: { [0]: [] },
        ['path_id_3']: { [0]: [] },
      })
    })
  })
})
