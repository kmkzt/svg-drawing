import React, {useEffect, useRef, Fragment, useCallback} from 'react'
import { render } from 'react-dom'
import Two from 'two.js'
import { createGrid } from './createGrid'
import DrawingTwo from '../DrawingTwo'

const size = 30
const gridImage = (createGrid({
  size
}).renderer as any).domElement.toDataURL('image/png')

const Example = () => {
  const divRef  = useRef<HTMLDivElement | null>(null)
  const drawing = useRef<DrawingTwo | null>(null)
  const stopShaking = useRef<(() => void) | null>(null)
  const clickShaking = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (stopShaking && stopShaking.current) {
      stopShaking.current()
      stopShaking.current = null
      return
    }
    if (!drawing || !drawing.current) return
    stopShaking.current = drawing.current.shaking()
  },[drawing.current])
  const clickDownload = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!drawing || !drawing.current) return
    const domElemet = (drawing.current.renderer as any).domElement
    switch (drawing.current.type) {
      case Two.Types.canvas:
        console.log(domElemet.toDataURL('image/xml+svg'))
        return
      case Two.Types.svg:
        console.log(domElemet)
        return
      case Two.Types.webgl:
        console.log(domElemet)
        return
      default:
        console.log(domElemet)
        return
    }
  }, [drawing.current])

  const clickClear = useCallback(() => {
    if (!drawing || !drawing.current) return
    drawing.current.clear()
  },[drawing.current])
  useEffect(() => {
    if (!divRef || !divRef.current) return
    drawing.current = new DrawingTwo({
      el: divRef.current,
      type: Two.Types.canvas,
      autostart: true
    })
  },[divRef.current])

  return <Fragment>
    <div
      ref={divRef}
      style={{
        background: `url('${gridImage}') 0 0 repeat`,
        backgroundSize: `${size}px ${size}px`,
        width: 500,
        height: 500
      }}
    />
    <button onClick={clickShaking} >Shaking Line</button>
    <button onClick={clickDownload}>Download</button>
    <button onClick={clickClear}>Clear</button>
  </Fragment>
}

const app = document.createElement('div')
document.body.appendChild(app)
render(<Example />, app)
