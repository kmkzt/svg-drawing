import { getEventPoint } from './getEventPoint'

describe('getEventPoint', () => {
  it('Convert EventPoint from MouseEvent', () => {
    const ev = {
      clientX: 1,
      clientY: 2,
    } as MouseEvent

    expect(getEventPoint(ev)).toEqual({ x: 1, y: 2, pressure: undefined })
  })

  it('Convert EventPoint from TouchEvent', () => {
    const ev = {
      touches: [{ clientX: 1, clientY: 2, force: 3 }],
      changedTouches: [],
    } as any as TouchEvent

    expect(getEventPoint(ev)).toStrictEqual({ x: 1, y: 2, pressure: 3 })
  })

  it('Convert EventPoint from PointerEvent', () => {
    const ev = {
      clientX: 1,
      clientY: 2,
      pressure: 3,
    } as any as PointerEvent

    expect(getEventPoint(ev)).toStrictEqual({ x: 1, y: 2, pressure: 3 })
  })

  it('Convert EventPoint from TouchEvent with offset', () => {
    const ev = {
      touches: [{ clientX: 1, clientY: 2, force: 3 }],
      changedTouches: [],
    } as any as TouchEvent

    expect(getEventPoint(ev, { x: 1, y: 2 })).toStrictEqual({
      x: 0,
      y: 0,
      pressure: 3,
    })
  })

  it('Convert EventPoint from PointerEvent with offset', () => {
    const ev = {
      touches: [{ clientX: 1, clientY: 2, force: 3 }],
      changedTouches: [],
    } as any as TouchEvent

    expect(getEventPoint(ev, { x: 1, y: 2 })).toStrictEqual({
      x: 0,
      y: 0,
      pressure: 3,
    })
  })
})
