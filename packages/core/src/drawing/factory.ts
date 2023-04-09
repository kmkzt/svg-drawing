import { BezierCurve, closeCommands, createLineCommands } from './convert'
import { Path } from '../svg/path'
import type {
  DrawFactory,
  ElementClass,
  ElementKey,
  EventPoint,
  PathAttributes,
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

  /** @todo Separate modules */
  private createCommands(eventPoints: ReadonlyArray<EventPoint>) {
    const createCommands = this.opts.curve
      ? new BezierCurve().create
      : createLineCommands

    return this.opts.close
      ? closeCommands(createCommands(eventPoints))
      : createCommands(eventPoints)
  }

  createElement(params?: {
    elementKey: ElementKey
    eventPoints: ReadonlyArray<EventPoint>
  }): ElementClass {
    return new Path(
      {
        ...this.attrs,
        ...this.curveAttribute,
      },
      params?.elementKey
    ).setCommands(this.createCommands(params?.eventPoints ?? []))
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
