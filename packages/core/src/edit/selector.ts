import type { SelectObject, ElementKey } from '../types'

type SelectPoint =
  | {
      type: 'path-point'
      command: number
      point: number
    }
  | {
      type: 'path-command'
      command: number
    }

type SelectData = {
  type: 'path'
  key: ElementKey
  list: Array<SelectPoint>
}

const isMatchSelectCommand =
  ({ command }: { command: number }) =>
  (selectPoint: SelectPoint) =>
    selectPoint.type === 'path-command' && selectPoint.command === command

const isMatchSelectPoint =
  ({ point, command }: { point: number; command: number }) =>
  (selectPoint: SelectPoint) =>
    selectPoint.type === 'path-point' &&
    selectPoint.command === command &&
    selectPoint.point === point

export class Selector {
  private selectMap: Map<ElementKey, SelectData> = new Map()

  private get selecting(): SelectData[] {
    return [...this.selectMap.values()]
  }

  get selectedBoundingBox(): boolean {
    return (
      this.selected &&
      this.selecting.every((selectedData) => selectedData.list.length === 0)
    )
  }

  get selected(): boolean {
    return this.selecting.length > 0
  }

  isSelected(selectObject: SelectObject): boolean {
    const selectData = this.selectMap.get(selectObject.key)
    if (!selectData) return false

    switch (selectObject.type) {
      case 'path': {
        return true
      }

      case 'path-command': {
        return selectData.list.some(
          isMatchSelectCommand({ command: selectObject.index.command })
        )
      }
      case 'path-point': {
        return selectData.list.some(
          isMatchSelectPoint({
            command: selectObject.index.command,
            point: selectObject.index.point,
          })
        )
      }

      default: {
        return false
      }
    }
  }

  toJson(): SelectObject[] {
    return [...this.selectMap.values()].map(convertSelectObject).flat()
  }

  clear() {
    this.selectMap.clear()
  }

  private updateSelectPath(
    key: ElementKey,
    updateList?: (list: ReadonlyArray<SelectPoint>) => SelectPoint[]
  ): void {
    const list = updateList
      ? updateList(this.selectMap.get(key)?.list ?? [])
      : []

    this.selectMap.set(key, {
      type: 'path',
      key,
      list,
    })
  }

  /**
   * Currently only path indices can be combined.
   *
   * @todo Implement so that multiple commands and points can be selected.
   */
  select(
    selectObjects: SelectObject | ReadonlyArray<SelectObject>,
    combined?: boolean
  ) {
    if (!combined) {
      this.selectMap.clear()
    }

    ;[selectObjects].flat().forEach((selectObject) => {
      switch (selectObject.type) {
        case 'path-point': {
          this.updateSelectPath(selectObject.key, (list) => [
            ...list,
            {
              type: 'path-point',
              command: selectObject.index.command,
              point: selectObject.index.point,
            },
          ])
          break
        }
        case 'path-command': {
          this.updateSelectPath(selectObject.key, (list) => [
            ...list,
            {
              type: 'path-command',
              command: selectObject.index.command,
            },
          ])
          break
        }
        case 'path': {
          this.updateSelectPath(selectObject.key)
          break
        }
      }
    })
  }

  selectBoundingBox() {
    this.select(this.selecting.map(({ key }) => ({ type: 'path', key })))
  }

  unselect(selectObject: SelectObject) {
    const selectData = this.selectMap.get(selectObject.key)

    if (!selectData) return
    switch (selectObject.type) {
      case 'path-command': {
        const { command } = selectObject.index
        const ok = this.updateSelectPath(selectObject.key, (list) =>
          list.filter(
            (selectPoint: SelectPoint) =>
              !isMatchSelectCommand({ command })(selectPoint)
          )
        )
        break
      }
      case 'path-point': {
        const { command, point } = selectObject.index
        this.updateSelectPath(selectObject.key, (list) =>
          list.filter(
            (selectPoint: SelectPoint) =>
              !isMatchSelectPoint({ command, point })(selectPoint)
          )
        )
        break
      }
      default: {
        this.selectMap.delete(selectObject.key)
        break
      }
    }
  }
}

const convertSelectObjectFromSelectPoint =
  (key: ElementKey) =>
  (selectPoint: SelectPoint): SelectObject => {
    switch (selectPoint.type) {
      case 'path-command': {
        return {
          type: 'path-command',
          key,
          index: {
            command: selectPoint.command,
          },
        }
      }
      case 'path-point': {
        return {
          type: 'path-point',
          key: key,
          index: {
            command: selectPoint.command,
            point: selectPoint.point,
          },
        }
      }
    }
  }

const convertSelectObject = (selectData: SelectData): SelectObject[] => {
  switch (selectData?.type) {
    case 'path': {
      if (selectData.list.length === 0) {
        return [
          {
            type: 'path',
            key: selectData.key,
          },
        ]
      }
      return selectData.list.map(
        convertSelectObjectFromSelectPoint(selectData.key)
      )
    }

    default: {
      return []
    }
  }
}
