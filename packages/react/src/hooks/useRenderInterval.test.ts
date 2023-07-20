import { act, renderHook } from '@testing-library/react'
import { useRenderInterval } from './useRenderInterval'

describe('useRenderInterval', () => {
  it('will be processed at once if it is executed multiple times per second,', async () => {
    const { result } = renderHook(() => useRenderInterval(10))
    const count = 50
    const fns = [...Array(count)].map(() => jest.fn())

    await act(async () => {
      fns.forEach((fn) => result.current(fn))
      await new Promise((r) => setTimeout(r, 10))
    })

    fns.forEach((fn, i) => expect(fn).toBeCalledTimes(i === count - 1 ? 1 : 0))
  })
})
