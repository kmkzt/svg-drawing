import { Command, Path, Point, Svg } from './svg'
import type {
  PointObject,
  ControlPoint,
  BoundingBox,
  PathObject,
  Selecting,
  EditSvgObject,
  FixedPositionType,
  EditPathObject,
} from './types'

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

const fallbackBoundingBox: BoundingBox = {
  min: [0, 0],
  max: [0, 0],
}

const getResizeEditObject = (
  type: FixedPositionType,
  boundingBox: BoundingBox,
  movePoint: PointObject
): { scale: PointObject; move: PointObject } => {
  const width = boundingBox.max[0] - boundingBox.min[0]
  const height = boundingBox.max[1] - boundingBox.min[1]

  switch (type) {
    case 'LeftTop': {
      const scale = {
        x: (width - movePoint.x) / width,
        y: (height - movePoint.y) / height,
      }
      const move = {
        x: -(boundingBox.max[0] * scale.x - boundingBox.max[0]),
        y: -(boundingBox.max[1] * scale.y - boundingBox.max[1]),
      }
      return { scale, move }
    }
    case 'RightTop': {
      const scale = {
        x: (width + movePoint.x) / width,
        y: (height - movePoint.y) / height,
      }
      return {
        scale,
        move: {
          x: -(boundingBox.min[0] * scale.x - boundingBox.min[0]),
          y: -(boundingBox.max[1] * scale.y - boundingBox.max[1]),
        },
      }
    }
    case 'LeftBottom': {
      const scale = {
        x: (width - movePoint.x) / width,
        y: (height + movePoint.y) / height,
      }

      return {
        scale,
        move: {
          x: -(boundingBox.max[0] * scale.x - boundingBox.max[0]),
          y: -(boundingBox.min[1] * scale.y - boundingBox.min[1]),
        },
      }
    }
    case 'RightBottom': {
      const scale = {
        x: (width + movePoint.x) / width,
        y: (height + movePoint.y) / height,
      }
      return {
        scale,
        move: {
          x: -(boundingBox.min[0] * scale.x - boundingBox.min[0]),
          y: -(boundingBox.min[1] * scale.y - boundingBox.min[1]),
        },
      }
    }
  }
}

/** @todo Rename SvgEditing or Editing or SvgEdit ? */
export class EditSvg {
  constructor(public svg: Svg) {}

  private exec(
    selecting: Selecting,
    pathExec: (path: Path, i: { path: number }) => void,
    commandExec?: (
      command: Command,
      i: { path: number; command: number }
    ) => void,
    pointExec?: (
      point: Point,
      i: { path: number; command: number; point: number }
    ) => void
  ): void {
    for (const pathKey in selecting) {
      const path = this.svg.paths[+pathKey]
      const selectingCommand = selecting[pathKey]

      if (Object.keys(selectingCommand).length === 0 || !commandExec) {
        pathExec(path, { path: +pathKey })
        continue
      }

      for (const commandKey in selectingCommand) {
        const command = path.commands[+commandKey]
        const selectingPoint = selectingCommand[+commandKey]
        if (Object.keys(selectingPoint).length === 0 || !pointExec) {
          commandExec(command, { path: +pathKey, command: +commandKey })
          continue
        }

        selectingPoint.map((pointKey: number) => {
          const po = new Point(
            command.value[pointKey],
            command.value[pointKey + 1]
          )
          pointExec(po, {
            path: +pathKey,
            command: +commandKey,
            point: +pointKey,
          })
          command.value[pointKey] = po.x
          command.value[pointKey + 1] = po.y
        })
      }
    }
  }

  public changeAttributes({ d, ...attrs }: PathObject, selecting: Selecting) {
    this.exec(selecting, (path) => {
      path.attrs = {
        ...path.attrs,
        ...attrs,
      }
      if (d) path.parseCommandString(d)
    })
  }

  public translate(po: PointObject, selecting: Selecting) {
    this.exec(
      selecting,
      (path) => path.translate(po),
      (command) => command.translate(po),
      (point) => point.translate(new Point(po.x, po.y))
    )
  }

  public scale(r: number, selecting: Selecting) {
    this.exec(
      selecting,
      (path) => path.scale(r),
      (command) => command.scale(r),
      (point) => point.scale(r)
    )
  }

  public scaleX(r: number, selecting: Selecting) {
    this.exec(
      selecting,
      (path) => path.scaleX(r),
      (command) => command.scaleX(r),
      (point) => point.scaleX(r)
    )
  }

  public scaleY(r: number, selecting: Selecting) {
    this.exec(
      selecting,
      (path) => path.scaleY(r),
      (command) => command.scaleY(r),
      (point) => point.scaleY(r)
    )
  }

  public resizeFixedPosition(
    { type, move: argMove }: { type: FixedPositionType; move: PointObject },
    selecting: Selecting
  ) {
    const { boundingBox } = this.toJson(selecting)
    const { move, scale } = getResizeEditObject(type, boundingBox, argMove)

    this.exec(selecting, (path) => {
      path.scaleX(scale.x)
      path.scaleY(scale.y)
      path.translate(move)
    })
  }

  /** @todo Delete points */
  public delete(selecting: Selecting) {
    this.exec(
      selecting,
      (_p, index) => this.svg.deletePath(index.path),
      (_c, index) => {
        const path = this.svg.paths[+index.path]
        path.deleteCommand(index.command)
      }
    )
  }

  public preview(): EditSvg {
    return new EditSvg(this.svg.clone())
  }

  public toJson(selecting: Selecting): EditSvgObject {
    const listX: number[] = []
    const listY: number[] = []

    const paths: EditSvgObject['paths'] = {}

    this.exec(selecting, (path, index) => {
      const editPath = new EditPath(path.clone())
      paths[index.path] = editPath.toJson()

      const {
        boundingBox: {
          min: [cMinX, cMinY],
          max: [cMaxX, cMaxY],
        },
      } = editPath
      listX.push(cMinX, cMaxX)
      listY.push(cMinY, cMaxY)
    })

    const boundingBox: BoundingBox =
      listX.length !== 0 && listY.length !== 0
        ? {
            min: [Math.min(...listX), Math.min(...listY)],
            max: [Math.max(...listX), Math.max(...listY)],
          }
        : fallbackBoundingBox
    return {
      index: selecting,
      paths,
      boundingBox,
    }
  }
}

/** @todo Rename PathEdit ? */
export class EditPath {
  constructor(public path: Path) {}

  /** @todo Compatible relative point */
  public get points(): Point[] {
    return this.path.commands.reduce(
      (p: Point[], com) => (com.point ? [...p, com.point] : p),
      []
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
    if (points.length === 0) return fallbackBoundingBox
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

  public toJson(): EditPathObject {
    return {
      d: this.path.getCommandString(),
      boundingBox: this.boundingBox,
      controlPoints: this.controlPoints,
    }
  }
}
