import { segmentPointsFromCommand } from './segment'
import type {
  PointObject,
  VertexType,
  PathClass,
  BoundingBoxObject,
  Vertex,
} from '../types'

const fallbackPointObject: PointObject = { x: 0, y: 0 }

export class BoundingBox {
  constructor(private paths: PathClass[]) {}

  public toJson(): BoundingBoxObject {
    return {
      pathKeys: this.paths.map((p) => p.key),
      position: this.position,
      size: this.size,
      vertexes: this.vertexes,
    }
  }

  public resizeParams(
    vertexType: VertexType,
    movePoint: PointObject
  ): { scale: PointObject; move: PointObject } {
    const { width, height } = this.size

    switch (vertexType) {
      case 'LeftTop': {
        const scale = {
          x: (width - movePoint.x) / width,
          y: (height - movePoint.y) / height,
        }
        const move = {
          x: -(this.max.x * scale.x - this.max.x),
          y: -(this.max.y * scale.y - this.max.y),
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
            x: -(this.min.x * scale.x - this.min.x),
            y: -(this.max.y * scale.y - this.max.y),
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
            x: -(this.max.x * scale.x - this.max.x),
            y: -(this.min.y * scale.y - this.min.y),
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
            x: -(this.min.x * scale.x - this.min.x),
            y: -(this.min.y * scale.y - this.min.y),
          },
        }
      }
    }
  }

  private get max(): PointObject {
    if (this.points.length === 0) return fallbackPointObject

    return {
      x: Math.max(...this.pointsX),
      y: Math.max(...this.pointsY),
    }
  }

  private get position(): { x: number; y: number } {
    return {
      x: this.min.x,
      y: this.min.y,
    }
  }

  private get size(): { width: number; height: number } {
    return {
      width: this.max.x - this.min.x,
      height: this.max.y - this.min.y,
    }
  }

  private get vertexes(): Vertex[] {
    return [
      { type: 'LeftTop', point: { x: this.min.x, y: this.min.y } },
      { type: 'RightTop', point: { x: this.max.x, y: this.min.y } },
      { type: 'RightBottom', point: { x: this.max.x, y: this.max.y } },
      { type: 'LeftBottom', point: { x: this.min.x, y: this.max.y } },
    ]
  }

  private get points(): PointObject[] {
    return this.paths.flatMap((path) => {
      let prev: PointObject | undefined = undefined

      return path.absoluteCommands.flatMap((command) => {
        const pts: PointObject[] = segmentPointsFromCommand(command, {
          base: prev,
        })

        prev = command.point ? command.point.toJson() : undefined

        return pts
      })
    })
  }

  private get pointsX(): number[] {
    return this.points.map((point) => point.x)
  }

  private get pointsY(): number[] {
    return this.points.map((point) => point.y)
  }

  private get min(): PointObject {
    if (this.points.length === 0) return fallbackPointObject

    return {
      x: Math.min(...this.pointsX),
      y: Math.min(...this.pointsY),
    }
  }
}
