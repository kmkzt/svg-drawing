import { Command, Path, Point, Svg } from '../svg'
import type {
  PointObject,
  ControlPoint,
  BoundingBox,
  PathObject,
  Selecting,
  EditSvgObject,
  EditPathObject,
  ResizeBoundingBoxBase,
  SelectingCommands,
  SelectingPoints,
} from '../types'

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
  resizeBase: ResizeBoundingBoxBase,
  boundingBox: BoundingBox,
  translatePoint: PointObject
): { scale: PointObject; move: PointObject } => {
  const movePoint = {
    x: translatePoint.x - resizeBase.point.x,
    y: translatePoint.y - resizeBase.point.y,
  }

  const width = boundingBox.max.x - boundingBox.min.x
  const height = boundingBox.max.y - boundingBox.min.y

  switch (resizeBase.fixedType) {
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
  public selecting: Selecting | null = null
  public translateBasePoint: PointObject | null = null
  public resizeBoundingBoxBase: ResizeBoundingBoxBase | null = null
  constructor(public svg: Svg) {}

  public select(sel: Selecting | null) {
    this.selecting = sel
  }

  public setupTranslateBsePoint(base: PointObject | null) {
    this.translateBasePoint = base
  }

  public setupResizeBoundingBox(base: ResizeBoundingBoxBase | null) {
    this.resizeBoundingBoxBase = base
  }

  private exec(
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
    for (const pathKey in this.selecting) {
      const path = this.svg.paths[+pathKey]
      const selectingCommand = this.selecting[pathKey]

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

  public changeAttributes({ d, ...attrs }: PathObject) {
    this.exec((path) => {
      path.attrs = {
        ...path.attrs,
        ...attrs,
      }
      if (d) path.parseCommandString(d)
    })
  }

  public translate(po: PointObject) {
    const move: PointObject = {
      x: po.x - (this.translateBasePoint?.x ?? 0),
      y: po.y - (this.translateBasePoint?.y ?? 0),
    }

    this.exec(
      (path) => path.translate(move),
      (command) => command.translate(move),
      (point) => point.translate(new Point(move.x, move.y))
    )
  }

  public scale(r: number) {
    this.exec(
      (path) => path.scale(r),
      (command) => command.scale(r),
      (point) => point.scale(r)
    )
  }

  public scaleX(r: number) {
    this.exec(
      (path) => path.scaleX(r),
      (command) => command.scaleX(r),
      (point) => point.scaleX(r)
    )
  }

  public scaleY(r: number) {
    this.exec(
      (path) => path.scaleY(r),
      (command) => command.scaleY(r),
      (point) => point.scaleY(r)
    )
  }

  public resizeBoundingBox(po: PointObject) {
    if (!this.resizeBoundingBoxBase) return

    const { move, scale } = getResizeEditObject(
      this.resizeBoundingBoxBase,
      this.boundingBox,
      po
    )

    this.exec((path) => {
      path.scaleX(scale.x)
      path.scaleY(scale.y)
      path.translate(move)
    })
  }

  /** @todo Delete points */
  public delete() {
    this.exec(
      (_p, index) => this.svg.deletePath(index.path),
      (_c, index) => {
        const path = this.svg.paths[+index.path]
        path.deleteCommand(index.command)
      }
    )
  }

  public preview(): EditSvg {
    const preview = new EditSvg(this.svg.clone())
    preview.select(this.selecting)
    preview.setupTranslateBsePoint(this.translateBasePoint)
    preview.setupResizeBoundingBox(this.resizeBoundingBoxBase)
    return preview
  }

  public get boundingBox() {
    const listX: number[] = []
    const listY: number[] = []

    this.exec((path) => {
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

  private selectedBoundingBox() {
    if (!this.selecting || Object.keys(this.selecting).length < 1) return false

    return Object.keys(this.selecting).every(
      (pKey: string) =>
        this.selecting && Object.keys(this.selecting[+pKey]).length === 0
    )
  }

  public toJson(): EditSvgObject | null {
    if (!this.selecting) return null

    const listX: number[] = []
    const listY: number[] = []

    const paths: EditSvgObject['paths'] = {}

    this.exec((path, index) => {
      const editPath = new EditPath(path.clone(), this.selecting?.[index.path])
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
      index: this.selecting,
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
        selected: this.selectedBoundingBox(),
      },
    }
  }
}

/** @todo Rename PathEdit ? */
export class EditPath {
  constructor(public path: Path, public selecting?: SelectingCommands) {}

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

      const points = [
        curr.cl?.toJson(),
        curr.cr?.toJson(),
        curr.point?.toJson(),
      ].filter(Boolean) as PointObject[]

      const selectingPoints: SelectingPoints | null =
        this.selecting?.[i] ?? null

      controlPoints.push({
        points: points.map((value, i) => ({
          value,
          selected: selectingPoints?.includes(i * 2) ?? false,
        })),
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
