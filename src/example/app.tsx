import React, {
  useEffect,
  useRef,
  Fragment,
  useCallback,
  useState,
  ChangeEvent,
} from 'react'
import { render } from 'react-dom'
import { SvgDrawing, SvgAnimation, FrameAnimation, Command, Point } from '../'
// import Pressure from 'pressure'

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

const CANVAS_SIZE = innerHeight > innerWidth ? '98vw' : '49vw'

const shake: FrameAnimation = (paths) => {
  const range = 5
  const randomShaking = (): number => Math.random() * range - range / 2
  for (let i = 0; i < paths.length; i += 1) {
    paths[i].commands = paths[i].commands.map((c: Command) => {
      c.point = c.point?.add(new Point(randomShaking(), randomShaking()))
      c.cl = c.cl?.add(new Point(randomShaking(), randomShaking()))
      c.cr = c.cr?.add(new Point(randomShaking(), randomShaking()))
      return c
    })
  }
  return paths
}

const colorfulList = [
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
]

const colorfulAnimation: FrameAnimation = (paths, fid) => {
  for (let i = 0; i < paths.length; i += 1) {
    paths[i].stroke = colorfulList[fid % colorfulList.length]
    paths[i].fill = colorfulList[(fid + 4) % colorfulList.length]
  }
  return paths
}

const drawingAnimation: FrameAnimation = (paths, count) => {
  const update = []
  for (let i = 0; i < paths.length; i += 1) {
    if (count < paths[i].commands.length) {
      paths[i].commands = paths[i].commands.slice(0, count)
      update.push(paths[i])
      break
    }
    count -= paths[i].commands.length
    update.push(paths[i])
  }
  return update
}

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

