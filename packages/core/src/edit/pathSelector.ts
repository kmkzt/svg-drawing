import type { SelectingCommands, SelectingPoints } from '..'
import type {
  SelectIndex,
  SelectPathIndex,
  SelectCommandIndex,
  SelectPointIndex,
  Selecting,
} from '../types'

const convertSelectingFromIndex = (index: SelectIndex): Selecting => ({
  [index.path]:
    typeof index.command === 'number'
      ? {
          [index.command]: typeof index.point === 'number' ? [index.point] : [],
        }
      : {},
})

const isSelectPathIndex = (index: SelectIndex): index is SelectPathIndex =>
  !!(index.path && !index.command && !index.point)

const isSelectCommandIndex = (
  index: SelectIndex
): index is SelectCommandIndex =>
  !!(index.path && index.command && !index.point)

const isSelectPointIndex = (index: SelectIndex): index is SelectPointIndex =>
  !!(index.path && index.command && index.point)

export class PathSelector {
  private _selecting: Selecting = {}

  get selecting() {
    return this._selecting
  }

  get selectedPathsOnly(): boolean {
    return !!(
      this._selecting &&
      Object.keys(this._selecting).length > 0 &&
      Object.keys(this._selecting).every(
        (key: string) =>
          this._selecting && Object.keys(this._selecting[key]).length === 0
      )
    )
  }

  get notSelected(): boolean {
    return Object.keys(this._selecting).length === 0
  }

  getCommandsIndex(pathKey: string): SelectingCommands | undefined {
    const selectingCommand = this._selecting[pathKey]

    return selectingCommand && Object.keys(selectingCommand).length === 0
      ? selectingCommand
      : undefined
  }

  getPointsIndex(
    pathKey: string,
    commandKey: number
  ): SelectingPoints | undefined {
    const selectingPoints = this._selecting[pathKey]?.[commandKey]
    if (!selectingPoints) return

    return selectingPoints && Object.keys(selectingPoints).length === 0
      ? selectingPoints
      : undefined
  }

  clear() {
    this._selecting = {}
  }

  select(index: SelectIndex, multipleSelect?: boolean) {
    this._selecting = convertSelectingFromIndex(index)
  }

  /** @todo Currently only path index is supported. Changed to merge deeply. */
  selectMerge(index: SelectIndex) {
    this._selecting = {
      ...this._selecting,
      ...convertSelectingFromIndex(index),
    }
  }

  unselect(index: SelectIndex) {
    if (!this._selecting) return

    const { [index.path]: selectedPath, ...updateSelecting } = this._selecting

    if (!selectedPath) return
    if (isSelectPathIndex(index)) {
      this._selecting = updateSelecting
      return
    }

    const { [index.command]: selectedCommand, ...updateCommandSelecting } =
      selectedPath

    if (!selectedCommand) return
    if (isSelectCommandIndex(index)) {
      this._selecting = {
        ...updateSelecting,
        [index.path]: updateCommandSelecting,
      }
      return
    }

    const { [index.point]: selectedPoint, ...updatePointSelecting } =
      selectedCommand

    if (!selectedPoint) return
    if (isSelectPointIndex(index)) {
      this._selecting = {
        ...updateSelecting,
        [index.path]: {
          ...updateCommandSelecting,
          [index.command]: updatePointSelecting,
        },
      }
    }
  }
}
