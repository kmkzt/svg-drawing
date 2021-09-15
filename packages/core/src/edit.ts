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
  min: { x: 0, y: 0 },
  max: { x: 0, y: 0 },
}

const getResizeEditObject = (
  fixedPosition: FixedPositionType,
  boundingBox: BoundingBox,
  movePoint: PointObject
): { scale: PointObject; move: PointObject } => {
  const width = boundingBox.max.x - boundingBox.min.x
  const height = boundingBox.max.y - boundingBox.min.y

  switch (fixedPosition) {
    case 'LeftTop': {
      const scale = {
        x: (width - movePoint.x) / width,
        y: (height - movePoint.y) / height,
      }
      const move = {
        x: -(boundingBox.max.x * scale.x - boundingBox.max.x),
        y: -(boundingBox.max.y * scale.y - boundingBox.max.y),
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
          x: -(boundingBox.min.x * scale.x - boundingBox.min.x),
          y: -(boundingBox.max.y * scale.y - boundingBox.max.y),
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
          x: -(boundingBox.max.x * scale.x - boundingBox.max.x),
          y: -(boundingBox.min.y * scale.y - boundingBox.min.y),
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
          x: -(boundingBox.min.x * scale.x - boundingBox.min.x),
          y: -(boundingBox.min.y * scale.y - boundingBox.min.y),
        },
      }
    }
  }
}

/** @todo Rename SvgEditing or Editing or SvgEdit ? */
export class EditSvg {
  public translateBasePoint: PointObject | null = null
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

  public setupTranslateBsePoint(base: PointObject | null) {
    this.translateBasePoint = base
  }

  public translate(po: PointObject, selecting: Selecting) {
    const move: PointObject = {
      x: po.x - (this.translateBasePoint?.x ?? 0),
      y: po.y - (this.translateBasePoint?.y ?? 0),
    }

    this.exec(
      selecting,
      (path) => path.translate(move),
      (command) => command.translate(move),
      (point) => point.translate(new Point(move.x, move.y))
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

  public resizeBoundingBox(
    {
      fixedPosition,
      move: argMove,
    }: { fixedPosition: FixedPositionType; move: PointObject },
    selecting: Selecting
  ) {
    const { move, scale } = getResizeEditObject(
      fixedPosition,
      this.boundingBox(selecting),
      argMove
    )

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
    const preview = new EditSvg(this.svg.clone())
    preview.setupTranslateBsePoint(this.translateBasePoint)
    return preview
  }

  public boundingBox(selecting: Selecting) {
    const listX: number[] = []
    const listY: number[] = []

    this.exec(selecting, (path) => {
      const editPath = new EditPath(path.clone())

      const {
        boundingBox: {
          min: { x: cMinX, y: cMinY },
          max: { x: cMaxX, y: cMaxY },
        },
      } = editPath
      listX.push(cMinX, cMaxX)
      listY.push(cMinY, cMaxY)
    })

    return listX.length !== 0 && listY.length !== 0
      ? {
          min: { x: Math.min(...listX), y: Math.min(...listY) },
          max: { x: Math.max(...listX), y: Math.max(...listY) },
        }
      : fallbackBoundingBox
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
          min: { x: cMinX, y: cMinY },
          max: { x: cMaxX, y: cMaxY },
        },
      } = editPath
      listX.push(cMinX, cMaxX)
      listY.push(cMinY, cMaxY)
    })

    const { min, max }: BoundingBox =
      listX.length !== 0 && listY.length !== 0
        ? {
            min: { x: Math.min(...listX), y: Math.min(...listY) },
            max: { x: Math.max(...listX), y: Math.max(...listY) },
          }
        : fallbackBoundingBox
    return {
      index: selecting,
      paths,
      boundingBox: {
        x: min.x,
        y: min.y,
        width: max.x - min.x,
        height: max.y - min.y,
        vertex: {
          ['LeftTop']: { x: min.x, y: min.y },
          ['RightTop']: { x: max.x, y: min.y },
          ['RightBottom']: { x: max.x, y: max.y },
          ['LeftBottom']: { x: min.x, y: max.y },
        },
      },
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
      min: { x: minX, y: minY },
      max: { x: maxX, y: maxY },
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
