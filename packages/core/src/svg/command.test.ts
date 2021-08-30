import { Command, COMMAND_TYPE } from './command'
import { Point } from './point'

describe('svg/command.ts', () => {
  describe('Command', () => {
    it('MOVE', () => {
      const cmd = new Command(COMMAND_TYPE.MOVE, [0, 0])
      expect(cmd.toString()).toBe('M 0 0')
    })
    it('LINE', () => {
      const cmd = new Command(COMMAND_TYPE.LINE, [1, 1])
      expect(cmd.toString()).toBe('L 1 1')
    })
    it('CURVE', () => {
      const cmd = new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
        0.25,
        0.25,
        0.75,
        0.25,
        1,
        1,
      ])
      expect(cmd.toString()).toBe('C 0.25 0.25 0.75 0.25 1 1')
    })

    describe('clone', () => {
      let cmd: Command
      let clone: Command
      beforeEach(() => {
        cmd = new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
          0.25,
          0.25,
          0.75,
          0.25,
          1,
          1,
        ])
        clone = cmd.clone()
      })
      it('point is not overwritten', () => {
        clone.point = new Point(1.5, 1)
        expect(cmd.point.x).toBe(1)
        expect(clone.point.x).toBe(1.5)
      })
      it('cl is not overwritten', () => {
        clone.cl = new Point(0.1, 0.1)
        expect(cmd.cl.x).toBe(0.25)
        expect(clone.cl.x).toBe(0.1)
      })
      it('cr is not overwritten', () => {
        clone.cr = new Point(1.2, 0.1)
        expect(cmd.cr.x).toBe(0.75)
        expect(clone.cr.x).toBe(1.2)
      })
    })

    describe('scale', () => {
      it('MOVE', () => {
        const cmd = new Command(COMMAND_TYPE.MOVE, [1, 1]).scale(2)
        expect(cmd.toString()).toBe('M 2 2')
      })
      it('LINE', () => {
        const cmd = new Command(COMMAND_TYPE.LINE, [1, 1]).scale(2)
        expect(cmd.toString()).toBe('L 2 2')
      })
      it('CURVE', () => {
        const cmd = new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
          0.25,
          0.25,
          0.75,
          0.25,
          1,
          1,
        ]).scale(2)
        expect(cmd.toString()).toBe('C 0.5 0.5 1.5 0.5 2 2')
      })
    })

    describe('scaleX', () => {
      it('MOVE', () => {
        const cmd = new Command(COMMAND_TYPE.MOVE, [1, 1]).scaleX(2)
        expect(cmd.toString()).toBe('M 2 1')
      })
      it('LINE', () => {
        const cmd = new Command(COMMAND_TYPE.LINE, [1, 1]).scaleX(2)
        expect(cmd.toString()).toBe('L 2 1')
      })
      it('CURVE', () => {
        const cmd = new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
          0.25,
          0.25,
          0.75,
          0.25,
          1,
          1,
        ]).scaleX(2)
        expect(cmd.toString()).toBe('C 0.5 0.25 1.5 0.25 2 1')
      })
    })

    describe('scaleY', () => {
      it('MOVE', () => {
        const cmd = new Command(COMMAND_TYPE.MOVE, [1, 1]).scaleY(2)
        expect(cmd.toString()).toBe('M 1 2')
      })
      it('LINE', () => {
        const cmd = new Command(COMMAND_TYPE.LINE, [1, 1]).scaleY(2)
        expect(cmd.toString()).toBe('L 1 2')
      })
      it('CURVE', () => {
        const cmd = new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
          0.25,
          0.25,
          0.75,
          0.25,
          1,
          1,
        ]).scaleY(2)
        expect(cmd.toString()).toBe('C 0.25 0.5 0.75 0.5 1 2')
      })
    })
  })
})
