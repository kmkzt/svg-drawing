import React, { useEffect, useRef, Fragment, useCallback } from 'react'
import { render } from 'react-dom'
import { createGrid } from './createGrid'
import SvgDrawing from '../SvgDrawing'

const size = 30
const gridImage = (createGrid({
  size
}).renderer as any).domElement.toDataURL('image/png')

const mimeTypeMap = {
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml'
}
const getRandomInt = (max: number): number =>
  Math.floor(Math.random() * Math.floor(max))
const getRandomColor = (): string =>
  `#${Array.from({ length: 3 }, () =>
    String(getRandomInt(255).toString(16)).padStart(2, '0')
  ).join('')}`

const getMimeType = (extention: keyof typeof mimeTypeMap) =>
  mimeTypeMap.hasOwnProperty(extention)
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
  if (window.navigator.msSaveBlob) {
    // IE
    window.navigator.msSaveBlob(blob, filename)
  } else if (window.URL && window.URL.createObjectURL) {
    // for Firefox, Chrome, Safari
    const a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } else {
    // for Other
    window.open(base64, '_blank')
  }
}

const Example = () => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const drawing = useRef<SvgDrawing | null>(null)
  const stopShaking = useRef<(() => void) | null>(null)
  const clickShaking = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (stopShaking && stopShaking.current) {
        stopShaking.current()
        stopShaking.current = null
        return
      }
      if (!drawing.current) return
      stopShaking.current = drawing.current.shaking()
    },
    [drawing.current]
  )
  // const clickDownload = useCallback(
  //   (extention: keyof typeof mimeTypeMap) => (
  //     e: React.MouseEvent<HTMLElement>
  //   ) => {
  //     if (!drawing.current) return
  //     const domElemet = (drawing.current.renderer as any).domElement
  //     const blob = domElemet.toDataURL(getMimeType(extention))
  //     downloadBlob(blob, extention)
  //   },
  //   [drawing.current]
  // )
  const clickDownloadSVG = useCallback(() => {
    if (!drawing.current) return
    const data = drawing.current.toSvgBase64()
    if (!data) return
    downloadBlob(data, 'svg')
  }, [drawing.current])
  const clickClear = useCallback(() => {
    if (!drawing.current) return
    drawing.current.clear()
  }, [drawing.current])

  const clickRandomColor = useCallback(() => {
    if (!drawing.current) return
    drawing.current.penColor = getRandomColor()
  }, [drawing.current])
  const changePenWidth = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!drawing.current) return
      const penWidth = Number(e.target.value)
      drawing.current.penWidth = penWidth
    },
    [drawing.current]
  )
  const changeCap = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const cap = e.target.value
      if (!['butt', 'round', 'square'].includes(e.target.value)) return
      if (!drawing.current) return
      drawing.current.strokeCap = cap
    },
    [drawing.current]
  )
  const changeLineJoin = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const lineJoin = e.target.value
      if (!['miter', 'round', 'bevel'].includes(e.target.value)) return
      if (!drawing.current) return
      drawing.current.strokeLineJoin = lineJoin
    },
    [drawing.current]
  )
  useEffect(() => {
    if (!divRef || !divRef.current) return
    drawing.current = new SvgDrawing({
      el: divRef.current,
      autostart: true
    })
  }, [divRef.current])

  return (
    <Fragment>
      <div>
        pen width
        <input type="range" min={3} max={50} onChange={changePenWidth} />
      </div>
      <div>
        stroke cap
        <select onChange={changeCap}>
          <option>round</option>
          <option>butt</option>
          <option>square</option>
        </select>
      </div>
      <div>
        stroke line join
        <select onChange={changeLineJoin}>
          <option>round</option>
          <option>mitter</option>
          <option>bevel</option>
        </select>
      </div>
      <button onClick={clickRandomColor}>Change Color</button>
      <div
        ref={divRef}
        style={{
          background: `url('${gridImage}') 0 0 repeat`,
          backgroundSize: `${size}px ${size}px`,
          width: 500,
          height: 500
        }}
      />
      <button onClick={clickShaking}>Shaking Line</button>
      {/* <button onClick={clickDownload('png')}>Download PNG</button>
      <button onClick={clickDownload('jpg')}>Download JPG</button> */}
      <button onClick={clickDownloadSVG}>Download SVG</button>
      <button onClick={clickClear}>Clear</button>
    </Fragment>
  )
}

const app = document.createElement('div')
document.body.appendChild(app)
render(<Example />, app)
