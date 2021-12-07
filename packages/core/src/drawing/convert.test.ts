import { BezierCurve, toRelativePath } from './convert'
import { parseCommandString } from '../parser'
import { Path } from '../svg'

describe('BezierCurve', () => {
  it('genCommand', () => {
    const bezierCurve = new BezierCurve()
    expect(
      bezierCurve
        .genCommand(
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 0 }
        )
        .toString()
    ).toBe('C1.4 1.2 1.6 1.2 2 1')
  })
})

describe('toRelativeCommand', () => {
  it('Success', () => {
    const path = new Path()
    path.addCommand(
      parseCommandString('M0 0 M100 100 L200 200 C300 300 400 300 500 200 z')
    )

    expect(toRelativePath(path).getCommandString()).toBe(
      'M0 0 m100 100 l100 100 c100 100 200 100 300 0 z'
    )
  })
})
