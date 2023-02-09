import type { SelectEventObject, ElementKey } from '../types'

export type SelectObject = {
  type: 'path'
  key: ElementKey
  anchorPoints: ReadonlyArray<SelectAnchorPointObject>
}

export type SelectAnchorPointObject =
  | {
      type: 'path/point'
      index: {
        command: number
        point: number
      }
    }
  | {
      type: 'path/command'
      index: {
        command: number
      }
    }

const isMatchSelectCommand =
  ({ command }: { command: number }) =>
  ({ type, index }: SelectAnchorPointObject) =>
    type === 'path/command' && index.command === command

const isMatchSelectPoint =
  ({ point, command }: { point: number; command: number }) =>
  ({ type, index }: SelectAnchorPointObject) =>
    type === 'path/point' && index.command === command && index.point === point

export class Selector {
  private selectMap: Map<ElementKey, SelectObject> = new Map()

  private get selecting(): SelectObject[] {
    return [...this.selectMap.values()]
  }

  get selected(): boolean {
    return this.selecting.length > 0
  }

  isSelected(selectObject: SelectEventObject): boolean {
    switch (selectObject.type) {
      case 'path': {
        return this.selectMap.has(selectObject.key)
      }

      case 'path/command': {
        const selectData = this.selectMap.get(selectObject.key)
        if (!selectData) return false

        return selectData.anchorPoints.some(
          isMatchSelectCommand({ command: selectObject.index.command })
        )
      }
      case 'path/point': {
        const selectData = this.selectMap.get(selectObject.key)
        if (!selectData) return false

        return selectData.anchorPoints.some(
          isMatchSelectPoint({
            command: selectObject.index.command,
            point: selectObject.index.point,
          })
        )
      }

      case 'bounding-box/vertex':
      case 'bounding-box': {
        return (
          this.selected &&
          this.selecting.every(
            (selectedData) => selectedData.anchorPoints.length === 0
          )
        )
      }

      default: {
        return false
      }
    }
  }

  toJson(): SelectObject[] {
    return [...this.selectMap.values()]
  }

  clear() {
    this.selectMap.clear()
  }

  private selectPath(
    selectObject: Extract<
      SelectEventObject,
      { type: 'path' | 'path/command' | 'path/point' }
    >
  ): void {
    if (!selectObject.multiple) {
      this.selectMap.clear()
    }

    const anchorPoints =
      selectObject.type === 'path'
        ? []
        : [
            ...(this.selectMap.get(selectObject.key)?.anchorPoints ?? []),
            {
              type: selectObject.type,
              index: selectObject.index,
            } as SelectAnchorPointObject,
          ]

    this.selectMap.set(selectObject.key, {
      type: 'path',
      key: selectObject.key,
      anchorPoints,
    })
  }

  /**
   * Currently only path indices can be combined.
   *
   * @todo Implement so that multiple commands and points can be selected.
   */
  select(selectObject: SelectEventObject) {
    switch (selectObject.type) {
      case 'path':
      case 'path/command':
      case 'path/point': {
        this.selectPath(selectObject)
        break
      }
      case 'bounding-box':
      case 'bounding-box/vertex': {
        this.selecting.forEach(({ key }) =>
          this.selectMap.set(key, { type: 'path', key, anchorPoints: [] })
        )
        break
      }
      case 'frame': {
        this.clear()
      }
    }
  }
}
