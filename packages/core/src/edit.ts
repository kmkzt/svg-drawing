import { Path, Point, Svg } from './svg'
import type {
  PointObject,
  ControlPoint,
  BoundingBox,
  PathObject,
  Selecting,
  EditSvgObject,
} from './types'

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

export class EditSvg {
  constructor(public svg: Svg) {}

  public changeAttributes({ d, ...attrs }: PathObject, selecting: Selecting) {
    for (const pathKey in selecting) {
      const path = this.svg.paths[+pathKey]
      path.attrs = {
        ...path.attrs,
        ...attrs,
      }
      if (d) path.parseCommandString(d)
    }
  }

  public translate(po: PointObject, selecting: Selecting) {
    for (const pathKey in selecting) {
      const path = this.svg.paths[+pathKey]
      const selectingCommand = selecting[pathKey]
      if (Object.keys(selectingCommand).length === 0) {
        path.translate(po)
        continue
      }
      for (const commandKey in selectingCommand) {
        const command = path.commands[+commandKey]
        const selectingPoint = selectingCommand[+commandKey]
        if (Object.keys(selectingPoint).length === 0) {
          command.translate(po)
          continue
        }
        selectingPoint.map((pointKey: number) => {
          command.value[pointKey] += po.x
          command.value[pointKey + 1] += po.y
        })
      }
    }
  }

  public delete(selecting: Selecting) {
    for (const pathKey in selecting) {
      const selectingCommand = selecting[pathKey]
      if (Object.keys(selectingCommand).length === 0) {
        this.svg.deletePath(+pathKey)
        continue
      }
      const path = this.svg.paths[+pathKey]
      for (const commandKey in selectingCommand) {
        path.deleteCommand(+commandKey)
        /**
         * @todo delete points
         */
        // const selectingPoint = selectingCommand[+commandKey]
        // if (Object.keys(selectingPoint).length === 0) {
        //   path.deleteCommand(+commandKey)
        //   continue
        // }
        // const command = path.commands[+commandKey]
        // for (const pointKey in selectingPoint) {
        //   command.deletePoint(pointKey)
        // }
      }
    }
  }

  public toJson(selecting: Selecting): EditSvgObject {
    const listX: number[] = []
    const listY: number[] = []
    const selectPaths: EditSvgObject['selectPaths'] = Object.keys(
      selecting
    ).reduce((obj, selectId: string) => {
      const index = +selectId
      const path = this.svg.paths[index]
      if (!path) return obj
      const edit = new EditPath(path.clone())
      const boundingBox = edit.boundingBox
      const {
        min: [cMinX, cMinY],
        max: [cMaxX, cMaxY],
      } = boundingBox

      listX.push(cMinX, cMaxX)
      listY.push(cMinY, cMaxY)
      return {
        ...obj,
        [index]: {
          d: path.getCommandString(),
          boundingBox,
          controlPoints: edit.controlPoints,
        },
      }
    }, {} as EditSvgObject['selectPaths'])
    return {
      boundingBox: {
        min: [Math.min(...listX), Math.min(...listY)],
        max: [Math.max(...listX), Math.max(...listY)],
      },
      selectPaths,
    }
  }
}

export class EditPath {
  constructor(public path: Path) {}

  /**
   * @todo compatible relative point
   */
  public get points(): Point[] {
    const commands = this.path.commands
    return commands.reduce(
      (p, com) => (com.point ? [...p, com.point] : p),
      [] as Point[]
    )
  }

  public get controlPoints(): ControlPoint[] {
    const controlPoints: ControlPoint[] = []
    const commands = this.path.commands
    for (let i = 0; i < commands.length; i += 1) {
      const curr = commands[i]
      const next = commands[i + 1]
      const outlinePoints = [
        curr.cr?.toJson(),
        curr.point?.toJson(),
        next?.cl?.toJson(),
      ].filter(Boolean) as PointObject[]
      const points: PointObject[] = [
        curr.cl?.toJson(),
        curr.cr?.toJson(),
        curr.point?.toJson(),
      ].filter(Boolean) as PointObject[]
      controlPoints.push({
        points,
        d: genOutline(outlinePoints),
      })
    }
    return controlPoints
  }

  public get boundingBox(): BoundingBox {
    const points = this.points
    if (!points.length)
      return {
        min: [0, 0],
        max: [0, 0],
      }
    let minX = points[0].x
    let minY = points[0].y
    let maxX = points[0].x
    let maxY = points[0].y
    for (let i = 1; i < points.length; i += 1) {
      const po = points[i]
      if (po.x < minX) minX = po.x
      if (po.x > maxX) maxX = po.x
      if (po.y < minY) minY = po.y
      if (po.y > maxY) maxY = po.y
    }

    return {
      min: [minX, minY],
      max: [maxX, maxY],
    }
  }
}