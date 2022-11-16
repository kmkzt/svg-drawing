import { render } from '@testing-library/react'
import React from 'react'
import { Svg } from './Svg'
import type { ComponentProps } from 'react'

const BaseComponent = (props: ComponentProps<typeof Svg>) => <Svg {...props} />

describe('Svg', () => {
  it('Render background', () => {
    const { container } = render(
      <BaseComponent width={500} height={500} background="red" />,
      {
        legacyRoot: true,
      }
    )

    expect(container.querySelector('rect')?.getAttribute('fill')).toBe('red')
  })

  it.todo('Run onSelect when svg click')
  it.todo('Run onSelect when svg touch')

  it.todo('Not run onSelect when path element click')
  it.todo('Not run onSelect when path element touch')
})
