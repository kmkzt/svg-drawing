import type { PointObject, FixedType, ResizeBoundingBoxBase } from '../types'

type BoundingBoxJson = {
  min: PointObject
  max: PointObject
  size: {
    width: number
    height: number
  }
  vertex: Record<FixedType, PointObject>
}

const fallbackPointObject: PointObject = { x: 0, y: 0 }

export const getResizeEditObject = (
  resizeBase: ResizeBoundingBoxBase,
  boundingBox: { min: PointObject; max: PointObject },
  translatePoint: PointObject
): { scale: PointObject; move: PointObject } => {
  const movePoint = {
    x: translatePoint.x - resizeBase.point.x,
    y: translatePoint.y - resizeBase.point.y,
  }

  const width = boundingBox.max.x - boundingBox.min.x
  const height = boundingBox.max.y - boundingBox.min.y

  switch (resizeBase.fixedType) {
    case 'LeftTop': {
      const scale = {
        x: (width - movePoint.x) / width,
        y: (height - movePoint.y) / height,
      }
      const move = {
        x: -(boundingBox.max.x * scale.x - boundingBox.max.x),
        y: -(boundingBox.max.y * scale.y - boundingBox.max.y),
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
          x: -(boundingBox.min.x * scale.x - boundingBox.min.x),
          y: -(boundingBox.max.y * scale.y - boundingBox.max.y),
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
          x: -(boundingBox.max.x * scale.x - boundingBox.max.x),
          y: -(boundingBox.min.y * scale.y - boundingBox.min.y),
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
          x: -(boundingBox.min.x * scale.x - boundingBox.min.x),
          y: -(boundingBox.min.y * scale.y - boundingBox.min.y),
        },
      }
    }
  }
}

export class BoundingBox {
  constructor(private points: PointObject[]) {}

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
  private get max(): PointObject {
    if (this.points.length === 0) return fallbackPointObject

    return {
      x: Math.max(...this.pointsX),
      y: Math.max(...this.pointsY),
    }
  }

  toJson(): BoundingBoxJson {
    return {
      min: this.min,
      max: this.max,
      size: { width: this.max.x - this.min.x, height: this.max.y - this.min.y },
      vertex: {
        ['LeftTop']: { x: this.min.x, y: this.min.y },
        ['RightTop']: { x: this.max.x, y: this.min.y },
        ['RightBottom']: { x: this.max.x, y: this.max.y },
        ['LeftBottom']: { x: this.min.x, y: this.max.y },
      },
    }
  }
}
