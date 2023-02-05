import type { SelectObject, ElementKey } from '../types'

type SelectData = {
  type: 'path'
  key: ElementKey
  anchorPoints: ReadonlyArray<SelectAnchorPoint>
}

type SelectAnchorPoint =
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
  ({ type, index }: SelectAnchorPoint) =>
    type === 'path/command' && index.command === command

const isMatchSelectPoint =
  ({ point, command }: { point: number; command: number }) =>
  ({ type, index }: SelectAnchorPoint) =>
    type === 'path/point' && index.command === command && index.point === point

export class Selector {
  private selectMap: Map<ElementKey, SelectData> = new Map()

  private get selecting(): SelectData[] {
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

  isSelected(selectObject: SelectObject): boolean {
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
    return [...this.selectMap.values()].map(convertSelectObject).flat()
  }

  clear() {
    this.selectMap.clear()
  }

  private selectPath(
    selectObject: Extract<
      SelectObject,
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
            } as SelectAnchorPoint,
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
  select(
    selectObjects: SelectObject | ReadonlyArray<SelectObject>,
    combined?: boolean
  ) {
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
    this.select(this.selecting.map(({ key }) => ({ type: 'path', key })))
  }

  private unselectPath(
    selectObject: Extract<
      SelectObject,
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
          (selectPoint: SelectAnchorPoint) =>
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
          (selectPoint: SelectAnchorPoint) =>
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

  unselect(selectObject: SelectObject) {
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

const convertSelectObjectFromSelectPoint =
  (key: ElementKey) =>
  (selectPoint: SelectAnchorPoint): SelectObject => ({
    key,
    ...selectPoint,
  })

const convertSelectObject = (selectData: SelectData): SelectObject[] => {
  switch (selectData?.type) {
    case 'path': {
      if (selectData.anchorPoints.length === 0) {
        return [
          {
            type: 'path',
            key: selectData.key,
          },
        ]
      }
      return selectData.anchorPoints.map(
        convertSelectObjectFromSelectPoint(selectData.key)
      )
    }

    default: {
      return []
    }
  }
}
