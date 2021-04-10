import type { RefObject, MutableRefObject } from 'react'
import type {
  PathObject,
  PointObject,
  SvgObject,
} from '@svg-drawing/core/lib/types'
import type { Svg } from '@svg-drawing/core/lib/svg'
import type { DrawHandler, ResizeHandler } from '@svg-drawing/core/lib/handler'
import type { CommandsConverter } from '@svg-drawing/core/lib/convert'
export type UseDrawing<T extends HTMLElement> = [
  RefObject<T>,
  SvgObject,
  UseDrawingMethods
]
// eslint-disable-next-line @typescript-eslint/ban-types
export type UseDrawingMethods = {
  svg: MutableRefObject<Svg>
  drawHandler: MutableRefObject<DrawHandler | null>
  resizeHandler: MutableRefObject<ResizeHandler | null>
  on: () => void
  off: () => void
  update: () => void
  clear: () => void
  undo: () => void
  setDrawHandler: (handler: typeof DrawHandler) => void
}
export type DrawingOptions = {
  pathOptions: PathObject
  commandsConverter?: CommandsConverter
  drawHandler?: typeof DrawHandler
}
export type EditPathIndex = {
  path?: number
  command?: number
  value?: number
}

export type ArgUpdatePath = {
  index: Required<EditPathIndex>
  point: PointObject
}
export type SelectPathHandler = (arg: EditPathIndex) => void
export type UpdatePathHandler = (arg: ArgUpdatePath) => void
export type EditSvgEventHandler = {
  editing?: EditPathIndex
  onSelectPath: SelectPathHandler
  onUpdatePath: UpdatePathHandler
}
export type EditCommandIndex = Omit<EditPathIndex, 'path'>
export type ArgUpdateCommand = {
  index: Required<EditCommandIndex>
  point: PointObject
}
export type SelectCommandHandler = (arg: EditCommandIndex) => void
export type UpdateCommandHandler = (arg: ArgUpdateCommand) => void
export type EditPathEventHandler = {
  editing?: EditCommandIndex
  onSelectCommand: SelectCommandHandler
  onUpdateCommand: UpdateCommandHandler
}
