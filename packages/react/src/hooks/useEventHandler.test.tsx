import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useRef, useState } from 'react'
import { useEventHandler } from './useEventHandler'

describe('useEventHandler', () => {
  it('Not call handler.setup when ref.current is null', async () => {
    const handler = { setup: jest.fn(), cleanup: jest.fn() }

    const TestComponent = (): JSX.Element => {
      const ref = useRef(null)

      useEventHandler({
        ref,
        handler,
      })

      return <>OK!</>
    }

    render(<TestComponent />)

    await screen.findByText('OK!')

    expect(handler.setup).not.toBeCalled()
  })

  it('Call handler.setup when ref.current is html element', async () => {
    const handler = { setup: jest.fn(), cleanup: jest.fn() }

    const TestComponent = (): JSX.Element => {
      const ref = useRef(null)

      useEventHandler({
        ref,
        handler,
        active: true,
      })

      return <div ref={ref}>Active</div>
    }

    render(<TestComponent />)

    await screen.findByText('Active')

    expect(handler.setup).toBeCalledWith(expect.any(HTMLDivElement))
  })

  it('Call handler.cleanup when active state change false', async () => {
    const handler = { setup: jest.fn(), cleanup: jest.fn() }

    const TestComponent = (): JSX.Element => {
      const ref = useRef(null)

      const [active, setActive] = useState(true)

      useEventHandler({
        ref,
        handler,
        active,
      })

      return (
        <>
          <div ref={ref}>{active ? 'Active' : 'Inactive'}</div>
          <button onClick={() => setActive((prev) => !prev)}>
            {active ? 'OFF' : 'ON'}
          </button>
        </>
      )
    }

    render(<TestComponent />)

    await screen.findByText('Active')

    expect(handler.setup).toBeCalledWith(expect.any(HTMLDivElement))
    expect(handler.cleanup).not.toBeCalled()

    userEvent.click(await screen.findByText('OFF'))

    await screen.findByText('Inactive')

    expect(handler.cleanup).toBeCalled()
  })

  it('Call handler.cleanup when target element unmount', async () => {
    const handler = { setup: jest.fn(), cleanup: jest.fn() }

    const TestComponent = (): JSX.Element => {
      const ref = useRef(null)

      const [active, setActive] = useState(true)

      useEventHandler({
        ref,
        handler,
        active,
      })

      return (
        <>
          {active ? <div ref={ref} /> : null}
          <button onClick={() => setActive((prev) => !prev)}>
            {active ? 'OFF' : 'ON'}
          </button>
        </>
      )
    }

    render(<TestComponent />)

    await screen.findByText('OFF')

    expect(handler.setup).toBeCalledWith(expect.any(HTMLDivElement))
    expect(handler.cleanup).not.toBeCalled()

    userEvent.click(screen.getByText('OFF'))
    await screen.findByText('ON')

    expect(handler.cleanup).toBeCalled()
  })
})
