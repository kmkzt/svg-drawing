import { EditCommand } from './editCommand'
import { Selector } from './selector'
import { createCommand } from '../svg/command'
import { Path } from '../svg/path'
import type { AnchorPoint, EditCommandObject } from '../types'

describe('EditCommand', () => {
  describe('toJson', () => {
    it('Return empty array when path is not selected', () => {
      const path = new Path()
      const selector = new Selector()
      const editCommand = new EditCommand(path, selector)

      expect(editCommand.toJson()).toEqual([])
    })

    it('Return EditCommandObject when path is selected.', () => {
      const path = new Path({}, 'edit_path_key')
      path
        .addCommand(createCommand({ type: 'M', values: [0, 0] }))
        .addCommand(createCommand({ type: 'C', values: [0, 0, 1, 1, 2, 2] }))

      const selector = new Selector()
      selector.select({ type: 'path', key: 'edit_path_key' })

      const result: EditCommandObject[] = [
        {
          anchorPoints: [],
          index: 0,
          outline: undefined,
          selected: false,
          value: {
            x: 0,
            y: 0,
          },
        },
        {
          anchorPoints: [
            {
              index: {
                command: 1,
                point: 1,
              },
              selected: false,
              value: {
                x: 1,
                y: 1,
              },
            },
          ],
          index: 1,
          outline: 'M 1 1L 2 2',
          selected: false,
          value: {
            x: 2,
            y: 2,
          },
        },
      ]

      expect(new EditCommand(path, selector).toJson()).toStrictEqual(result)
    })
  })
  describe('getAnchorPoints', () => {
    it('Return undefined when anchor point is not found.', () => {
      const path = new Path()
      const selector = new Selector()
      const editCommand = new EditCommand(path, selector)
      const result = editCommand.getAnchorPoints(0)
      expect(result).toBeUndefined()
    })

    it('Return object when anchor point is found.', () => {
      const path = new Path({}, 'edit_path_key')
      path
        .addCommand(createCommand({ type: 'M', values: [0, 0] }))
        .addCommand(createCommand({ type: 'C', values: [0, 0, 1, 1, 2, 2] }))

      const selector = new Selector()
      selector.select({ type: 'path', key: 'edit_path_key' })

      const result: {
        prev: AnchorPoint
        point: AnchorPoint
        next?: AnchorPoint
      } = {
        prev: {
          index: { command: 1, point: 1 },
          value: { x: 1, y: 1 },
          selected: false,
        },
        point: {
          index: { command: 1, point: 2 },
          value: { x: 2, y: 2 },
          selected: false,
        },
        next: undefined,
      }

      expect(new EditCommand(path, selector).getAnchorPoints(1)).toStrictEqual(
        result
      )
    })
  })
})
