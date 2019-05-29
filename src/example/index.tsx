import React, {
  useEffect,
  useRef,
  Fragment,
  useCallback,
  useState
} from 'react'
import Two from 'two.js'
import { render } from 'react-dom'
import { createGrid } from './createGrid'
import { SvgDrawing, SvgAnimation } from '../'
import Pressure from 'pressure'

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
    // Firefox, Chrome, Safari
    const a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } else {
    // Other
    window.open(base64, '_blank')
  }
}

const CANVAS_SIZE: number = 500
const Example = () => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const svgDrawingRef = useRef<SvgDrawing | null>(null)
  const animationRef = useRef<HTMLDivElement | null>(null)
  const svgAnimationRef = useRef<SvgAnimation | null>(null)
  const stopShakingRef = useRef<(() => void) | null>(null)
  const stopStrokeRef = useRef<(() => void) | null>(null)
  const [thinnerPenWidth, setThinnerPenWidth] = useState<number>(5)
  const [rainbowPen, switchRainbowpen] = useState<boolean>(false)
  const [penMode, changePenMode] = useState<string>('normal')
  const stopShaking = useCallback(() => {
    if (stopShakingRef.current) {
      stopShakingRef.current()
      stopShakingRef.current = null
      return true
    }
    return false
  }, [])
  const clickShaking = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (stopShaking()) return
      if (!svgAnimationRef.current) return
      stopShakingRef.current = svgAnimationRef.current.shaking()
    },
    [stopShaking]
  )
  const stopStroke = useCallback(() => {
    if (stopStrokeRef.current) {
      stopStrokeRef.current()
      stopStrokeRef.current = null
      return true
    }
    return false
  }, [])
  const clickStroke = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (stopStroke()) return
      if (!svgAnimationRef.current) return
      stopStrokeRef.current = svgAnimationRef.current.strokeAnimation()
    },
    [stopStroke]
  )
  const animationFrameUpdate = useCallback(() => {
    if (!svgAnimationRef.current || !svgDrawingRef.current) return
    svgAnimationRef.current.loadScene(svgDrawingRef.current.scene)
    // TODO: load svgXML example
    // load SVGXML
    // svgAnimationRef.current.loadSvgXml(svgDrawingRef.current.toSvgXml())
  }, [])
  const clickDownload = useCallback(
    (extention: keyof typeof mimeTypeMap) => (
      e: React.MouseEvent<HTMLElement>
    ) => {
      if (!svgAnimationRef.current) return
      const domElemet = (svgAnimationRef.current.renderer as any).domElement
      const blob = domElemet.toDataURL(getMimeType(extention))
      downloadBlob(blob, extention)
    },
    []
  )
  const clickDownloadSVG = useCallback(() => {
    if (!svgDrawingRef.current) return
    const data = svgDrawingRef.current.toSvgBase64()
    if (!data) return
    downloadBlob(data, 'svg')
  }, [])
  const clickClear = useCallback(() => {
    if (svgDrawingRef.current) svgDrawingRef.current.clear()
    stopShaking()
    stopStroke()
    animationFrameUpdate()
  }, [animationFrameUpdate, stopStroke, stopShaking])
  const clickUndo = useCallback(() => {
    if (!svgDrawingRef.current) return
    const path = svgDrawingRef.current.scene.children
    if (path.length === 0) return
    svgDrawingRef.current.remove(path[path.length - 1])
    animationFrameUpdate()
  }, [animationFrameUpdate])
  const clickRandomColor = useCallback(() => {
    if (!svgDrawingRef.current) return
    svgDrawingRef.current.penColor = getRandomColor()
  }, [])

  const changePenWidth = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!svgDrawingRef.current) return
      svgDrawingRef.current.penWidth = Number(e.target.value)
    },
    []
  )
  const changeShakingRange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!svgAnimationRef.current) return
      svgAnimationRef.current.shakingRange = Number(e.target.value)
    },
    []
  )
  const changeCap = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const cap = e.target.value
    if (!['butt', 'round', 'square'].includes(e.target.value)) return
    if (!svgDrawingRef.current) return
    svgDrawingRef.current.strokeCap = cap
  }, [])
  const changeLineJoin = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const lineJoin = e.target.value
      if (!['miter', 'round', 'bevel'].includes(e.target.value)) return
      if (!svgDrawingRef.current) return
      svgDrawingRef.current.strokeLineJoin = lineJoin
    },
    []
  )
  const updatePenConfig = useCallback(
    (e: any) => {
      if (rainbowPen && svgDrawingRef.current)
        svgDrawingRef.current.penColor = getRandomColor()
      if (penMode === 'random' && svgDrawingRef.current)
        svgDrawingRef.current.penWidth = getRandomInt(50) + 5
      if (penMode === 'thinner')
        svgDrawingRef.current.penWidth = thinnerPenWidth
    },
    [rainbowPen, penMode, thinnerPenWidth]
  )
  const pressureChange = useCallback(
    (force: any, event: any) => {
      if (penMode !== 'thinner') return
      if (!svgDrawingRef.current) return
      const pw = 30 - Math.floor(force * 40)
      setThinnerPenWidth(pw)
    },
    [penMode]
  )
  useEffect(() => {
    if (svgDrawingRef.current) return
    if (!divRef.current) return
    svgDrawingRef.current = new SvgDrawing({
      el: divRef.current,
      autostart: true,
      penWidth: 5,
      width: CANVAS_SIZE,
      height: CANVAS_SIZE
    })
  })
  useEffect(() => {
    if (svgAnimationRef.current) return
    if (!animationRef.current) return
    svgAnimationRef.current = new SvgAnimation({
      el: animationRef.current,
      type: Two.Types.canvas,
      shakingRange: 5,
      width: CANVAS_SIZE,
      height: CANVAS_SIZE
    })
  })
  useEffect(() => {
    if (!divRef.current) return
    Pressure.set(divRef.current, {
      change: pressureChange
    })
  })
  return (
    <Fragment>
      <fieldset>
        <label>
          <input
            type="checkbox"
            checked={penMode === 'normal'}
            onChange={e => {
              changePenMode('normal')
              changePenWidth(e)
            }}
          />
          Normal pen.
        </label>
        <label>
          <input
            type="checkbox"
            checked={penMode === 'thinner'}
            onChange={e => {
              changePenMode('thinner')
            }}
          />
          Pen becoming thinner.
        </label>
        <label>
          <input
            type="checkbox"
            checked={penMode === 'random'}
            onChange={e => {
              changePenMode('random')
            }}
          />
          Pen becoming Random Width.
        </label>
        {penMode === 'normal' && (
          <div>
            pen width
            <input type="range" min={1} max={50} onChange={changePenWidth} />
          </div>
        )}
        <label>
          <input
            type="checkbox"
            checked={rainbowPen}
            onChange={e => {
              switchRainbowpen(e.target.checked)
            }}
          />
          Rainbow pen.
        </label>
        {!rainbowPen && (
          <button onClick={clickRandomColor}>Change Color</button>
        )}
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
      </fieldset>
      <fieldset>
        <button onClick={clickShaking}>Shaking Animation</button>
        <button onClick={clickStroke}>Srroke Animation</button>
        <div>
          Shaking Range
          <input
            type="range"
            defaultValue="5"
            min={1}
            max={50}
            onChange={changeShakingRange}
          />
        </div>
      </fieldset>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div
            ref={divRef}
            onTouchEnd={animationFrameUpdate}
            onMouseMove={updatePenConfig}
            onTouchMove={updatePenConfig}
            onMouseUp={animationFrameUpdate}
            style={{
              background: `url('${gridImage}') 0 0 repeat`,
              backgroundSize: `${size}px ${size}px`,
              width: 500,
              height: 500,
              margin: 'auto'
            }}
          />
        </div>
        <div>
          <div
            ref={animationRef}
            style={{
              border: '1px solid #bbb',
              margin: 'auto'
            }}
          />
        </div>
      </div>
      <div>
        <button onClick={clickClear}>Clear</button>
        <button onClick={clickUndo}>Undo</button>
        <button onClick={clickDownload('png')}>Download PNG</button>
        <button onClick={clickDownload('jpg')}>Download JPG</button>
        <button onClick={clickDownloadSVG}>Download SVG</button>
      </div>
    </Fragment>
  )
}

const app = document.createElement('div')
document.body.appendChild(app)
render(<Example />, app)
