import { BezierCurve, closeCommands, createLineCommands } from './convert'
import { Path, toRelativeCommands } from '../svg'
import type {
  CreateCommand,
  DrawFactory,
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

  createPath(): PathClass {
    return new Path({
      ...this.attrs,
      ...this.curveAttribute,
    })
  }

  /** @todo Refactor */
  get createCommand(): CreateCommand {
    const createCommand = this.opts.curve
      ? new BezierCurve().create
      : createLineCommands

    return (po) =>
      toRelativeCommands(
        this.opts.close ? closeCommands(createCommand(po)) : createCommand(po)
      )
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

  get curveAttribute() {
    return {
      strokeLinecap: this.opts.curve ? 'round' : 'mitter',
      strokeLinejoin: this.opts.curve ? 'round' : 'square',
    }
  }
}
