import { useEffect, useCallback, useState, ChangeEvent } from 'react'
import { NextPage } from 'next'
import { useSvgDrawing } from '@svg-drawing/react'
import Layout from '../components/Layout'

const size = 30
const colorList = [
  'none',
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#ddd',
  '#9E9E9E',
  '#444',
  'black',
]

const getRandomInt = (max: number): number =>
  Math.floor(Math.random() * Math.floor(max))
const getRandomColor = (): string =>
  `#${Array.from({ length: 3 }, () =>
    String(getRandomInt(255).toString(16)).padStart(2, '0')
  ).join('')}`

const lattice = (s: number) => `
  repeating-linear-gradient(
    90deg,
    #ddd ,
    #ddd 1px,
    transparent 1px,
    transparent ${String(s)}px
  ),
  repeating-linear-gradient(
    0deg,
    #ddd ,
    #ddd 1px,
    transparent 1px,
    transparent ${String(s)}px
  )
`
interface Props {
  isSp: boolean
}
const Top: NextPage<Props> = ({ isSp }) => {
  const [CANVAS_SIZE] = useState(isSp ? '98vw' : '49vw')
  const [rainbowPen, switchRainbowpen] = useState(false)
  const [curve, switchCurve] = useState(true)
  const [close, switchClose] = useState(false)
  const [fill, setFill] = useState('none')
  const [penColor, setPenColor] = useState('black')
  const [delay, setDelay] = useState(20)
  const [penWidth, setPenWidth] = useState(5)
  const [divRef, draw] = useSvgDrawing({
    curve,
    close,
    delay,
    penWidth,
    fill,
  })
  const clickDownload = useCallback(
    (extention: 'png' | 'jpg' | 'svg') => (
      e: React.MouseEvent<HTMLElement>
    ) => {
      draw.download(extention)
    },
    [draw]
  )

  const handleChangeRainbowPen = useCallback(
    (e) => {
      draw.changeFill('none')
      draw.changeClose(false)
      switchRainbowpen(e.target.checked)
    },
    [draw]
  )

  // TODO: fix
  // const handleChangeThinner = useCallback(e => {
  //   if (!drawingRef.current) return
  //   switchThinner(e.target.checked)
  // }, [])
  const handleChangeCiruler = useCallback(() => {
    draw.changeCurve(!curve)
    switchCurve(!curve)
  }, [curve, draw])

  const handleChangeClose = useCallback(() => {
    draw.changeClose(!close)
    switchClose(!close)
  }, [close, draw])

  const handlePenWidth = useCallback(
    (e: ChangeEvent<any>) => {
      const num = Number(e.target.value)
      if (Number.isNaN(num)) return
      draw.changePenWidth(num)
      setPenWidth(num)
    },
    [draw]
  )

  const handleChangeDelay = useCallback(
    (e: ChangeEvent<any>) => {
      const num = Number(e.target.value)
      if (Number.isNaN(num)) return
      draw.changeDelay(num)
      setDelay(num)
    },
    [draw]
  )

  const updatePenColor = useCallback(
    (color: string) => {
      draw.changePenColor(color)
      setPenColor(color)
    },
    [draw]
  )

  const handleChangePenColor = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updatePenColor(e.target.value)
    },
    [updatePenColor]
  )

  const handleClickPenColor = useCallback(
    (col: string) => () => {
      updatePenColor(col)
    },
    [updatePenColor]
  )

  const updateFill = useCallback(
    (color: string) => {
      draw.changeFill(color)
      setFill(color)
    },
    [draw]
  )

  const handleChangeFill = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateFill(e.target.value)
    },
    [updateFill]
  )

  const handleClickFill = useCallback(
    (col: string) => () => {
      updateFill(col)
    },
    [updateFill]
  )

  const clickClear = useCallback(() => {
    draw.clear()
  }, [draw])
  const clickUndo = useCallback(() => {
    draw.undo()
  }, [draw])
  const clickOff = useCallback(() => {
    if (!draw.instance) return
    draw.instance.off()
  }, [draw])
  const clickOn = useCallback(() => {
    if (!draw.instance) return
    draw.instance.on()
  }, [draw])

  useEffect(() => {
    const stop = setInterval(() => {
      if (!rainbowPen) return
      const color = getRandomColor()
      draw.changePenColor(color)
      setPenColor(color)
    }, delay * 4)
    return () => clearInterval(stop)
  }, [delay, rainbowPen, draw])

  const handleFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const reader = new FileReader()
      reader.onload = function (ev: ProgressEvent<FileReader>) {
        if (!ev.target || typeof ev.target.result !== 'string') return
        const [type, data] = ev.target.result.split(',')
        if (type === 'data:image/svg+xml;base64') {
          const svgxml = atob(data)
          if (!draw.instance) return
          draw.instance.parseSVGString(svgxml)
          draw.instance.update()
        }
      }
      if (!e.target?.files) return
      reader.readAsDataURL(e.target.files[0])
    },
    [draw]
  )
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <fieldset style={{ width: isSp ? '100%' : '49%' }}>
          <h3>PEN CONFIG</h3>
          <div>
            STROKE WIDTH:
            <input
              type="number"
              min="1"
              max="20"
              step="1"
              value={penWidth}
              onChange={handlePenWidth}
            />
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={penWidth}
              onChange={handlePenWidth}
            />
          </div>
          <div>
            THROTTLE DELAY:
            <input
              type="number"
              min="0"
              max="300"
              step="5"
              value={delay}
              onChange={handleChangeDelay}
            />
            <input
              type="range"
              min="0"
              max="300"
              step="5"
              value={delay}
              onChange={handleChangeDelay}
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={curve}
              onChange={handleChangeCiruler}
            />
            Curve
          </label>
          {!rainbowPen && (
            <label>
              <input
                type="checkbox"
                checked={close}
                onChange={handleChangeClose}
              />
              Close
            </label>
          )}
          <label>
            <input
              type="checkbox"
              checked={rainbowPen}
              onChange={handleChangeRainbowPen}
            />
            Rainbow pen
          </label>

          {!rainbowPen && (
            <>
              <h3>COLOR</h3>
              <div>
                FILL:
                <input
                  type="text"
                  placeholder="#000 or black or rgba(0,0,0,1)"
                  value={fill}
                  onChange={handleChangeFill}
                />
              </div>
              <div>
                {colorList.map((col: string) => (
                  <div
                    key={col}
                    style={{
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      backgroundColor: col,
                      border:
                        col === fill ? '2px solid #000' : '2px solid #999',
                    }}
                    onClick={handleClickFill(col)}
                  />
                ))}
              </div>
              <div>
                PEN COLOR:
                <input
                  type="text"
                  placeholder="#000 or black or rgba(0,0,0,1)"
                  value={penColor}
                  onChange={handleChangePenColor}
                />
              </div>
              <div>
                {colorList.map((col: string) => (
                  <div
                    key={col}
                    style={{
                      display: 'inline-block',
                      width: '15px',
                      height: '15px',
                      backgroundColor: col,
                      border:
                        col === penColor ? '2px solid #000' : '2px solid #999',
                    }}
                    onClick={handleClickPenColor(col)}
                  />
                ))}
              </div>
            </>
          )}
        </fieldset>
        <fieldset style={{ width: isSp ? '100%' : '49%' }}>
          <h3>Drawing methods</h3>
          <button onClick={clickClear}>Clear</button>
          <button onClick={clickUndo}>Undo</button>
          <button onClick={clickOff}>OFF</button>
          <button onClick={clickOn}>ON</button>
          <button onClick={clickDownload('png')}>Download PNG</button>
          <button onClick={clickDownload('jpg')}>Download JPG</button>
          {/* <button onClick={clickDownloadGIF}>Download GIF</button> */}
          <button onClick={clickDownload('svg')}>Download SVG</button>
          {!isSp && (
            <>
              <h3>Load Svg files</h3>
              <p>Svg exported by this library can be read.</p>
              <input
                type="file"
                onChange={handleFiles}
                multiple
                accept="image/*"
              />
            </>
          )}
        </fieldset>
      </div>
      <div
        ref={divRef}
        style={{
          backgroundImage: lattice(size),
          backgroundSize: `${size}px ${size}px`,
          border: '1px solid #333',
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          margin: '0 auto 0 0',
        }}
      />
    </Layout>
  )
}

Top.getInitialProps = ({ req }) => {
  const ua = req ? req.headers['user-agent'] : navigator.userAgent
  return {
    isSp: ua ? /iPhone|Android.+Mobile/.test(ua) : true,
  }
}

export default Top
