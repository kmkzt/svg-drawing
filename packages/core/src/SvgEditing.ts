import { Editing } from './edit/editing'
import { EditSvg } from './edit/editSvg'
import type { SvgClass } from './types'

export class SvgEditing {
  /** @deprecated */
  public static init(svg: SvgClass) {
    return new Editing(new EditSvg(svg))
  }
}
