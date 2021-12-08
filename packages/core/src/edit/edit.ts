import { calculatePoint } from '../curve'
import { Point, isCurveCommand, toAbsolutePath, toRelativePath } from '../svg'
import type { Path, Svg } from '../svg'
import type {
  PointObject,
  EditVertex,
  BoundingBox,
  PathAttributes,
  Selecting,
  EditSvgObject,
  EditPathObject,
  ResizeBoundingBoxBase,
  SelectingCommands,
  SelectingPoints,
  Command,
  SelectCommandIndex,
  SelectPathIndex,
  SelectPointIndex,
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
  private selecting: Selecting | null = null
  private translateBasePoint: PointObject | null = null
  private resizeBoundingBoxBase: ResizeBoundingBoxBase | null = null
  constructor(public svg: Svg) {}

  public select(sel: Selecting, multipleSelect?: boolean) {
    this.selecting = multipleSelect ? { ...this.selecting, ...sel } : sel
  }

  public cancel() {
    this.selecting = null
  }

  public setupTranslateBsePoint(base: PointObject) {
    this.translateBasePoint = base
  }

  public resetTranslateBsePoint() {
    this.translateBasePoint = null
  }

  public setupResizeBoundingBox(base: ResizeBoundingBoxBase) {
    this.resizeBoundingBoxBase = base
  }

  public resetResizeBoundingBox() {
    this.resizeBoundingBoxBase = null
  }

  public changeAttributes(attrs: PathAttributes) {
    this.exec((path) => path.updateAttributes(attrs))
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
      (p, { svg }) => svg.deletePath(p),
      (_c, { svg, index }) => {
        svg.paths
          .find((path) => path.key === index.path)
          ?.deleteCommand(index.command)
      }
    )
  }

  public preview(): EditSvg {
    const preview = new EditSvg(this.svg.clone())
    preview.selecting = this.selecting
    preview.translateBasePoint = this.translateBasePoint
    preview.resizeBoundingBoxBase = this.resizeBoundingBoxBase
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

  public toJson(): EditSvgObject | null {
    if (!this.selecting) return null

    const listX: number[] = []
    const listY: number[] = []

    const paths: EditSvgObject['paths'] = {}

    this.exec((path) => {
      const editPath = new EditPath(
        path.clone(),
        this.selecting?.[path.key]
      ).toJson()

      const {
        min: { x: cMinX, y: cMinY },
        max: { x: cMaxX, y: cMaxY },
      } = editPath.boundingBox
      listX.push(cMinX, cMaxX)
      listY.push(cMinY, cMaxY)

      paths[path.key] = editPath
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

  private selectedBoundingBox(): boolean {
    return !!(
      this.selecting &&
      Object.keys(this.selecting).length > 0 &&
      Object.keys(this.selecting).every(
        (key: string) =>
          this.selecting && Object.keys(this.selecting[key]).length === 0
      )
    )
  }

  private generateAbsolutePathSvg(): Svg {
    const svg = this.svg.clone()
    svg.paths = svg.paths.map((p) => toAbsolutePath(p))
    return svg
  }

  private exec(
    pathExec: (path: Path, ctx: { svg: Svg; index: SelectPathIndex }) => void,
    commandExec?: (
      command: Command,
      ctx: { svg: Svg; index: SelectCommandIndex }
    ) => void,
    pointExec?: (
      point: Point,
      ctx: {
        svg: Svg
        index: SelectPointIndex
      }
    ) => void
  ): void {
    const svg = this.generateAbsolutePathSvg()

    for (const pathKey in this.selecting) {
      const path = svg.paths.find((path) => path.key === pathKey)
      const selectingCommand = this.selecting[pathKey]

      if (!path) continue

      if (Object.keys(selectingCommand).length === 0 || !commandExec) {
        pathExec(path, { svg, index: { path: pathKey } })
        continue
      }

      for (const commandKey in selectingCommand) {
        const command = path.commands[+commandKey]
        const selectingPoint = selectingCommand[+commandKey]
        if (Object.keys(selectingPoint).length === 0 || !pointExec) {
          commandExec(command, {
            svg,
            index: { path: pathKey, command: +commandKey },
          })
          continue
        }

        selectingPoint.map((pointKey: number) => {
          pointExec(command.points[pointKey], {
            svg,
            index: { path: pathKey, command: +commandKey, point: +pointKey },
          })
        })
      }
    }

    this.svg.paths = svg.paths.map((p) => toRelativePath(p))
  }
}

/** @todo Rename PathEdit ? */
export class EditPath {
  constructor(public path: Path, public selecting?: SelectingCommands) {}

  private get absolutePath() {
    return toAbsolutePath(this.path)
  }

  /** @todo Compatible for Quadratic and shortcut curve */
  private get points(): PointObject[] {
    const points: PointObject[] = []
    let prev: PointObject | undefined = undefined

    for (const command of this.absolutePath.commands) {
      if (!command.point) {
        prev = undefined
        continue
      }

      const addPoints: PointObject[] = isCurveCommand(command)
        ? calculatePoint([
            prev || (command.points[0].toJson() as PointObject),
            ...(command.points.map((p) => p.toJson()) as [
              PointObject,
              PointObject,
              PointObject
            ]),
          ])
        : [command.point]

      points.push(...addPoints)

      prev = command.point?.toJson()
    }

    return points
  }

  public get vertex(): EditVertex[] {
    const vertex: EditVertex[] = []
    const commands = this.absolutePath.commands
    for (let c = 0; c < commands.length; c += 1) {
      const curr = commands[c]
      const next = commands[c + 1]

      const outlinePoints: PointObject[] = [
        curr.points[1]?.toJson(),
        curr.points[2]?.toJson(),
        next?.points[0]?.toJson(),
      ].filter((p): p is PointObject => !!p)

      const selectingPoints: SelectingPoints | null =
        this.selecting?.[c] ?? null

      vertex.push({
        points: curr.points.map((point, pIndex) => ({
          index: {
            path: this.path.key,
            command: c,
            point: pIndex,
          },
          value: point.toJson(),
          selected: selectingPoints?.includes(pIndex) ?? false,
        })),
        d: genOutline(outlinePoints),
      })
    }

    return vertex
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
      key: this.path.key,
      d: this.path.getCommandString(),
      boundingBox: this.boundingBox,
      vertex: this.vertex,
    }
  }
}
