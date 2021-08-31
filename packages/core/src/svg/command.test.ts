import { Command } from './command'
import { Point } from './point'

describe('svg/command.ts', () => {
  describe('Command', () => {
    describe('new Command()', () => {
      it('Absolute', () => {
        expect(new Command('M', [0, 0]).toString()).toBe('M 0 0')
        expect(new Command('L', [1, 1]).toString()).toBe('L 1 1')
        expect(
          new Command('C', [0.25, 0.25, 0.75, 0.25, 1, 1]).toString()
        ).toBe('C 0.25 0.25 0.75 0.25 1 1')
      })
      it.todo('Relative')
    })

    describe('clone', () => {
      let cmd: Command
      let clone: Command
      beforeEach(() => {
        cmd = new Command('C', [0.25, 0.25, 0.75, 0.25, 1, 1])
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
      it('Absolute', () => {
        expect(new Command('M', [1, 1]).scale(2).toString()).toBe('M 2 2')
        expect(new Command('L', [1, 1]).scale(2).toString()).toBe('L 2 2')
        expect(
          new Command('C', [0.25, 0.25, 0.75, 0.25, 1, 1]).scale(2).toString()
        ).toBe('C 0.5 0.5 1.5 0.5 2 2')
      })
      it.todo('Relative')
    })

    describe('scaleX', () => {
      it('Absolute', () => {
        expect(new Command('M', [1, 1]).scaleX(2).toString()).toBe('M 2 1')
        expect(new Command('L', [1, 1]).scaleX(2).toString()).toBe('L 2 1')
        expect(
          new Command('C', [0.25, 0.25, 0.75, 0.25, 1, 1]).scaleX(2).toString()
        ).toBe('C 0.5 0.25 1.5 0.25 2 1')
      })

      it.todo('Relative')
    })

    describe('scaleY', () => {
      it('Absolute', () => {
        expect(new Command('M', [1, 1]).scaleY(2).toString()).toBe('M 1 2')
        expect(new Command('L', [1, 1]).scaleY(2).toString()).toBe('L 1 2')
        expect(
          new Command('C', [0.25, 0.25, 0.75, 0.25, 1, 1]).scaleY(2).toString()
        ).toBe('C 0.25 0.5 0.75 0.5 1 2')
      })

      it.todo('Relative')
    })
    it('validTypes', () => {
      expect(Command.validTypes('M')).toBe(true)
      expect(Command.validTypes('m')).toBe(true)
      expect(Command.validTypes('L')).toBe(true)
      expect(Command.validTypes('l')).toBe(true)
      expect(Command.validTypes('C')).toBe(true)
      expect(Command.validTypes('c')).toBe(true)
      expect(Command.validTypes('Z')).toBe(true)
      expect(Command.validTypes('z')).toBe(true)
      expect(Command.validTypes('A')).toBe(true)
      expect(Command.validTypes('a')).toBe(true)
      expect(Command.validTypes('Q')).toBe(true)
      expect(Command.validTypes('q')).toBe(true)
      expect(Command.validTypes('S')).toBe(true)
      expect(Command.validTypes('s')).toBe(true)
    })
  })
})
