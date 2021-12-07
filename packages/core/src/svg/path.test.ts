import { Line, Move } from '.'
import { Path, toRelativePath } from './path'
import { Point } from './point'
import { parseCommandString } from '../parser'
import { pathObjectToElement } from '../renderer'

describe('Path', () => {
  let path: Path
  beforeEach(() => {
    path = new Path({ strokeWidth: '1' })
      .addCommand(new Move(new Point(1, 1)))
      .addCommand(new Line(new Point(2, 2)))
  })
  it('addCommand', () => {
    expect(path.commands.length).toBe(2)
    expect(path.commands[0].type).toBe('M')
    expect(path.commands[0].point.x).toBe(1)
    expect(path.commands[0].point.y).toBe(1)
  })
  it('scale', () => {
    path.scale(2)
    expect(path.commands[0].type).toBe('M')
    expect(path.commands[0].point.x).toBe(2)
    expect(path.commands[0].point.y).toBe(2)
  })
  it('clone', () => {
    const origin = new Path({ strokeWidth: '1' }).addCommand(
      new Move(new Point(1, 1))
    )
    const clone = origin.clone().addCommand(new Line(new Point(2, 2)))
    clone.commands[0].points[0] = new Point(3, clone.commands[0].point.y)
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
      expect(path.commands).toMatchSnapshot()
      expect(path.getCommandString()).toMatchSnapshot()
    })
  })
})

describe('toRelativePath', () => {
  it('Success', () => {
    const path = new Path()
    path.addCommand(
      parseCommandString('M0 0 M100 100 L200 200 C300 300 400 300 500 200 z')
    )

    expect(toRelativePath(path).getCommandString()).toBe(
      'M0 0 m100 100 l100 100 c100 100 200 100 300 0 z'
    )
  })
})
