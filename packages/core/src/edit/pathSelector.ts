import type {
  SelectIndex,
  SelectPathIndex,
  SelectCommandIndex,
  SelectPointIndex,
  PathObject,
} from '../types'

type Selecting = Record<PathObject['key'], SelectingCommands>
type SelectingCommands = Record<number, SelectingPoints>
type SelectingPoints = Array<number>

const convertSelectingFromIndex = (index: SelectIndex): Selecting => ({
  [index.path]:
    typeof index.command === 'number'
      ? {
          [index.command]: typeof index.point === 'number' ? [index.point] : [],
        }
      : {},
})

const isSelectPathIndex = (index: SelectIndex): index is SelectPathIndex =>
  !!(
    index.path &&
    typeof index.command !== 'number' &&
    typeof index.point !== 'number'
  )

const isSelectCommandIndex = (
  index: SelectIndex
): index is SelectCommandIndex =>
  !!(
    index.path &&
    typeof index.command === 'number' &&
    typeof index.point !== 'number'
  )

const isSelectPointIndex = (index: SelectIndex): index is SelectPointIndex =>
  !!(
    index.path &&
    typeof index.command === 'number' &&
    typeof index.point === 'number'
  )

const isObjectEmpty = (obj: object): obj is Record<any, never> =>
  Object.keys(obj).length === 0

export class PathSelector {
  private selecting: Selecting = {}

  get selectedOnlyPaths(): boolean {
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
      ? selectingPoints
      : undefined
  }

  clear() {
    this.selecting = {}
  }

  /**
   * Currently only path indices can be combined.
   *
   * @todo Implement so that multiple commands and points can be selected.
   */
  select(selectIndexes: SelectIndex | SelectIndex[], combined?: boolean) {
    this.selecting = [selectIndexes].flat().reduce(
      (acc, index) => ({
        ...acc,
        ...convertSelectingFromIndex(index),
      }),
      combined ? this.selecting : {}
    )
  }

  unselect(index: SelectIndex) {
    if (!this.selecting) return

    const { [index.path]: unselectedPath, ...updateSelecting } = this.selecting

    if (!unselectedPath) return
    if (isSelectPathIndex(index)) {
      this.selecting = updateSelecting
      return
    }

    const { [index.command]: unselectedCommand, ...updateCommandSelecting } =
      unselectedPath

    if (!unselectedCommand) return
    if (isSelectCommandIndex(index)) {
      this.selecting = {
        ...this.selecting,
        [index.path]: updateCommandSelecting,
      }
      return
    }

    if (isSelectPointIndex(index)) {
      this.selecting = {
        ...this.selecting,
        [index.path]: {
          ...this.selecting[index.path],
          [index.command]: unselectedCommand.filter(
            (pointIndex) => pointIndex !== index.point
          ),
        },
      }
    }
  }
}
