import { createCommand } from '../svg/command'
import { Point } from '../svg/point'
import { Vector } from '../svg/vector'
import type {
  EventPoint,
  CommandClass,
  PointObject,
  BezierCurveOption,
} from '../types'

export const createLineCommands = (points: EventPoint[]): CommandClass[] =>
  points.map((p, i) =>
    i === 0
      ? createCommand({ type: 'M', values: [p.x, p.y] })
      : createCommand({ type: 'L', values: [p.x, p.y] })
  )

interface GenerateCommandsConverter {
  create: (points: EventPoint[]) => CommandClass[]
}

export class BezierCurve implements GenerateCommandsConverter {
  public ratio: number
  constructor({ ratio }: BezierCurveOption = {}) {
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

    return createCommand({
      type: 'C',
      values: [...cPrev.values, ...cNext.values, p3.x, p3.y],
    })
  }

  public create(points: EventPoint[]): CommandClass[] {
    const commands: CommandClass[] = []
    if (points.length < 3) {
      return createLineCommands(points)
    }
    for (let i = 0; i < points.length; i += 1) {
      if (i === 0) {
        commands.push(
          createCommand({ type: 'M', values: [points[i].x, points[i].y] })
        )
        continue
      }
      commands.push(
        this.genCommand(
          points[i - 2 < 0 ? 0 : i - 2],
          points[i - 1],
          points[i],
          i < points.length - 1 ? points[i + 1] : points[i]
        )
      )
    }
    return commands
  }
}

export const closeCommands = (commands: CommandClass[]): CommandClass[] => [
  ...commands,
  createCommand({ type: 'Z', values: [] }),
]
