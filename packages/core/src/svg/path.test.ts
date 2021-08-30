import { Path } from './path'
import { Point } from './point'
import { Command, COMMAND_TYPE } from './command'
import { pathObjectToElement } from '../renderer'

describe('svg/path.ts', () => {
  describe('Path', () => {
    let path: Path
    beforeEach(() => {
      path = new Path({ strokeWidth: '1' })
        .addCommand(new Command(COMMAND_TYPE.MOVE, [1, 1]))
        .addCommand(new Command(COMMAND_TYPE.LINE, [2, 2]))
    })
    it('addCommand', () => {
      expect(path.commands.length).toBe(2)
      expect(path.commands[0].type).toBe(COMMAND_TYPE.MOVE)
      expect(path.commands[0].point.x).toBe(1)
      expect(path.commands[0].point.y).toBe(1)
    })
    it('scale', () => {
      path.scale(2)
      expect(path.attrs.strokeWidth).toBe('2')
      expect(path.commands[0].type).toBe(COMMAND_TYPE.MOVE)
      expect(path.commands[0].point.x).toBe(2)
      expect(path.commands[0].point.y).toBe(2)
    })
    describe('parseCommandString', () => {
      beforeEach(() => {
        path = new Path()
      })
      it('success pattern', () => {
        const testData =
          'M 0 0 L 1 1 C 2 2 2 4 6 0 Q 0 0 1 1 H 10 V 20 m 0 0 l 1 1 c 1 1 2 2 3 3 h 10 v 20 A 6 4 10 0 1 14 10 a 6 4 10 0 1 14 10'
        path.parseCommandString(testData)
        expect(path.getCommandString()).toBe(testData)
      })
      it('close command', () => {
        const testData = 'M 0 0 L 1 1 C 2 2 2 4 6 0 Z'
        path.parseCommandString(testData)
        expect(path.getCommandString()).toBe(testData)
      })
      // TODO: Validate command
      it.skip('failed pattern', () => {
        path.parseCommandString('M a b')
        expect(path.getCommandString()).toBe('')
        path.parseCommandString('M 0 0 C 0 1 2')
        expect(path.getCommandString()).toBe('M 0 0')
      })
    })
    it('clone', () => {
      const origin = new Path({ strokeWidth: '1' }).addCommand(
        new Command(COMMAND_TYPE.MOVE, [1, 1])
      )
      const clone = origin
        .clone()
        .addCommand(new Command(COMMAND_TYPE.LINE, [2, 2]))
      clone.commands[0].point = new Point(3, clone.commands[0].point.y)
      expect(origin.commands.length).toBe(1)
      expect(clone.commands.length).toBe(2)
      expect(origin.commands[0].point.x).toBe(1)
      expect(clone.commands[0].point.x).toBe(3)
    })
    describe('toJson and toElement', () => {
      const path = new Path()
        .addCommand(new Command(COMMAND_TYPE.MOVE, [0, 0]))
        .addCommand(new Command(COMMAND_TYPE.LINE, [1, 1]))
        .addCommand(new Command(COMMAND_TYPE.LINE, [2, 1]))
        .addCommand(new Command(COMMAND_TYPE.LINE, [3, 0]))
      it('toJson', () => {
        expect(path.toJson()).toMatchSnapshot()
      })
      it('toElement', () => {
        expect(pathObjectToElement(path.toJson())).toMatchSnapshot()
      })
    })
    describe('commands parameter and getCommandString', () => {
      const path = new Path()
        .addCommand(new Command(COMMAND_TYPE.MOVE, [0, 0]))
        .addCommand(new Command(COMMAND_TYPE.LINE, [1, 1]))
        .addCommand(new Command(COMMAND_TYPE.LINE, [-1, -1]))
      it('Normal', () => {
        expect(path.commands).toMatchSnapshot()
        expect(path.getCommandString()).toMatchSnapshot()
      })
    })
  })
})
