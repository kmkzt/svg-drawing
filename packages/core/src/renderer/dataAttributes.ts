import type { EditEventObject, ElementKey, VertexType } from '../types'

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
    [dataEditType]: 'path-anchor-point',
    [dataElementKey]: elementKey,
    [dataCommandIndex]: `${commandIndex}`,
    [dataPointIndex]: `${pointIndex}`,
  } as const)

export const dataBoundingBoxAttributes = {
  [dataEditType]: 'bounding-box',
} as const

export const dataBoundingBoxVertexAttributes = (vertexType: VertexType) =>
  ({
    [dataEditType]: 'bounding-box-vertex',
    [dataVertexType]: vertexType,
  } as const)

export const dataFrameAttributes = {
  [dataEditType]: 'frame',
} as const

export const getEditDataAttributes = (
  el: HTMLElement
): EditEventObject | null => {
  const editType = el.getAttribute(dataEditType)

  switch (editType) {
    case 'path': {
      const elementKey = el.getAttribute(dataElementKey)

      return elementKey
        ? {
            type: 'path',
            elementKey: elementKey,
          }
        : null
    }

    case 'path-anchor-point': {
      const elementKey = el.getAttribute(dataElementKey)
      const commandIndex = el.getAttribute(dataCommandIndex)
      const pointIndex = el.getAttribute(dataPointIndex)

      return elementKey && commandIndex !== null && pointIndex !== null
        ? {
            type: 'path-anchor-point',
            elementKey,
            commandIndex: +commandIndex,
            pointIndex: +pointIndex,
          }
        : null
    }

    case 'bounding-box': {
      return { type: 'bounding-box' }
    }

    case 'bounding-box-vertex': {
      const vertexType = el.getAttribute(dataVertexType)

      return vertexType
        ? {
            type: 'bounding-box-vertex',
            vertexType: vertexType as VertexType,
          }
        : null
    }

    case 'frame': {
      return { type: 'frame' }
    }

    default: {
      return null
    }
  }
}
