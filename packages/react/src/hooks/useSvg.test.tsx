import { Svg } from '@svg-drawing/core'
import { render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import React, { useEffect, useState } from 'react'
import { useSvg } from './useSvg'
import type { SvgClass } from '@svg-drawing/core'

describe('useSvg', () => {
  it('Return svg instance', () => {
    const width = 100
    const height = 100
    const { result } = renderHook(() => useSvg({ width, height }))
    expect(result.current).toBeInstanceOf(Svg)
    expect(result.current.width).toBe(width)
    expect(result.current.height).toBe(height)
  })
  it('Instance not updated', () => {
    let resultSvg: SvgClass | undefined
    const checkUpdate = jest.fn()
    const TestComponent = () => {
      const [opts, setOpts] = useState({ width: 0, height: 0 })
      const svg = useSvg(opts)
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
