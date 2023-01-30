import { AnchorPoints } from './anchorPoint'
import { BoundingBox } from './boundingBox'
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
  VertexType,
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
      const path = this.svg.getElement(pathKey)

      return path ? path.clone() : []
    })
  }

  /** Select path index. */
  select(index: SelectIndex | SelectIndex[], combined?: boolean) {
    this.pathSelector.select(index, combined)
  }

  /** Select boundingBox */
  selectBoundingBox() {
    this.pathSelector.selectBoundingBox()
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
    this.exec((path) => path.scale(r))
  }

  /** Scale the selected path horizontally. */
  scaleX(r: number) {
    this.exec((path) => path.scaleX(r))
  }

  /** Scale the selected path vertically. */
  scaleY(r: number) {
    this.exec((path) => path.scaleY(r))
  }

  /** Resize based on the bounding box vertices */
  resizeBoundingBox(type: VertexType, movePoint: PointObject) {
    const { move, scale } = new BoundingBox(this.paths).resizeParams(
      type,
      movePoint
    )

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

      const path = this.svg.getElement(pathKey)
      if (!path) return

      if (!commandsIndex) {
        this.pathSelector.unselect({ path: pathKey })
        this.svg.deleteElement(path)
        return
      }

      commandsIndex.forEach((command) => {
        this.pathSelector.unselect({ path: pathKey, command })
        this.svg.updateElement(path.deleteCommand(command))
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

    return {
      elements: this.paths.map((path) => ({
        path: path.toJson(),
        anchorPoints: new AnchorPoints(
          path.clone(),
          this.pathSelector
        ).toJson(),
      })),
      boundingBox: new BoundingBox(this.paths).toJson(),
      selectedOnlyElements: this.pathSelector.selectedOnlyPaths,
    }
  }

  private exec(
    pathExec: (path: PathClass) => PathClass,
    commandExec?: (command: CommandClass) => CommandClass,
    pointExec?: (point: PointClass) => PointClass
  ): void {
    this.pathSelector.pathsIndex.forEach((pathKey) => {
      const path = this.svg.getElement(pathKey)
      if (!path) return

      const commandsIndex = this.pathSelector.getCommandsIndex(pathKey)
      if (!commandsIndex || !commandExec) {
        this.svg.updateElement(pathExec(path))
        return
      }

      commandsIndex.forEach((commandKey) => {
        const pointsIndex = this.pathSelector.getPointsIndex(
          pathKey,
          commandKey
        )
        if (!pointsIndex || !pointExec) {
          this.svg.updateElement(path.updateCommand(commandKey, commandExec))
          return
        }

        this.svg.updateElement(
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
