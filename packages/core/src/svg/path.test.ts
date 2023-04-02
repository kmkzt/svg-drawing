import { createCommand } from './command'
import { Path } from './path'

describe('Path', () => {
  describe('getCommandString', () => {
    it('Return relative path commands string.', () => {
      const path = new Path({ strokeWidth: '1' }).setCommands([
        createCommand({ type: 'M', values: [1, 1] }),
        createCommand({ type: 'L', values: [2, 2] }),
      ])

      expect(path.absoluteCommands.length).toBe(2)
      expect(path.absoluteCommands[0].toString()).toBe('M1 1')
      expect(path.absoluteCommands[1].toString()).toBe('L2 2')
      expect(path.getCommandString()).toBe('M1 1 l1 1')
    })
  })

  describe('scale', () => {
    it('scale up double', () => {
      const path = new Path({ strokeWidth: '1' }).setCommands([
        createCommand({ type: 'M', values: [1, 1] }),
        createCommand({ type: 'L', values: [2, 2] }),
      ])

      path.scale(2)
      expect(path.absoluteCommands[0].type).toBe('M')
      expect(path.absoluteCommands[0].toString()).toBe('M2 2')
      expect(path.absoluteCommands[1].toString()).toBe('L4 4')
    })
  })

  describe('clone', () => {
    it('Clone path have same key of origin.', () => {
      const origin = new Path({})
      expect(origin.key).toBe(origin.clone().key)
    })

    it('Origin path do not changed when clone path changed.', () => {
      const origin = new Path({ strokeWidth: '1' }).setCommands([
        createCommand({
          type: 'M',
          values: [1, 1],
        }),
      ])

      const clone = origin.clone()
      clone.updateCommand(0, (command) => command.translate({ x: 2, y: 0 }))
      clone.addCommand(createCommand({ type: 'l', values: [1, 1] }))

      expect(origin.getCommandString()).toMatchInlineSnapshot(`"M1 1"`)
      expect(clone.getCommandString()).toMatchInlineSnapshot(`"M3 1 l1 1"`)
    })
  })

  describe('key', () => {
    it('Take over key.', () => {
      const testKey = 'test_key'
      expect(new Path({}, testKey).key).toBe(testKey)
    })
  })

  describe('toJson', () => {
    const path = new Path().setCommands([
      createCommand({ type: 'M', values: [0, 0] }),
      createCommand({ type: 'L', values: [1, 1] }),
      createCommand({ type: 'L', values: [2, 1] }),
      createCommand({ type: 'L', values: [3, 0] }),
    ])
    it('Return PathObject', () => {
      expect(path.toJson()).toStrictEqual({
        attributes: {
          d: 'M0 0 l1 1 l1 0 l1 -1',
        },
        key: 'p1',
        type: 'path',
      })
    })
  })
})
