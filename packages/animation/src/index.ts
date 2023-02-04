import { Point } from '@svg-drawing/core'
import type {
  PathClass,
  PathAttributes,
  FrameAnimation,
} from '@svg-drawing/core'

export class ShakeFrame implements FrameAnimation {
  public readonly loops = 10
  constructor(private range: number = 5) {
    this.animation = this.animation.bind(this)
  }

  private randomNumber() {
    return Math.random() * this.range - this.range / 2
  }

  public animation(paths: PathClass[]) {
    for (let i = 0; i < paths.length; i += 1) {
      paths[i].setCommands(
        paths[i].absoluteCommands.map((c) => {
          const update = c.clone()

          update.points = c.points.map((po) =>
            po.add(new Point(this.randomNumber(), this.randomNumber()))
          )
          return update
        })
      )
    }
    return paths
  }
}

export class AttributeFrame implements FrameAnimation {
  constructor(private attributesList: PathAttributes[]) {
    this.animation = this.animation.bind(this)
  }

  get loops(): number {
    return this.attributesList.length
  }

  animation(paths: PathClass[], key: number) {
    const attr = this.attributesList[key]
    if (!attr) return paths

    for (let i = 0; i < paths.length; i += 1) {
      paths[i].updateAttributes(attr)
    }
    return paths
  }
}

export class DrawFrame implements FrameAnimation {
  constructor(private paths: ReadonlyArray<PathClass>) {
    this.animation = this.animation.bind(this)
  }

  get loops(): number {
    return this.paths.reduce((acc, p) => acc + p.absoluteCommands.length, 0)
  }

  animation(paths: PathClass[], key: number) {
    let count = key
    const update = []
    for (let i = 0; i < paths.length; i += 1) {
      const path = paths[i]
      const vertexLength = path.absoluteCommands.length

      path.setCommands(path.absoluteCommands.slice(0, count))
      update.push(path)

      count -= vertexLength
      if (count < 0) break
    }
    return update
  }
}
