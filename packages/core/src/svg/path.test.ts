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
    expect(path.commands.length).toBe(2)
    expect(path.commands[0].type).toBe('M')
    expect(path.commands[0].point.x).toBe(1)
    expect(path.commands[0].point.y).toBe(1)
  })
  it('scale', () => {
    path.scale(2)
    expect(path.attrs.strokeWidth).toBe('2')
    expect(path.commands[0].type).toBe('M')
    expect(path.commands[0].point.x).toBe(2)
    expect(path.commands[0].point.y).toBe(2)
  })
  it('parseCommandString', () => {
    const path = new Path()
    const testData =
      'M0 0 L1 1 C2 2 2 4 6 0 Q0 0 1 1 m0 0 l1 1 c1 1 2 2 3 3 H10 V20 h10 v20 A6 4 10 0 1 14 10 a6 4 10 0 1 14 10'
    path.parseCommandString(testData)
    expect(path.getCommandString()).toBe(testData)
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
      expect(pathObjectToElement(path.toJson())).toMatchSnapshot()
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
