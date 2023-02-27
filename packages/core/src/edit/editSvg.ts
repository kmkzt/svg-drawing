import { BoundingBox } from './boundingBox'
import { EditCommand } from './editCommand'
import type {
  SvgClass,
  PointObject,
  PathAttributes,
  EditSvgObject,
  PathClass,
  VertexType,
} from '../types'
import type { Selector, SelectAnchorPointObject } from './selector'

type Transform = {
  path: (path: PathClass) => void
  command: (path: PathClass, index: { command: number }) => void
  anchorPoint: (
    path: PathClass,
    index: { command: number; point: number }
  ) => void
}

export class EditSvg {
  constructor(public svg: SvgClass, private selector: Selector) {}

  private get elements(): PathClass[] {
    return this.selector
      .toJson()
      .flatMap(
        ({ key }): PathClass | [] => this.svg.getElement(key)?.clone() ?? []
      )
  }

  /** Change attributes of selected path. */
  changeAttributes(attrs: PathAttributes) {
    this.exec({
      path: (path) => this.svg.updateElement(path.updateAttributes(attrs)),
    })
  }

  /** Translate position of selected path. */
  translate(move: PointObject) {
    const anchorPointTransform: Transform['anchorPoint'] = (path, index) =>
      this.svg.updateElement(
        path.updateCommand(index.command, (command) => {
          command.points[index.point] = command.points[index.point].add(move)
          return command
        })
      )

    this.exec({
      path: (path) => this.svg.updateElement(path.translate(move)),
      command: (path, index) => {
        const anchorPoints = new EditCommand(
          path,
          this.selector
        ).getAnchorPoints(index.command)

        if (!anchorPoints) {
          this.svg.updateElement(
            path.updateCommand(index.command, (command) =>
              command.translate(move)
            )
          )
          return
        }

        Object.values(anchorPoints).forEach((anchorPoint) => {
          if (!anchorPoint) return

          anchorPointTransform(path, anchorPoint.index)
        })
      },
      anchorPoint: anchorPointTransform,
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
      path: (path) => {
        this.svg.deleteElement(path)
      },
      command: (path, index) =>
        this.svg.updateElement(path.deleteCommand(index.command)),
      anchorPoint: (path, index) => {
        this.selector.select({
          type: 'path/command',
          key: path.key,
          index: { command: index.command },
        })
      },
    })
  }

  /** Return data in json format. */
  toJson(): EditSvgObject | null {
    if (!this.elements.length) return null

    return {
      elements: this.elements.map((element) => {
        const data = element.toJson()
        return {
          key: data.key,
          attributes: data.attributes,
          type: data.type,
          commands: new EditCommand(element.clone(), this.selector).toJson(),
        }
      }),
      boundingBox: new BoundingBox(
        this.elements,
        this.selector.isSelected({ type: 'bounding-box' })
      ).toJson(),
    }
  }

  private exec(transform: {
    path: Transform['path']
    command?: Transform['command']
    anchorPoint?: Transform['anchorPoint']
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
        case 'path/anchorPoint': {
          transform.anchorPoint?.(path, index)
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