const Example = () => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const drawingRef = useRef<SvgDrawing | null>(null)
  const aniDivRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<SvgAnimation | null>(null)
  const [rainbowPen, switchRainbowpen] = useState(false)
  // TODO: fix
  // const [thinner, switchThinner] = useState(true)
  const [curve, switchCurve] = useState(true)
  const [close, switchClose] = useState(false)
  const [fill, setFill] = useState('none')
  const [penColor, setPenColor] = useState('black')
  const [delay, setDelay] = useState(20)
  const [animMs, setAnimMs] = useState(20)
  const [penWidth, setPenWidth] = useState(5)
  const clickDownload = useCallback(
    (extention: 'png' | 'jpg' | 'svg') => (
      e: React.MouseEvent<HTMLElement>
    ) => {
      if (!drawingRef.current) return
      drawingRef.current.download(extention)
    },
    []
  )

  // TODO: fix
  // const pressureChange = useCallback(
  //   (force: any, event: any) => {
  //     if (!thinner) return
  //     if (!drawingRef.current) return
  //     const pw = 30 - Math.floor(force * 40)
  //     drawingRef.current.penWidth = pw
  //   },
  //   [thinner]
  // )

  const handleChangeRainbowPen = useCallback((e) => {
    if (!drawingRef.current) return
    drawingRef.current.fill = 'none'
    drawingRef.current.close = false
    switchRainbowpen(e.target.checked)
  }, [])

  // TODO: fix
  // const handleChangeThinner = useCallback(e => {
  //   if (!drawingRef.current) return
  //   switchThinner(e.target.checked)
  // }, [])
  const handleChangeCiruler = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.curve = !curve
    switchCurve(!curve)
  }, [curve])

  const handleChangeClose = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.close = !close
    switchClose(!close)
  }, [close])

  const handlePenWidth = useCallback((e: ChangeEvent<any>) => {
    if (!drawingRef.current) return
    const num = Number(e.target.value)
    if (Number.isNaN(num)) return
    drawingRef.current.penWidth = num
    setPenWidth(num)
  }, [])

  const handleChangeDelay = useCallback((e: ChangeEvent<any>) => {
    if (!drawingRef.current) return
    const num = Number(e.target.value)
    if (Number.isNaN(num)) return
    drawingRef.current.changeDelay(num)
    setDelay(num)
  }, [])

  const handleChangeAnimMs = useCallback((e: ChangeEvent<any>) => {
    if (!animationRef.current) return
    const num = Number(e.target.value)
    if (Number.isNaN(num)) return
    animationRef.current.ms = num
    setAnimMs(num)
  }, [])
  const updatePenColor = useCallback((color: string) => {
    if (!drawingRef.current) return
    drawingRef.current.penColor = color
    setPenColor(color)
  }, [])

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

  const updateFill = useCallback((color: string) => {
    if (!drawingRef.current) return
    drawingRef.current.fill = color
    setFill(color)
  }, [])

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
    if (drawingRef.current) drawingRef.current.clear()
  }, [])
  const clickUndo = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.undo()
  }, [drawingRef])
  const clickOff = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.off()
  }, [drawingRef])
  const clickOn = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.on()
  }, [drawingRef])
  useEffect(() => {
    if (drawingRef.current) return
    if (!divRef.current) return
    drawingRef.current = new SvgDrawing(divRef.current, {
      curve,
      close,
      delay,
      penWidth,
      fill,
    })
  })

  useEffect(() => {
    if (animationRef.current) return
    if (!aniDivRef.current) return
    animationRef.current = new SvgAnimation(aniDivRef.current, {
      ms: animMs,
    })
  })
  useEffect(() => {
    const stop = setInterval(() => {
      if (drawingRef.current && rainbowPen) {
        const color = getRandomColor()
        drawingRef.current.penColor = color
        setPenColor(color)
      }
    }, delay * 4)
    return () => clearInterval(stop)
  }, [delay, rainbowPen])

  const handleFiles = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = function (ev: ProgressEvent<FileReader>) {
      if (typeof ev.target.result !== 'string') return
      const [type, data] = ev.target.result.split(',')
      if (type === 'data:image/svg+xml;base64') {
        const svgxml = atob(data)
        if (!drawingRef.current) return
        drawingRef.current.parseSVGString(svgxml)
        drawingRef.current.update()
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }, [])
  const handleClickShake = useCallback(() => {
    if (!animationRef.current) return
    if (!drawingRef.current) return
    animationRef.current.setAnimation(shake, {
      frames: 3,
    })
    animationRef.current.copy(drawingRef.current)
    animationRef.current.start()
  }, [])
  const handleClickDrawingAnimation = useCallback(() => {
    if (!animationRef.current) return
    if (!drawingRef.current) return
    animationRef.current.setAnimation(drawingAnimation, {
      repeatCount: 1,
    })
    animationRef.current.copy(drawingRef.current)
    animationRef.current.start()
  }, [])
  const handleClickColorfulAnimation = useCallback(() => {
    if (!animationRef.current) return
    if (!drawingRef.current) return
    animationRef.current.setAnimation(colorfulAnimation, {
      frames: colorfulList.length,
    })
    animationRef.current.copy(drawingRef.current)
    animationRef.current.start()
  }, [])
  const handleClickStop = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.stop()
  }, [])
  const handleClickRestore = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.restore()
  }, [])
  const handleDownloadAnimation = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.downloadAnimation()
  }, [])
  // TODO: fix
  // useEffect(() => {
  //   if (!divRef.current) return
  //   Pressure.set(divRef.current, {
  //     change: throttle(pressureChange, delay)
  //   })
  // })
  return (
    <Fragment>
      <div>
        <h1>svg-drawing</h1>
        <a href="https://github.com/kmkzt/svg-drawing">src</a>
        <fieldset>
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
          {/* TODO: fix
        <label>
          <input
            type="checkbox"
            checked={thinner}
            onChange={handleChangeThinner}
          />
          Thinner
        </label> */}
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
        </fieldset>
        <fieldset>
          <h3>COLOR</h3>
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
                      width: '15px',
                      height: '15px',
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
        <fieldset>
          <h3>Load Svg files</h3>
          <p>Svg exported by this library can be read.</p>
          <input type="file" onChange={handleFiles} multiple accept="image/*" />
        </fieldset>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <fieldset>
            <h3>Drawing methods</h3>
            <button onClick={clickClear}>Clear</button>
            <button onClick={clickUndo}>Undo</button>
            <button onClick={clickOff}>OFF</button>
            <button onClick={clickOn}>ON</button>
            <button onClick={clickDownload('png')}>Download PNG</button>
            <button onClick={clickDownload('jpg')}>Download JPG</button>
            {/* <button onClick={clickDownloadGIF}>Download GIF</button> */}
            <button onClick={clickDownload('svg')}>Download SVG</button>
          </fieldset>
          <div
            ref={divRef}
            style={{
              backgroundImage: lattice(size),
              backgroundSize: `${size}px ${size}px`,
              border: '1px solid #333',
              width: CANVAS_SIZE,
              height: CANVAS_SIZE,
              margin: 'auto',
            }}
          />
        </div>
        <div>
          <fieldset>
            <h3>Animation methods</h3>
            <button onClick={handleClickShake}>Shaking</button>
            <button onClick={handleClickDrawingAnimation}>Drawing</button>
            <button onClick={handleClickColorfulAnimation}>Colorful</button>
            <button onClick={handleClickStop}>Stop</button>
            <button onClick={handleClickRestore}>Restore</button>
            <button onClick={handleDownloadAnimation}>
              Download Anmation SVG
            </button>
            <div>
              ANIMATION MS
              <input
                type="number"
                min="0"
                max="500"
                step="5"
                value={animMs}
                onChange={handleChangeAnimMs}
              />
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={animMs}
                onChange={handleChangeAnimMs}
              />
            </div>
          </fieldset>
          <div
            ref={aniDivRef}
            style={{
              backgroundSize: `${size}px ${size}px`,
              border: '1px solid #333',
              width: CANVAS_SIZE,
              height: CANVAS_SIZE,
              margin: 'auto',
            }}
          />
        </div>
      </div>
    </Fragment>
  )
}

const app = document.createElement('div')
const style = document.createElement('style')
style.innerHTML = `
  * {
    margin: 0;
  }
`
document.body.appendChild(app)
document.body.appendChild(style)
render(<Example />, app)
