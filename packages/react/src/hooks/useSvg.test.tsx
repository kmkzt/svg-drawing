import { Svg } from '@svg-drawing/core'
import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useEffect, useState } from 'react'
import { useSvg } from './useSvg'
import type { SvgClass, RenderParams } from '@svg-drawing/core'

describe('useSvg', () => {
  it('Return svg instance', () => {
    const width = 100
    const height = 100
    const { result } = renderHook(() => useSvg({ width, height }))
    expect(result.current.svg).toBeInstanceOf(Svg)
    expect(result.current.svg.width).toBe(width)
    expect(result.current.svg.height).toBe(height)
  })

  // TODO: Fix test
  // eslint-disable-next-line
  it.skip('Return getInitialState', () => {
    const { result } = renderHook(() => useSvg({ width: 100, height: 100 }))

    const expected: RenderParams = {
      svg: {
        width: 100,
        height: 100,
        background: undefined,
        elements: [],
      },
      edit: undefined,
      animation: undefined,
    }

    expect(result.current.getInitialState()).toStrictEqual(expected)
  })

  it('Instance not updated', () => {
    let resultSvg: SvgClass | undefined
    const checkUpdate = jest.fn()
    const TestComponent = () => {
      const [opts, setOpts] = useState({ width: 0, height: 0 })
      const { svg } = useSvg(opts)
      resultSvg = svg

      useEffect(() => {
        checkUpdate()
      }, [svg])

      return (
        <button onClick={() => setOpts({ width: 100, height: 100 })}></button>
      )
    }

    render(<TestComponent />)

    userEvent.click(screen.getByRole('button'))
    userEvent.click(screen.getByRole('button'))

    expect(checkUpdate).toHaveBeenCalledTimes(1)
    expect(resultSvg).toBeInstanceOf(Svg)
    expect(resultSvg?.width).toBe(0)
    expect(resultSvg?.height).toBe(0)
  })
})
