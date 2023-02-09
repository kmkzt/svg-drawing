import type {
  EditEventObject,
  EditEventType,
  ElementKey,
  VertexType,
} from '../types'

const dataEditType = 'data-edit-type'
const dataElementKey = 'data-element-key'
const dataCommandIndex = 'data-command-index'
const dataPointIndex = 'data-point-index'
const dataVertexType = 'data-vertex-type'

export const dataPathAttributes = (elementKey: ElementKey) =>
  ({
    [dataEditType]: 'path',
    [dataElementKey]: elementKey,
  } as const)

export const dataPathAnchorPointAttributes = ({
  elementKey,
  commandIndex,
  pointIndex,
}: {
  elementKey: ElementKey
  pointIndex: number
  commandIndex: number
}) =>
  ({
    [dataEditType]: 'path/point',
    [dataElementKey]: elementKey,
    [dataCommandIndex]: `${commandIndex}`,
    [dataPointIndex]: `${pointIndex}`,
  } as const)

export const dataBoundingBoxAttributes = {
  [dataEditType]: 'bounding-box',
} as const

export const dataBoundingBoxVertexAttributes = (vertexType: VertexType) =>
  ({
    [dataEditType]: 'bounding-box/vertex',
    [dataVertexType]: vertexType,
  } as const)

export const dataFrameAttributes = {
  [dataEditType]: 'frame',
} as const

export const getEditEvent = (
  el: HTMLElement,
  multiple = false
): EditEventObject | null => {
  const type = el.getAttribute(dataEditType) as EditEventType

  switch (type) {
    case 'path': {
      const key = el.getAttribute(dataElementKey)

      return key
        ? {
            type,
            key,
            multiple,
          }
        : null
    }

    case 'path/point': {
      const key = el.getAttribute(dataElementKey)
      const commandIndex = el.getAttribute(dataCommandIndex)
      const pointIndex = el.getAttribute(dataPointIndex)

      return key && commandIndex !== null && pointIndex !== null
        ? {
            type,
            key,
            index: {
              command: +commandIndex,
              point: +pointIndex,
            },
            multiple,
          }
        : null
    }

    case 'bounding-box': {
      return { type }
    }
    case 'bounding-box/vertex': {
      const vertexType = el.getAttribute(dataVertexType) as VertexType

      return vertexType
        ? {
            type,
            vertexType,
          }
        : null
    }

    case 'frame': {
      return { type }
    }

    default: {
      return null
    }
  }
}
