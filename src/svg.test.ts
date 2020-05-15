import { Point, Vector, Path, Svg, Command, CommandType } from './svg'

describe('svg', () => {
  describe('Point', () => {
    it('add', () => {
      const po = new Point(1.0, 1.0).add(new Point(2.0, 2.0))
      expect(po.x).toBe(3.0)
      expect(po.y).toBe(3.0)
    })

    it('sub', () => {
      const po = new Point(3.0, 3.0).sub(new Point(1.0, 1.0))
      expect(po.x).toBe(2.0)
      expect(po.y).toBe(2.0)
    })

    it('scale', () => {
      const po = new Point(1.0, 1.0).scale(3)
      expect(po.x).toBe(3.0)
      expect(po.y).toBe(3.0)
    })

    it('toVector', () => {
      const vec = new Point(1.0, 1.0).toVector()
      expect(vec.value).toBe(1.4142135623730951)
      expect(vec.angle).toBe(0.7853981633974483)
    })
  })
  describe('Vector', () => {
    it('toPoint', () => {
      const po = new Vector(1.4142135, 0.7853982).toPoint()
      expect(po.x).toBe(1.0)
      expect(po.y).toBe(1.0)
    })
    it('scale', () => {
      const vec = new Vector(1.0, 0.5).scale(0.3)
      expect(vec.value).toBe(0.3)
      expect(vec.angle).toBe(0.5)
    })
  })
  describe('Command', () => {
    it('MOVE', () => {
      const commands = new Command(CommandType.MOVE, new Point(0, 0))
      expect(commands.toString()).toBe('M 0 0')
    })
    it('LINE', () => {
      const commands = new Command(CommandType.LINE, new Point(1, 1))
      expect(commands.toString()).toBe('L 1 1')
    })
    it('CURVE', () => {
      const commands = new Command(CommandType.CURVE, new Point(1, 1))
      expect(commands.toString()).toBe('L 1 1')
      commands.cl = new Point(0.25, 0.25)
      commands.cr = new Point(0.75, 0.25)
      expect(commands.toString()).toBe('C 0.25 0.25 0.75 0.25 1 1')
    })
  })
  describe('Path', () => {
    it('addPoint', () => {
      const path = new Path().addPoint(new Point(1, 1))
      expect(path.points.length).toBe(1)
      expect(path.points[0].x).toBe(1)
      expect(path.points[0].y).toBe(1)
    })
    it('addCommand', () => {
      const path = new Path().addCommand(
        new Command(CommandType.LINE, new Point(1, 1))
      )
      expect(path.commands.length).toBe(1)
      expect(path.commands[0].type).toBe(CommandType.LINE)
      expect(path.commands[0].point.x).toBe(1)
      expect(path.commands[0].point.y).toBe(1)
    })
    it('scale', () => {
      const path = new Path({ strokeWidth: 1 })
        .addPoint(new Point(1, 1))
        .scale(2)
      expect(path.strokeWidth).toBe(2)
      expect(path.points[0].x).toBe(2)
      expect(path.points[0].y).toBe(2)
    })
    it('clone', () => {
      const path = new Path({ strokeWidth: 1 }).addPoint(new Point(1, 1))
      const clone = path.clone().addPoint(new Point(2, 2))
      clone.points[0].x = 3
      clone.formatCommand()
      expect(path.points.length).toBe(1)
      expect(path.commands.length).toBe(0)
      expect(path.points[0].x).toBe(1)
      expect(clone.points.length).toBe(2)
      expect(clone.commands.length).toBe(2)
      expect(clone.points[0].x).toBe(3)
    })
    describe('toJson and toElement', () => {
      const path = new Path({ circuler: true, close: false })
        .addPoint(new Point(0, 0))
        .addPoint(new Point(1, 1))
        .addPoint(new Point(2, 1))
        .addPoint(new Point(3, 0))
        .formatCommand()
      it('toJson', () => {
        expect(path.toJson()).toMatchSnapshot()
      })
      it('toElement', () => {
        expect(path.toElement()).toMatchSnapshot()
      })
    })
    describe('formatCommand and getCommandString', () => {
      describe('Line', () => {
        const path = new Path({ circuler: false })
          .addPoint(new Point(0, 0))
          .addPoint(new Point(1, 1))
          .addPoint(new Point(-1, -1))
        it('Normal', () => {
          path.close = false
          expect(path.formatCommand().commands).toMatchSnapshot()
          expect(path.getCommandString()).toMatchSnapshot()
        })
        it('Close', () => {
          path.close = true
          expect(path.formatCommand().commands).toMatchSnapshot()
          expect(path.getCommandString()).toMatchSnapshot()
        })
      })
      describe('Circuler', () => {
        const path = new Path({ circuler: true })
          .addPoint(new Point(0, 0))
          .addPoint(new Point(1, 1))
          .addPoint(new Point(2, 1))
          .addPoint(new Point(3, 0))
        it('Normal', () => {
          path.close = false
          expect(path.formatCommand().commands).toMatchSnapshot()
          expect(path.getCommandString()).toMatchSnapshot()
        })
        it('Close', () => {
          path.close = true
          expect(path.formatCommand().commands).toMatchSnapshot()
          expect(path.getCommandString()).toMatchSnapshot()
        })
      })
    })
  })
  describe('Renderer', () => {
    let svg: Svg
    beforeEach(() => {
      svg = new Svg({ width: 500, height: 500 })
        .addPath(
          new Path({ circuler: true, close: false })
            .addPoint(new Point(0, 0))
            .addPoint(new Point(1, 1))
            .addPoint(new Point(2, 1))
            .addPoint(new Point(3, 0))
            .formatCommand()
        )
        .addPath(
          new Path({ circuler: false, close: true })
            .addPoint(new Point(4, 4))
            .addPoint(new Point(9, 4))
            .addPoint(new Point(9, 8))
            .addPoint(new Point(3, 0))
            .formatCommand()
        )
    })
    // TODO: Fix width, height
    it('toElement', () => {
      expect(svg.toElement()).toMatchSnapshot()
    })
    it('toJson', () => {
      expect(svg.toJson()).toMatchSnapshot()
    })
    // TODO: replace image snapshot
    it('toBase64', () => {
      expect(svg.toBase64()).toMatchSnapshot()
    })
  })
})
