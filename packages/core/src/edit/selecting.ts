import type {
  SelectIndex,
  SelectPathIndex,
  SelectCommandIndex,
  SelectPointIndex,
  Selecting,
} from '../types'

export const convertSelectingFromIndex = (index: SelectIndex): Selecting => ({
  [index.path]:
    typeof index.command === 'number'
      ? {
          [index.command]: typeof index.point === 'number' ? [index.point] : [],
        }
      : {},
})

export const isSelectPathIndex = (
  index: SelectIndex
): index is SelectPathIndex => !!(index.path && !index.command && !index.point)

export const isSelectCommandIndex = (
  index: SelectIndex
): index is SelectCommandIndex =>
  !!(index.path && index.command && !index.point)

export const isSelectPointIndex = (
  index: SelectIndex
): index is SelectPointIndex => !!(index.path && index.command && index.point)
