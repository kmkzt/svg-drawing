import { Path } from './path'
import { Point } from './point'
import type { PointClass } from '../types'

describe('Path', () => {
  let path: Path
  beforeEach(() => {
    path = new Path({ strokeWidth: '1' }).addCommand([
      { type: 'M', values: [1, 1] },
      { type: 'L', values: [2, 2] },
    ])
  })

  describe('getCommandString', () => {
    it('Return relative path commands.', () => {
      expect(path.absoluteCommands.length).toBe(2)
      expect(path.absoluteCommands[0].toString()).toBe('M1 1')
      expect(path.absoluteCommands[1].toString()).toBe('L2 2')
      expect(path.getCommandString()).toBe('M1 1 l1 1')
    })
  })
  describe('scale', () => {
    it('scale up double', () => {
      path.scale(2)
      expect(path.absoluteCommands[0].type).toBe('M')
      expect(path.absoluteCommands[0].toString()).toBe('M2 2')
      expect(path.absoluteCommands[1].toString()).toBe('L4 4')
    })
  })
  it('clone', () => {
    const origin = new Path({ strokeWidth: '1' }).addCommand({
      type: 'M',
      values: [1, 1],
    })
    const clone = origin.clone().addCommand({ type: 'L', values: [2, 2] })
    clone.absoluteCommands[0].points[0] = new Point(
      3,
      (clone.absoluteCommands[0].point as PointClass).y
    )
    expect(origin.getCommandString()).toMatchInlineSnapshot(`"M1 1"`)
    expect(clone.getCommandString()).toMatchInlineSnapshot(`"M3 1 l1 1"`)
  })

  describe('key', () => {
    it('Take over key.', () => {
      const testKey = 'test_key'
      expect(new Path({}, testKey).key).toBe(testKey)
    })
    it('clone path have same key of origin.', () => {
      const origin = new Path({})
      expect(origin.key).toBe(origin.clone().key)
    })
  })

  describe('toJson and toElement', () => {
    const path = new Path().addCommand([
      { type: 'M', values: [0, 0] },
      { type: 'L', values: [1, 1] },
      { type: 'L', values: [2, 1] },
      { type: 'L', values: [3, 0] },
    ])
    it('toJson', () => {
      expect(path.toJson()).toMatchInlineSnapshot(`
        Object {
          "attributes": Object {
            "d": "M0 0 l1 1 l1 0 l1 -1",
          },
          "key": "p1",
          "type": "path",
        }
      `)
    })
  })
  describe('commands parameter and getCommandString', () => {
    const path = new Path().addCommand([
      { type: 'M', values: [0, 0] },
      { type: 'L', values: [1, 1] },
      { type: 'L', values: [-1, -1] },
    ])

    it('Normal', () => {
      expect(path.absoluteCommands).toMatchInlineSnapshot(`
        Array [
          Move {
            "points": Array [
              Point {
                "_x": 0,
                "_y": 0,
              },
            ],
            "type": "M",
          },
          Line {
            "points": Array [
              Point {
                "_x": 1,
                "_y": 1,
              },
            ],
            "type": "L",
          },
          Line {
            "points": Array [
              Point {
                "_x": -1,
                "_y": -1,
              },
            ],
            "type": "L",
          },
        ]
      `)
      expect(path.getCommandString()).toMatchInlineSnapshot(
        `"M0 0 l1 1 l-2 -2"`
      )
    })
  })
})
