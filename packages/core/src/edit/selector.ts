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

  get selectedBoundingBox(): boolean {
    return (
      this.selected &&
      this.selecting.every(
        (selectedData) => selectedData.anchorPoints.length === 0
      )
    )
  }

  get selected(): boolean {
    return this.selecting.length > 0
  }

  isSelected(selectObject: SelectEventObject): boolean {
    const selectData = this.selectMap.get(selectObject.key)
    if (!selectData) return false

    switch (selectObject.type) {
      case 'path': {
        return true
      }

      case 'path/command': {
        return selectData.anchorPoints.some(
          isMatchSelectCommand({ command: selectObject.index.command })
        )
      }
      case 'path/point': {
        return selectData.anchorPoints.some(
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
    const selectData = this.selectMap.get(selectObject.key)
    const anchorPoint = selectData?.anchorPoints ?? []

    const anchorPoints = (() => {
      switch (selectObject.type) {
        case 'path': {
          return []
        }
        case 'path/point':
        case 'path/command': {
          return [
            ...anchorPoint,
            {
              type: selectObject.type,
              index: selectObject.index,
            } as SelectAnchorPointObject,
          ]
        }
      }
    })()

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
  select(selectObjects: SelectEventObject, combined?: boolean) {
    if (!combined) {
      this.selectMap.clear()
    }

    ;[selectObjects].flat().forEach((selectObject) => {
      switch (selectObject.type) {
        case 'path':
        case 'path/command':
        case 'path/point': {
          this.selectPath(selectObject)
          break
        }
      }
    })
  }

  selectBoundingBox() {
    this.selecting.forEach(({ key }) =>
      this.selectMap.set(key, { type: 'path', key, anchorPoints: [] })
    )
  }

  private unselectPath(
    selectObject: Extract<
      SelectEventObject,
      { type: 'path' | 'path/command' | 'path/point' }
    >
  ) {
    switch (selectObject.type) {
      case 'path': {
        this.selectMap.delete(selectObject.key)
        break
      }
      case 'path/command': {
        const selectData = this.selectMap.get(selectObject.key)
        if (!selectData) return

        const { command } = selectObject.index

        const anchorPoints = selectData.anchorPoints.filter(
          (selectPoint: SelectAnchorPointObject) =>
            !isMatchSelectCommand({ command })(selectPoint)
        )

        this.selectMap.set(selectObject.key, {
          type: 'path',
          key: selectObject.key,
          anchorPoints,
        })
        break
      }
      case 'path/point': {
        const selectData = this.selectMap.get(selectObject.key)
        if (!selectData) return

        const { command, point } = selectObject.index
        const anchorPoints = selectData.anchorPoints.filter(
          (selectPoint: SelectAnchorPointObject) =>
            !isMatchSelectPoint({ command, point })(selectPoint)
        )

        this.selectMap.set(selectObject.key, {
          type: 'path',
          key: selectObject.key,
          anchorPoints,
        })
        break
      }
    }
  }

  unselect(selectObject: SelectEventObject) {
    const selectData = this.selectMap.get(selectObject.key)
    if (!selectData) return

    switch (selectObject.type) {
      case 'path':
      case 'path/command':
      case 'path/point': {
        this.unselectPath(selectObject)
        break
      }
    }
  }
}
