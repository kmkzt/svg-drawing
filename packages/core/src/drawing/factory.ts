import { BezierCurve, closeCommands, createLineCommands } from './convert'
import { Path } from '../svg/path'
import type {
  DrawFactory,
  ElementClass,
  EventPoint,
  PathAttributes,
  PathClass,
} from '../types'

export class BasicDrawFactory implements DrawFactory {
  constructor(
    private attrs: PathAttributes,
    private opts: { curve?: boolean; close?: boolean } = {}
  ) {
    this.opts = {
      curve: true,
      close: false,
      ...opts,
    }
  }

  createElement(): PathClass {
    return new Path({
      ...this.attrs,
      ...this.curveAttribute,
    })
  }

  updateElement(
    element: ElementClass,
    points: ReadonlyArray<EventPoint>
  ): ElementClass {
    const createCommands = this.opts.curve
      ? new BezierCurve().create
      : createLineCommands

    const commands = this.opts.close
      ? closeCommands(createCommands(points))
      : createCommands(points)
    element.setCommands(commands)

    return element
  }

  setPathAttributes(attrs: PathAttributes) {
    this.attrs = attrs
  }

  updatePathAttributes(attrs: PathAttributes) {
    this.attrs = {
      ...this.attrs,
      ...attrs,
    }
  }

  changeCurve(curve: boolean) {
    this.opts = {
      ...this.opts,
      curve,
    }
  }

  changeClose(curve: boolean) {
    this.opts = {
      ...this.opts,
      curve,
    }
  }

  get curveAttribute(): PathAttributes {
    return {
      strokeLinecap: this.opts.curve ? 'round' : 'square',
      strokeLinejoin: this.opts.curve ? 'round' : 'miter',
    }
  }
}
