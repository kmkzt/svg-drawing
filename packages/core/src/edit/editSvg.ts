import { AnchorPoints } from './anchorPoint'
import { BoundingBox } from './boundingBox'
import { Selector } from './selector'
import type {
  SvgClass,
  PointObject,
  PathAttributes,
  SelectEventObject,
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
    const selectObjects = this.selector.toJson()
    return selectObjects.flatMap(({ key }): PathClass | [] => {
      const path = this.svg.getElement(key)

      return path ? path.clone() : []
    })
  }

  /** Select path index. */
  select(selectObject: SelectEventObject, combined?: boolean) {
    this.selector.select(selectObject, combined)
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
    this.selector.toJson().forEach((selectObject) => {
      this.selector.unselect(selectObject)
      const path = this.svg.getElement(selectObject.key)
      if (!path) return

      switch (selectObject.type) {
        case 'path': {
          if (path) this.svg.deleteElement(path)
          break
        }

        case 'path/command':
        case 'path/point': {
          this.svg.updateElement(path.deleteCommand(selectObject.index.command))
          break
        }
      }
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
      boundingBox: new BoundingBox(
        this.paths,
        this.selector.selectedBoundingBox
      ).toJson(),
    }
  }

  private exec(
    pathExec: (path: PathClass) => PathClass,
    commandExec?: (command: CommandClass) => CommandClass,
    pointExec?: (point: PointClass) => PointClass
  ): void {
    this.selector.toJson().map((selectObject: SelectEventObject) => {
      const path = this.svg.getElement(selectObject.key)
      if (!path) return

      switch (selectObject.type) {
        case 'path': {
          this.svg.updateElement(pathExec(path))
          return
        }
        case 'path/command': {
          if (!commandExec) return

          this.svg.updateElement(
            path.updateCommand(selectObject.index.command, commandExec)
          )
          return
        }
        case 'path/point': {
          if (!pointExec) return

          const { index } = selectObject

          this.svg.updateElement(
            path.updateCommand(index.command, (com) => {
              const command = com.clone()
              command.points[index.point] = pointExec(
                command.points[index.point]
              )
              return command
            })
          )
          return
        }
        default: {
          return
        }
      }
    })
  }
}
