import React, {useEffect, useRef, Fragment, useCallback, useState} from 'react'
import { render } from 'react-dom'
import Two from 'two.js'
import { createGrid } from './createGrid'
import DrawingTwo from '../DrawingTwo'

const size = 30
const gridImage = (createGrid({
  size
}).renderer as any).domElement.toDataURL('image/png')
interface DownloadParam {
  base64: string
  filename: string
  extention: string
}

const mimeTypeMap = {
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml'
}

const getMimeType = (extention: keyof typeof mimeTypeMap) => mimeTypeMap.hasOwnProperty(extention)
  ? mimeTypeMap[extention]
  : mimeTypeMap['png']
const downloadBlob = (base64: string, extention: keyof typeof mimeTypeMap) => {
  const bin = atob(base64.replace(/^.*,/, ''))
  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  const filename = `${new Date().toISOString()}.${extention}`
  const blob = new Blob([buffer.buffer], {
    type: getMimeType(extention)
  })
  if (window.navigator.msSaveBlob) { // IE
    window.navigator.msSaveBlob(blob, filename)
  } else if (window.URL && window.URL.createObjectURL) { // for Firefox, Chrome, Safari
    const a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } else {  // for Other
    window.open(base64, '_blank')
  }
}


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
  const clickDownload = useCallback((extention: keyof typeof mimeTypeMap) => (e: React.MouseEvent<HTMLElement>) => {
    if (!drawing || !drawing.current) return
    const domElemet = (drawing.current.renderer as any).domElement
    const blob = domElemet.toDataURL(getMimeType(extention))
    downloadBlob(blob, extention)
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
    <button onClick={clickDownload('png')}>Download PNG</button>
    <button onClick={clickDownload('jpg')}>Download JPG</button>
    <button onClick={clickDownload('svg')}>Download SVG</button>
    <button onClick={clickClear}>Clear</button>
  </Fragment>
}

const app = document.createElement('div')
document.body.appendChild(app)
render(<Example />, app)
