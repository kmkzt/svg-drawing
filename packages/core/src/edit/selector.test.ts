import { Selector } from './selector'

describe('Selector', () => {
  describe('toJson', () => {
    it('Select path', () => {
      const selector = new Selector()
      selector.select({ type: 'path', key: 'path_id_1' })

      expect(selector.toJson()).toStrictEqual([
        {
          key: 'path_id_1',
          type: 'path',
          anchorPoints: [],
        },
      ])
    })

    it('Select command', () => {
      const selector = new Selector()
      selector.select({
        type: 'path/command',
        key: 'path_id_2',
        index: { command: 0 },
      })

      expect(selector.toJson()).toStrictEqual([
        {
          type: 'path',
          key: 'path_id_2',
          anchorPoints: [
            {
              type: 'path/command',
              index: {
                command: 0,
              },
            },
          ],
        },
      ])
    })

    it('Select point', () => {
      const selector = new Selector()
      selector.select({
        type: 'path/anchorPoint',
        key: 'path_id_3',
        index: { command: 0, point: 0 },
      })

      expect(selector.toJson()).toStrictEqual([
        {
          type: 'path',
          key: 'path_id_3',
          anchorPoints: [
            {
              type: 'path/anchorPoint',
              index: {
                command: 0,
                point: 0,
              },
            },
          ],
        },
      ])
    })
  })
})
