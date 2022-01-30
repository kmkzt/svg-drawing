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

const isObjectEmpty = (obj: object): obj is Record<any, never> =>
  Object.keys(obj).length === 0

export class PathSelector {
  private selecting: Selecting = {}

  get selectedPathsOnly(): boolean {
    return (
      this.selected &&
      Object.keys(this.selecting).every(
        (key: string) =>
          this.selecting && Object.keys(this.selecting[key]).length === 0
      )
    )
  }

  get selected(): boolean {
    return !isObjectEmpty(this.selecting)
  }

  get pathsIndex(): string[] {
    return Object.keys(this.selecting)
  }

  getCommandsIndex(pathKey: string): number[] | undefined {
    const selectingCommands = this.selecting[pathKey]

    return selectingCommands && !isObjectEmpty(selectingCommands)
      ? Object.keys(selectingCommands).map(Number)
      : undefined
  }

  getPointsIndex(pathKey: string, commandKey: number): number[] | undefined {
    const selectingPoints = this.selecting[pathKey]?.[commandKey]

    return selectingPoints && !isObjectEmpty(selectingPoints)
      ? Object.keys(selectingPoints).map(Number)
      : undefined
  }

  clear() {
    this.selecting = {}
  }

  select(index: SelectIndex) {
    this.selecting = convertSelectingFromIndex(index)
  }

  /** @todo Currently only path index is supported. Changed to merge deeply. */
  selectMerge(index: SelectIndex) {
    this.selecting = {
      ...this.selecting,
      ...convertSelectingFromIndex(index),
    }
  }

  unselect(index: SelectIndex) {
    if (!this.selecting) return

    const { [index.path]: selectedPath, ...updateSelecting } = this.selecting

    if (!selectedPath) return
    if (isSelectPathIndex(index)) {
      this.selecting = updateSelecting
      return
    }

    const { [index.command]: selectedCommand, ...updateCommandSelecting } =
      selectedPath

    if (!selectedCommand) return
    if (isSelectCommandIndex(index)) {
      this.selecting = {
        ...updateSelecting,
        [index.path]: updateCommandSelecting,
      }
      return
    }

    const { [index.point]: selectedPoint, ...updatePointSelecting } =
      selectedCommand

    if (!selectedPoint) return
    if (isSelectPointIndex(index)) {
      this.selecting = {
        ...updateSelecting,
        [index.path]: {
          ...updateCommandSelecting,
          [index.command]: updatePointSelecting,
        },
      }
    }
  }

  toJson(): Selecting {
    return this.selecting
  }
}
