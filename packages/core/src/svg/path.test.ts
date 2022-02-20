import { Line, Move } from '.'
import { Path } from './path'
import { Point } from './point'
import { pathObjectToElement } from '../renderer'

describe('Path', () => {
  let path: Path
  beforeEach(() => {
    path = new Path({ strokeWidth: '1' })
      .addCommand(new Move(new Point(1, 1)))
      .addCommand(new Line(new Point(2, 2)))
  })
  it('addCommand', () => {
    expect(path.absoluteCommands.length).toBe(2)
    expect(path.absoluteCommands[0].type).toBe('M')
    expect(path.absoluteCommands[0].point.x).toBe(1)
    expect(path.absoluteCommands[0].point.y).toBe(1)
  })
  it('scale', () => {
    path.scale(2)
    expect(path.absoluteCommands[0].type).toBe('M')
    expect(path.absoluteCommands[0].point.x).toBe(2)
    expect(path.absoluteCommands[0].point.y).toBe(2)
  })
  it('clone', () => {
    const origin = new Path({ strokeWidth: '1' }).addCommand(
      new Move(new Point(1, 1))
    )
    const clone = origin.clone().addCommand(new Line(new Point(2, 2)))
    clone.absoluteCommands[0].points[0] = new Point(
      3,
      clone.absoluteCommands[0].point.y
    )
    expect(origin.getCommandString()).toBe('M1 1')
    expect(clone.getCommandString()).toBe('M3 1 L2 2')
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
    const path = new Path()
      .addCommand(new Move(new Point(0, 0)))
      .addCommand(new Line(new Point(1, 1)))
      .addCommand(new Line(new Point(2, 1)))
      .addCommand(new Line(new Point(3, 0)))
    it('toJson', () => {
      expect(path.toJson()).toMatchSnapshot()
    })
    it('toElement', () => {
      const { attributes } = path.toJson()
      expect(pathObjectToElement(attributes)).toMatchSnapshot()
    })
  })
  describe('commands parameter and getCommandString', () => {
    const path = new Path()
      .addCommand(new Move(new Point(0, 0)))
      .addCommand(new Line(new Point(1, 1)))
      .addCommand(new Line(new Point(-1, -1)))
    it('Normal', () => {
      expect(path.absoluteCommands).toMatchSnapshot()
      expect(path.getCommandString()).toMatchSnapshot()
    })
  })
})
