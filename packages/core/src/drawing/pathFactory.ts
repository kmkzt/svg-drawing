import { BezierCurve, closeCommands, createLineCommands } from './convert'
import { Path } from '../svg'
import type { CreateCommand, PathFactory, PathObject } from '../types'

export class BasicPathFactory implements PathFactory {
  constructor(
    private attrs: PathObject,
    private opts: { curve?: boolean; close?: boolean } = {}
  ) {
    this.opts = {
      curve: true,
      close: false,
      ...opts,
    }
  }

  create(): Path {
    return new Path({
      ...this.attrs,
      ...this.curveAttribute,
    })
  }

  get createCommand(): CreateCommand {
    const create = this.opts.curve
      ? new BezierCurve().create
      : createLineCommands
    return (po) => (this.opts.close ? closeCommands(create(po)) : create(po))
  }

  setPathAttributes(attrs: PathObject) {
    this.attrs = attrs
  }

  updatePathAttributes(attrs: PathObject) {
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
