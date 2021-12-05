import { Point, Move, Line, Curve, Close } from '../svg'
import type {
  Command,
  PointObject,
  ConvertOption,
  CreateCommand,
} from '../types'

export interface GenerateCommandsConverter {
  create: CreateCommand
}

export const createLineCommands: CreateCommand = (points) =>
  points.map((p, i) =>
    i === 0 ? new Move(new Point(p.x, p.y)) : new Line(new Point(p.x, p.y))
  )

const distance = ({
  prev,
  next,
}: {
  prev: PointObject
  next: PointObject
}): number =>
  new Point(next.x, next.y).sub(new Point(prev.x, prev.y)).absoluteValue

const calculateDegrees = ({
  prev,
  next,
}: {
  prev: PointObject
  next: PointObject
}): number => new Point(next.x, next.y).sub(new Point(prev.x, prev.y)).degrees

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
  ): Command {
    const value = distance({ prev: p2, next: p3 }) * this.ratio
    const vPrev = Point.fromVector({
      degrees: calculateDegrees({ prev: p1, next: p3 }),
      value,
    })
    const vNext = Point.fromVector({
      degrees: calculateDegrees({ prev: p4, next: p2 }),
      value,
    })

    const cPrev = new Point(p2.x, p2.y).add(vPrev)
    const cNext = new Point(p3.x, p3.y).add(vNext)
    return new Curve([cPrev, cNext, new Point(p3.x, p3.y)])
  }

  public create(p: PointObject[]): Command[] {
    const commands: Command[] = []
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

export const closeCommands = (commands: Command[]): Command[] => [
  ...commands,
  new Close(),
]
