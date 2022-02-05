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

  get selected() {
    return this.pathSelector.selected
  }

  select(index: SelectIndex, multipleSelect?: boolean) {
    if (multipleSelect) {
      this.pathSelector.selectMerge(index)
      return
    }
    this.pathSelector.select(index)
  }

  cancel() {
    this.pathSelector.clear()
  }

  changeAttributes(attrs: PathAttributes) {
    this.exec((path) => path.updateAttributes(attrs))
  }

  translate(move: PointObject) {
    this.exec(
      (path) => path.translate(move),
      (command) => command.translate(move),
      (point) => point.add(move)
    )
  }

  scale(r: number) {
    this.exec(
      (path) => path.scale(r),
      (command) => command.scale(r),
      (point) => point.scale(r)
    )
  }

  scaleX(r: number) {
    this.exec(
      (path) => path.scaleX(r),
      (command) => command.scaleX(r),
      (point) => point.scaleX(r)
    )
  }

  scaleY(r: number) {
    this.exec(
      (path) => path.scaleY(r),
      (command) => command.scaleY(r),
      (point) => point.scaleY(r)
    )
  }

  resizeBoundingBox(type: FixedType, po: PointObject) {
    const { move, scale } = new BoundingBox(this.absolutePath).resizeParams(
      type,
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

  preview(): EditSvg {
    const preview = new EditSvg(this.svg.clone())
    preview.pathSelector = this.pathSelector
    return preview
  }

  private get absolutePath() {
    return this.pathSelector.pathsIndex.flatMap((pathKey) => {
      const path = this.svg.paths.find((path) => path.key === pathKey)

      return path
        ? new EditPath(path.clone(), this.pathSelector).absolutePath
        : []
    })
  }

  toJson(): EditSvgObject | null {
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
      width,
      height,
      vertex,
    } = new BoundingBox(this.absolutePath)

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

  private exec(
    pathExec: (path: PathClass) => PathClass,
    commandExec?: (command: CommandClass) => CommandClass,
    pointExec?: (point: PointClass) => PointClass
  ): void {
    this.pathSelector.pathsIndex.forEach((pathKey) => {
      const path = this.svg.getPath(pathKey)
      const commandsIndex = this.pathSelector.getCommandsIndex(pathKey)

      if (!path) return

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
