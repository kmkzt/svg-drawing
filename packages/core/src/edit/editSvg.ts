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

  private get elements(): PathClass[] {
    return this.selector
      .toJson()
      .flatMap(
        ({ key }): PathClass | [] => this.svg.getElement(key)?.clone() ?? []
      )
  }

  /** Select path index. */
  select(event: SelectEventObject) {
    this.selector.select(event)
  }

  /** Clear selected status. */
  cancel() {
    this.selector.clear()
  }

  /** Change attributes of selected path. */
  changeAttributes(attrs: PathAttributes) {
    this.exec({
      path: (path) => this.svg.updateElement(path.updateAttributes(attrs)),
    })
  }

  /** Translate position of selected path. */
  translate(move: PointObject) {
    this.exec({
      path: (path) => this.svg.updateElement(path.translate(move)),
      command: (path, index) =>
        this.svg.updateElement(
          path.updateCommand(index.command, (command) =>
            command.translate(move)
          )
        ),
      point: (path, index) =>
        this.svg.updateElement(
          path.updateCommand(index.command, (command) => {
            command.points[index.point] = command.points[index.point].add(move)
            return command
          })
        ),
    })
  }

  /** Scale the selected path. */
  scale(r: number) {
    this.exec({ path: (path) => this.svg.updateElement(path.scale(r)) })
  }

  /** Scale the selected path horizontally. */
  scaleX(r: number) {
    this.exec({ path: (path) => this.svg.updateElement(path.scaleX(r)) })
  }

  /** Scale the selected path vertically. */
  scaleY(r: number) {
    this.exec({ path: (path) => this.svg.updateElement(path.scaleY(r)) })
  }

  /** Resize based on the bounding box vertices */
  resizeBoundingBox(type: VertexType, movePoint: PointObject) {
    const { move, scale } = new BoundingBox(this.elements).resizeParams(
      type,
      movePoint
    )

    this.exec({
      path: (path) => {
        this.svg.updateElement(
          path.scaleX(scale.x).scaleY(scale.y).translate(move)
        )
      },
    })
  }

  /**
   * Delete the selected path.
   *
   * @todo Implements to delete points.
   */
  delete() {
    this.exec({
      path: (path) => this.svg.deleteElement(path),
      command: (path, index) =>
        this.svg.updateElement(path.deleteCommand(index.command)),
      point: (path, index) =>
        this.svg.updateElement(path.deleteCommand(index.command)),
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
    if (!this.elements.length) return null

    return {
      elements: this.elements.map((path) => ({
        path: path.toJson(),
        anchorPoints: new AnchorPoints(path.clone(), this.selector).toJson(),
      })),
      boundingBox: new BoundingBox(
        this.elements,
        this.selector.isSelected({ type: 'bounding-box' })
      ).toJson(),
    }
  }

  private exec(transform: {
    path: (path: PathClass) => void
    command?: (path: PathClass, index: { command: number }) => void
    point?: (path: PathClass, index: { command: number; point: number }) => void
  }): void {
    const pathAnchorPointExec = (
      path: PathClass,
      { index, type }: SelectAnchorPointObject
    ) => {
      switch (type) {
        case 'path/command': {
          transform.command?.(path, index)
          return
        }
        case 'path/point': {
          transform.point?.(path, index)
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
            transform.path(element)
            break
          }

          selectObject.anchorPoints.forEach((anchorPointObject) =>
            pathAnchorPointExec(element, anchorPointObject)
          )
          break
        }
        default: {
          break
        }
      }
    })
  }
}
