import { BoundingBox } from './boundingBox'
import { EditPath } from './editPath'
import { PathSelector } from './pathSelector'
import type {
  SvgClass,
  PointObject,
  PathAttributes,
  SelectIndex,
  EditSvgObject,
  CommandClass,
  PathClass,
  PointClass,
  FixedType,
} from '../types'

export class EditSvg {
  private pathSelector = new PathSelector()
  constructor(public svg: SvgClass) {}

  /** Return true when some path selected. */
  get selected() {
    return this.pathSelector.selected
  }

  private get paths(): PathClass[] {
    return this.pathSelector.pathsIndex.flatMap((pathKey) => {
      const path = this.svg.getPath(pathKey)

      return path ? path.clone() : []
    })
  }

  /** Select path index. */
  select(index: SelectIndex, multipleSelect?: boolean) {
    if (multipleSelect) {
      this.pathSelector.selectMerge(index)
      return
    }
    this.pathSelector.select(index)
  }

  /** Clear selected status. */
  cancel() {
    this.pathSelector.clear()
  }

  /** Change attributes of selected path. */
  changeAttributes(attrs: PathAttributes) {
    this.exec((path) => path.updateAttributes(attrs))
  }

  /** Translate position of selected path. */
  translate(move: PointObject) {
    this.exec(
      (path) => path.translate(move),
      (command) => command.translate(move),
      (point) => point.add(move)
    )
  }

  /** Scale the selected path. */
  scale(r: number) {
    this.exec(
      (path) => path.scale(r),
      (command) => command.scale(r),
      (point) => point.scale(r)
    )
  }

  /** Scale the selected path horizontally. */
  scaleX(r: number) {
    this.exec(
      (path) => path.scaleX(r),
      (command) => command.scaleX(r),
      (point) => point.scaleX(r)
    )
  }

  /** Scale the selected path vertically. */
  scaleY(r: number) {
    this.exec(
      (path) => path.scaleY(r),
      (command) => command.scaleY(r),
      (point) => point.scaleY(r)
    )
  }

  /** Resize based on the bounding box vertices */
  resizeBoundingBox(type: FixedType, po: PointObject) {
    const { move, scale } = new BoundingBox(this.paths).resizeParams(type, po)

    this.exec((path) => path.scaleX(scale.x).scaleY(scale.y).translate(move))
  }

  /**
   * Delete the selected path.
   *
   * @todo Implements to delete points.
   */
  delete() {
    this.pathSelector.pathsIndex.forEach((pathKey) => {
      const commandsIndex = this.pathSelector.getCommandsIndex(pathKey)

      const path = this.svg.getPath(pathKey)
      if (!path) return

      if (!commandsIndex) {
        this.pathSelector.unselect({ path: pathKey })
        this.svg.deletePath(path)
        return
      }

      commandsIndex.forEach((command) => {
        this.pathSelector.unselect({ path: pathKey, command })
        this.svg.updatePath(path.deleteCommand(command))
      })
    })
  }

  /** Clone an EditSvg class object for preview. */
  preview(): EditSvg {
    const preview = new EditSvg(this.svg.clone())
    preview.pathSelector = this.pathSelector
    return preview
  }

  /** Return data in json format. */
  toJson(): EditSvgObject | null {
    if (!this.pathSelector.selected) return null

    const paths = this.paths.map((path) =>
      new EditPath(path.clone(), this.pathSelector).toJson()
    )

    const {
      min: { x, y },
      width,
      height,
      vertex,
    } = new BoundingBox(this.paths)

    return {
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

  private exec(
    pathExec: (path: PathClass) => PathClass,
    commandExec?: (command: CommandClass) => CommandClass,
    pointExec?: (point: PointClass) => PointClass
  ): void {
    this.pathSelector.pathsIndex.forEach((pathKey) => {
      const path = this.svg.getPath(pathKey)
      if (!path) return

      const commandsIndex = this.pathSelector.getCommandsIndex(pathKey)
      if (!commandsIndex || !commandExec) {
        this.svg.updatePath(pathExec(path))
        return
      }

      commandsIndex.forEach((commandKey) => {
        const pointsIndex = this.pathSelector.getPointsIndex(
          pathKey,
          commandKey
        )
        if (!pointsIndex || !pointExec) {
          this.svg.updatePath(path.updateCommand(commandKey, commandExec))
          return
        }

        this.svg.updatePath(
          path.updateCommand(commandKey, (com) => {
            const command = com.clone()

            pointsIndex.forEach((pointKey: number) => {
              command.points[pointKey] = pointExec(command.points[pointKey])
            })

            return command
          })
        )
      })
    })
  }
}
