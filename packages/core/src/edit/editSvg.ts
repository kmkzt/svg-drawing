import { AnchorPoints } from './anchorPoint'
import { BoundingBox } from './boundingBox'
import { Selector } from './selector'
import type {
  SvgClass,
  PointObject,
  PathAttributes,
  SelectEventObject,
  EditSvgObject,
  PathClass,
  VertexType,
} from '../types'
import type { SelectAnchorPointObject } from './selector'

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
      (path) => this.svg.updateElement(path.translate(move)),
      (path, index) =>
        this.svg.updateElement(
          path.updateCommand(index.command, (command) =>
            command.translate(move)
          )
        ),
      (path, index) =>
        this.svg.updateElement(
          path.updateCommand(index.command, (command) => {
            command.points[index.point] = command.points[index.point].add(move)
            return command
          })
        )
    )
  }

  /** Scale the selected path. */
  scale(r: number) {
    this.exec((path) => this.svg.updateElement(path.scale(r)))
  }

  /** Scale the selected path horizontally. */
  scaleX(r: number) {
    this.exec((path) => this.svg.updateElement(path.scaleX(r)))
  }

  /** Scale the selected path vertically. */
  scaleY(r: number) {
    this.exec((path) => this.svg.updateElement(path.scaleY(r)))
  }

  /** Resize based on the bounding box vertices */
  resizeBoundingBox(type: VertexType, movePoint: PointObject) {
    const { move, scale } = new BoundingBox(this.paths).resizeParams(
      type,
      movePoint
    )

    this.exec((path) => {
      this.svg.updateElement(
        path.scaleX(scale.x).scaleY(scale.y).translate(move)
      )
    })
  }

  /**
   * Delete the selected path.
   *
   * @todo Implements to delete points.
   */
  delete() {
    this.exec(
      (path) => this.svg.deleteElement(path),
      (path, index) =>
        this.svg.updateElement(path.deleteCommand(index.command)),
      (path, index) => this.svg.updateElement(path.deleteCommand(index.command))
    )
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
    pathExec: (path: PathClass) => void,
    commandExec?: (path: PathClass, index: { command: number }) => void,
    pointExec?: (
      path: PathClass,
      index: { command: number; point: number }
    ) => void
  ): void {
    const pathAnchorPointExec = (
      path: PathClass,
      { index, type }: SelectAnchorPointObject
    ) => {
      switch (type) {
        case 'path/command': {
          if (!commandExec) return
          commandExec(path, index)
          return
        }
        case 'path/point': {
          if (!pointExec) return

          pointExec(path, index)
          return
        }
      }
    }

    this.selector.toJson().map((selectObject) => {
      const element = this.svg.getElement(selectObject.key)
      if (!element) return

      switch (selectObject.type) {
        case 'path': {
          if (selectObject.anchorPoints.length === 0) {
            pathExec(element)
            return
          }

          selectObject.anchorPoints.forEach((anchorPointObject) =>
            pathAnchorPointExec(element, anchorPointObject)
          )
          return
        }
        default: {
          break
        }
      }
    })
  }
}
