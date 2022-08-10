import { PencilHandler } from '@svg-drawing/core'
import {
  useDraw,
  useSvg,
  useDrawFactory,
  useDrawEventHandler,
  Svg,
  Paths,
  usePencilHandler,
  usePenHandler,
} from '@svg-drawing/react'
import React, { useRef, useState, useMemo } from 'react'

function App() {
  const svg = useSvg({ width: 500, height: 500 })
  const [{ paths, ...svgProps }, setSvgObject] = useState(svg.toJson())

  const factory = useDrawFactory(
    { stroke: '#000', fill: 'none' },
    { curve: true, close: false }
  )

  const { draw } = useDraw({
    svg,
    factory,
    onChangeSvg: setSvgObject,
  })

  const ref = useRef(null)

  usePenHandler(ref, draw, true)

  return (
    <div
      ref={ref}
      style={{
        border: '1px solid #333',
        margin: '0 auto 0 0',
        width: '100%',
        height: '100%',
        touchAction: 'none',
        boxSizing: 'border-box',
      }}
    >
      <Svg {...svgProps}>
        <Paths paths={paths} />
      </Svg>
    </div>
  )
}

export default App
