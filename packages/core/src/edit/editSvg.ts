import { BoundingBox, getResizeEditObject } from './boundingBox'
import { EditPath } from './editPath'
import { PathSelector } from './pathSelector'
import { Point, toAbsolutePath, toRelativePath } from '../svg'
import type {
  SvgClass,
  PointObject,
  PathAttributes,
  SelectIndex,
  EditSvgObject,
  ResizeBoundingBoxBase,
  CommandClass,
  PathClass,
  PointClass,
} from '../types'

export class EditSvg {
  private pathSelector = new PathSelector()
  private translateBasePoint: PointObject | null = null
  private resizeBoundingBoxBase: ResizeBoundingBoxBase | null = null
  constructor(public svg: SvgClass) {}

  get selected() {
    return this.pathSelector.selected
  }

  public select(index: SelectIndex, multipleSelect?: boolean) {
    if (multipleSelect) {
      this.pathSelector.selectMerge(index)
      return
    }
    this.pathSelector.select(index)
  }

  public cancel() {
    this.pathSelector.clear()
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
      (point) => point.add(new Point(move.x, move.y))
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

    const { min, max } = this.boundingBox
    const { move, scale } = getResizeEditObject(
      this.resizeBoundingBoxBase,
      { min, max },
      po
    )

    this.exec((path) => {
      path.scaleX(scale.x)
      path.scaleY(scale.y)
      path.translate(move)

      return path
    })
  }

  /** @todo Delete points */
  public delete() {
    const svg = this.generateAbsolutePathSvg()

    this.pathSelector.pathsIndex.forEach((pathKey) => {
      const commandsIndex = this.pathSelector.getCommandsIndex(pathKey)

      const path = this.svg.paths.find((p) => p.key === pathKey)
      if (!commandsIndex) {
        this.pathSelector.unselect({ path: pathKey })
        if (path) svg.deletePath(path)
        return
      }

      commandsIndex.forEach((commandKey) => {
        this.pathSelector.unselect({ path: pathKey, command: +commandKey })

        /** @todo Added svg.updatePaths() */
        svg.paths.find((p) => p.key === pathKey)?.deleteCommand(+commandKey)
      })
    })

    this.svg.paths = svg.paths.map((p) => toRelativePath(p))
  }

  public preview(): EditSvg {
    const preview = new EditSvg(this.svg.clone())
    preview.pathSelector = this.pathSelector
    preview.translateBasePoint = this.translateBasePoint
    preview.resizeBoundingBoxBase = this.resizeBoundingBoxBase
    return preview
  }

  private get boundingBox() {
    const points: PointObject[] = this.pathSelector.pathsIndex.flatMap(
      (pathKey) => {
        const path = this.svg.paths.find((path) => path.key === pathKey)

        return path ? new EditPath(path.clone(), this.pathSelector).points : []
      }
    )

    return new BoundingBox(points).toJson()
  }

  public toJson(): EditSvgObject | null {
    if (!this.pathSelector.selected) return null

    const paths = this.pathSelector.pathsIndex.reduce(
      (acc: EditSvgObject['paths'], pathKey) => {
        const path = this.svg.paths.find((path) => path.key === pathKey)

        return path
          ? {
              ...acc,
              [path.key]: new EditPath(
                path.clone(),
                this.pathSelector
              ).toJson(),
            }
          : acc
      },
      {}
    )

    const {
      min: { x, y },
      size: { width, height },
      vertex,
    } = this.boundingBox

    return {
      index: this.pathSelector.toJson(),
      paths,
      boundingBox: {
        x,
        y,
        width,
        height,
        vertex,
        selected: this.pathSelector.selectedPathsOnly,
      },
    }
  }

  private generateAbsolutePathSvg() {
    const svg = this.svg.clone()
    svg.paths = svg.paths.map((p) => toAbsolutePath(p))
    return svg
  }

  private exec(
    pathExec: (path: PathClass) => PathClass,
    commandExec?: (command: CommandClass) => CommandClass,
    pointExec?: (point: PointClass) => PointClass
  ): void {
    const svg = this.generateAbsolutePathSvg()

    this.pathSelector.pathsIndex.forEach((pathKey) => {
      const pathIndex = svg.paths.findIndex((path) => path.key === pathKey)
      const commandsIndex = this.pathSelector.getCommandsIndex(pathKey)

      if (!svg.paths[pathIndex]) return

      if (!commandsIndex || !commandExec) {
        svg.paths[pathIndex] = pathExec(svg.paths[pathIndex])
        return
      }

      commandsIndex.forEach((commandKey) => {
        const pointsIndex = this.pathSelector.getPointsIndex(
          pathKey,
          commandKey
        )
        if (!pointsIndex || !pointExec) {
          svg.paths[pathIndex].commands[commandKey] = commandExec(
            svg.paths[pathIndex].commands[+commandKey]
          )
          return
        }

        pointsIndex.map((pointKey: number) => {
          svg.paths[pathIndex].commands[commandKey].points[pointKey] =
            pointExec(
              svg.paths[pathIndex].commands[commandKey].points[pointKey]
            )
        })
      })
    })

    this.svg.paths = svg.paths.map((p) => toRelativePath(p))
  }
}
