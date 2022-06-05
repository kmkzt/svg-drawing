import { Move, Line, Curve, Close } from '../svg/command'
import { Point } from '../svg/point'
import { Vector } from '../svg/vector'
import type {
  EventPoint,
  CommandClass,
  PointObject,
  ConvertOption,
  CreateCommand,
} from '../types'

export const createLineCommands: CreateCommand = (points) =>
  points.map((p, i) =>
    i === 0 ? new Move(new Point(p.x, p.y)) : new Line(new Point(p.x, p.y))
  )

interface GenerateCommandsConverter {
  create: CreateCommand
}

export class BezierCurve implements GenerateCommandsConverter {
  public ratio: number
  constructor({ ratio }: ConvertOption = {}) {
    this.ratio = ratio ?? 0.4
    this.create = this.create.bind(this)
  }

  public genCommand(
    p1: PointObject,
    p2: PointObject,
    p3: PointObject,
    p4: PointObject
  ): CommandClass {
    const value = Vector.fromPoint(
      new Point(p3.x, p3.y).sub(new Point(p2.x, p2.y))
    ).scale(this.ratio).value

    const vPrev = Point.fromVector({
      angle: Vector.fromPoint(new Point(p3.x, p3.y).sub(new Point(p1.x, p1.y)))
        .angle,
      value,
    })
    const vNext = Point.fromVector({
      angle: Vector.fromPoint(new Point(p2.x, p2.y).sub(new Point(p4.x, p4.y)))
        .angle,
      value,
    })

    const cPrev = new Point(p2.x, p2.y).add(vPrev)
    const cNext = new Point(p3.x, p3.y).add(vNext)
    return new Curve([cPrev, cNext, new Point(p3.x, p3.y)])
  }

  public create(p: EventPoint[]): CommandClass[] {
    const commands: CommandClass[] = []
    if (p.length < 3) {
      return createLineCommands(p)
    }
    for (let i = 0; i < p.length; i += 1) {
      if (i === 0) {
        commands.push(new Move(new Point(p[i].x, p[i].y)))
        continue
      }
      commands.push(
        this.genCommand(
          p[i - 2 < 0 ? 0 : i - 2],
          p[i - 1],
          p[i],
          i < p.length - 1 ? p[i + 1] : p[i]
        )
      )
    }
    return commands
  }
}

export const closeCommands = (commands: CommandClass[]): CommandClass[] => [
  ...commands,
  new Close(),
]
