import { Point, Vector, Path, Svg, Command, CommandType } from './svg'

describe('svg.ts', () => {
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

    it('clone', () => {
      const po = new Point(0, 0)
      const clone = po.clone()
      clone.x = 2
      expect(po.x).toBe(0)
      expect(clone.x).toBe(2)
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
      const cmd = new Command(CommandType.MOVE, new Point(0, 0))
      expect(cmd.toString()).toBe('M 0 0')
    })
    it('LINE', () => {
      const cmd = new Command(CommandType.LINE, new Point(1, 1))
      expect(cmd.toString()).toBe('L 1 1')
    })
    it('CURVE', () => {
      const cmd = new Command(CommandType.CURVE, new Point(1, 1))
      expect(cmd.toString()).toBe('L 1 1')
      cmd.cl = new Point(0.25, 0.25)
      cmd.cr = new Point(0.75, 0.25)
      expect(cmd.toString()).toBe('C 0.25 0.25 0.75 0.25 1 1')
    })

    describe('clone', () => {
      let cmd
      let clone
      beforeEach(() => {
        cmd = new Command(CommandType.CURVE, new Point(1, 1))
        cmd.cl = new Point(0.25, 0.25)
        cmd.cr = new Point(0.75, 0.25)
        clone = cmd.clone()
      })
      it('point is not overwritten', () => {
        clone.x = 1.5
        expect(cmd.point.x).toBe(1)
        expect(clone.point.x).toBe(1)
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
  })
  describe('Path', () => {
    let path: Path
    beforeEach(() => {
      path = new Path({ strokeWidth: 1 })
        .addCommand(new Point(1, 1))
        .addCommand(new Point(2, 2))
    })
    it('addCommand', () => {
      expect(path.commands.length).toBe(2)
      expect(path.commands[0].type).toBe(CommandType.MOVE)
      expect(path.commands[0].point.x).toBe(1)
      expect(path.commands[0].point.y).toBe(1)
    })
    it('scale', () => {
      path.scale(2)
      expect(path.strokeWidth).toBe(2)
      expect(path.commands[0].type).toBe(CommandType.MOVE)
      expect(path.commands[0].point.x).toBe(2)
      expect(path.commands[0].point.y).toBe(2)
    })
    describe('parsePathElement', () => {
      it('success pattern', () => {
        const pathEl = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        )
        pathEl.setAttribute('fill', '#00f')
        pathEl.setAttribute('stroke', '#f00')
        pathEl.setAttribute('stroke-width', '4')
        pathEl.setAttribute('d', 'M 0 0 L 1 1 C 2 2 2 4 6 0')
      })
    })
    describe('parseCommandString', () => {
      beforeEach(() => {
        path = new Path()
      })
      it('success pattern', () => {
        path.parseCommandString('M 0 0 L 1 1 C 2 2 2 4 6 0')
        expect(path.commands).toMatchSnapshot()
        expect(path.close).toBe(false)
      })
      it('close command', () => {
        path.parseCommandString('M 0 0 L 1 1 C 2 2 2 4 6 0 Z')
        expect(path.commands).toMatchSnapshot()
        expect(path.close).toBe(true)
      })
      it('failed pattern', () => {
        path.parseCommandString('M a b')
        expect(path.commands).toMatchSnapshot()
        path.parseCommandString('M 0 0 C 0 1 2')
        expect(path.commands).toMatchSnapshot()
      })
    })
    it('clone', () => {
      const origin = new Path({ strokeWidth: 1 }).addCommand(new Point(1, 1))
      const clone = origin.clone().addCommand(new Point(2, 2))
      clone.commands[0].point.x = 3
      expect(origin.commands.length).toBe(1)
      expect(clone.commands.length).toBe(2)
      expect(origin.commands[0].point.x).toBe(1)
      expect(clone.commands[0].point.x).toBe(3)
    })
    describe('toJson and toElement', () => {
      const path = new Path({ curve: true, close: false })
        .addCommand(new Point(0, 0))
        .addCommand(new Point(1, 1))
        .addCommand(new Point(2, 1))
        .addCommand(new Point(3, 0))

      it('toJson', () => {
        expect(path.toJson()).toMatchSnapshot()
      })
      it('toElement', () => {
        expect(path.toElement()).toMatchSnapshot()
      })
    })
    describe('commands parameter and getCommandString', () => {
      describe('Line', () => {
        const path = new Path({ curve: false })
          .addCommand(new Point(0, 0))
          .addCommand(new Point(1, 1))
          .addCommand(new Point(-1, -1))
        it('Normal', () => {
          path.close = false
          expect(path.commands).toMatchSnapshot()
          expect(path.getCommandString()).toMatchSnapshot()
        })
        it('Close', () => {
          path.close = true
          expect(path.commands).toMatchSnapshot()
          expect(path.getCommandString()).toMatchSnapshot()
        })
      })
      describe('curve', () => {
        const path = new Path({ curve: true })
          .addCommand(new Point(0, 0))
          .addCommand(new Point(1, 1))
          .addCommand(new Point(2, 1))
          .addCommand(new Point(3, 0))
        it('Normal', () => {
          path.close = false
          expect(path.commands).toMatchSnapshot()
          expect(path.getCommandString()).toMatchSnapshot()
        })
        it('Close', () => {
          path.close = true
          expect(path.commands).toMatchSnapshot()
          expect(path.getCommandString()).toMatchSnapshot()
        })
      })
    })
  })
  describe('Svg', () => {
    let svg: Svg
    beforeEach(() => {
      svg = new Svg({ width: 500, height: 500 })
        .addPath(
          new Path({ curve: true, close: false })
            .addCommand(new Point(0, 0))
            .addCommand(new Point(1, 1))
            .addCommand(new Point(2, 1))
            .addCommand(new Point(3, 0))
        )
        .addPath(
          new Path({ curve: false, close: true })
            .addCommand(new Point(4, 4))
            .addCommand(new Point(9, 4))
            .addCommand(new Point(9, 8))
            .addCommand(new Point(3, 0))
        )
    })

    it('parseSVGString', () => {
      expect(
        new Svg({ width: 400, height: 400 }).parseSVGString(`
      <svg width="200" height="200">
        <path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
      </svg>`)
      ).toMatchSnapshot()
    })
    it('parseSVGElement', () => {
      const svgEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      )
      svgEl.setAttribute('width', '200')
      svgEl.setAttribute('height', '200')
      const pathEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      )
      pathEl.setAttribute('fill', '#f00')
      pathEl.setAttribute('stroke', '#00f')
      pathEl.setAttribute('stroke-width', '4')
      pathEl.setAttribute('d', 'M 1 1 L 2 2 C 3 3 5 3 7 3 Z')
      svgEl.appendChild(pathEl)
      expect(
        new Svg({ width: 400, height: 400 }).parseSVGElement(svgEl)
      ).toMatchSnapshot()
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
