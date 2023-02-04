import { AnchorPoints } from './anchorPoint'
import { BoundingBox } from './boundingBox'
import { Selector } from './selector'
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
  private selector = new Selector()
  constructor(public svg: SvgClass) {}

  /** Return true when some path selected. */
  get selected() {
    return this.selector.selected
  }

  private get paths(): PathClass[] {
    return this.selector.elementsIndex.flatMap((pathKey) => {
      const path = this.svg.getElement(pathKey)

      return path ? path.clone() : []
    })
  }

  /** Select path index. */
  select(index: SelectIndex | SelectIndex[], combined?: boolean) {
    this.selector.select(index, combined)
  }

  /** Select boundingBox */
  selectBoundingBox() {
    this.selector.selectBoundingBox()
  }

  /** Clear selected status. */
  cancel() {
    this.selector.clear()
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
    this.selector.elementsIndex.forEach((pathKey) => {
      const commandsIndex = this.selector.getCommandsIndex(pathKey)

      const path = this.svg.getElement(pathKey)
      if (!path) return

      if (!commandsIndex) {
        this.selector.unselect({ path: pathKey })
        this.svg.deleteElement(path)
        return
      }

      commandsIndex.forEach((command) => {
        this.selector.unselect({ path: pathKey, command })
        this.svg.updateElement(path.deleteCommand(command))
      })
    })
  }

  /** Clone an EditSvg class object for preview. */
  preview(): EditSvg {
    const preview = new EditSvg(this.svg.clone())
    preview.selector = this.selector
    return preview
  }

  /** Return data in json format. */
  toJson(): EditSvgObject | null {
    if (!this.selector.selected) return null

    return {
      elements: this.paths.map((path) => ({
        path: path.toJson(),
        anchorPoints: new AnchorPoints(path.clone(), this.selector).toJson(),
      })),
      boundingBox: new BoundingBox(this.paths).toJson(),
      selectedOnlyElements: this.selector.selectedOnlyPaths,
    }
  }

  private exec(
    pathExec: (path: PathClass) => PathClass,
    commandExec?: (command: CommandClass) => CommandClass,
    pointExec?: (point: PointClass) => PointClass
  ): void {
    this.selector.elementsIndex.forEach((pathKey) => {
      const path = this.svg.getElement(pathKey)
      if (!path) return

      const commandsIndex = this.selector.getCommandsIndex(pathKey)
      if (!commandsIndex || !commandExec) {
        this.svg.updateElement(pathExec(path))
        return
      }

      commandsIndex.forEach((commandKey) => {
        const pointsIndex = this.selector.getPointsIndex(pathKey, commandKey)
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
