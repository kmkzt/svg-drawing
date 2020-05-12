import React, {
  useEffect,
  useRef,
  Fragment,
  useCallback,
  useState,
  ChangeEvent
} from 'react'
import { render } from 'react-dom'
// import GIFEncoder from './jsgif'
import { SvgDrawing, SvgAnimation } from '../'
import Pressure from 'pressure'
import { throttle } from '../throttle'

const lattice = (size: number) => `
  repeating-linear-gradient(
    90deg,
    #ddd ,
    #ddd 1px,
    transparent 1px,
    transparent ${String(size)}px
  ),
  repeating-linear-gradient(
    0deg,
    #ddd ,
    #ddd 1px,
    transparent 1px,
    transparent ${String(size)}px
  )
`
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
  'black'
]

const getRandomInt = (max: number): number =>
  Math.floor(Math.random() * Math.floor(max))
const getRandomColor = (): string =>
  `#${Array.from({ length: 3 }, () =>
    String(getRandomInt(255).toString(16)).padStart(2, '0')
  ).join('')}`

const CANVAS_SIZE: number = 500
// const Example = () => {
//   const divRef = useRef<HTMLDivElement | null>(null)
//   const drawingRef = useRef<SvgDrawing | null>(null)
//   const animationRef = useRef<HTMLDivElement | null>(null)
//   const svgAnimationRef = useRef<SvgAnimation | null>(null)
//   const stopShakingRef = useRef<(() => void) | null>(null)
//   const stopStrokeRef = useRef<(() => void) | null>(null)
//   const [thinnerPenWidth, setThinnerPenWidth] = useState<number>(5)

//   const [penMode, changePenMode] = useState<string>('normal')
//   const stopShaking = useCallback(() => {
//     if (stopShakingRef.current) {
//       stopShakingRef.current()
//       stopShakingRef.current = null
//       return true
//     }
//     return false
//   }, [])
//   const clickShaking = useCallback(
//     (e: React.MouseEvent<HTMLElement>) => {
//       if (stopShaking()) return
//       if (!svgAnimationRef.current) return
//       stopShakingRef.current = svgAnimationRef.current.shaking()
//     },
//     [stopShaking]
//   )
//   const stopStroke = useCallback(() => {
//     if (stopStrokeRef.current) {
//       stopStrokeRef.current()
//       stopStrokeRef.current = null
//       return true
//     }
//     return false
//   }, [])
//   const clickStroke = useCallback(
//     (e: React.MouseEvent<HTMLElement>) => {
//       if (stopStroke()) return
//       if (!svgAnimationRef.current) return
//       stopStrokeRef.current = svgAnimationRef.current.strokeAnimation()
//     },
//     [stopStroke]
//   )
//   const animationFrameUpdate = useCallback(() => {
//     if (!svgAnimationRef.current || !drawingRef.current) return
//     svgAnimationRef.current.loadScene(drawingRef.current.scene)
//     // TODO: load svgXML example
//     // load SVGXML
//     // svgAnimationRef.current.loadSvgXml(drawingRef.current.toSvgXml())
//   }, [])
//   const clickRandomColor = useCallback(() => {
//     if (!drawingRef.current) return
//     drawingRef.current.penColor = getRandomColor()
//   }, [])

//   const changePenWidth = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       if (!drawingRef.current) return
//       drawingRef.current.penWidth = Number(e.target.value)
//     },
//     []
//   )
//   const changeShakingRange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       if (!svgAnimationRef.current) return
//       svgAnimationRef.current.shakingRange = Number(e.target.value)
//     },
//     []
//   )
//   const changeCap = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
//     const cap = e.target.value
//     if (!['butt', 'round', 'square'].includes(e.target.value)) return
//     if (!drawingRef.current) return
//     drawingRef.current.strokeCap = cap
//   }, [])
//   const changeLineJoin = useCallback(
//     (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const lineJoin = e.target.value
//       if (!['miter', 'round', 'bevel'].includes(e.target.value)) return
//       if (!drawingRef.current) return
//       drawingRef.current.strokeLineJoin = lineJoin
//     },
//     []
//   )
//   const updatePenConfig = useCallback(
//     (e: any) => {
//       if (rainbowPen && drawingRef.current)
//         drawingRef.current.penColor = getRandomColor()
//       if (penMode === 'random' && drawingRef.current)
//         drawingRef.current.penWidth = getRandomInt(50) + 5
//       if (penMode === 'thinner')
//         drawingRef.current.penWidth = thinnerPenWidth
//     },
//     [rainbowPen, penMode, thinnerPenWidth]
//   )
//   const pressureChange = useCallback(
//     (force: any, event: any) => {
//       if (penMode !== 'thinner') return
//       if (!drawingRef.current) return
//       const pw = 30 - Math.floor(force * 40)
//       setThinnerPenWidth(pw)
//     },
//     [penMode]
//   )
//   useEffect(() => {
//     if (drawingRef.current) return
//     if (!divRef.current) return
//     drawingRef.current = new SvgDrawing(divRef.current, {
//       penWidth: 5
//     })
//   })
//   useEffect(() => {
//     if (svgAnimationRef.current) return
//     if (!animationRef.current) return
//     svgAnimationRef.current = new SvgAnimation({
//       el: animationRef.current,
//       type: Two.Types.canvas,
//       shakingRange: 5,
//       width: CANVAS_SIZE,
//       height: CANVAS_SIZE
//     })
//   })
//   useEffect(() => {
//     if (!divRef.current) return
//     Pressure.set(divRef.current, {
//       change: pressureChange
//     })
//   })
//   return (
//     <Fragment>
//       <fieldset>
//         <label>
//           <input
//             type="checkbox"
//             checked={penMode === 'normal'}
//             onChange={e => {
//               changePenMode('normal')
//               changePenWidth(e)
//             }}
//           />
//           Normal pen.
//         </label>
//         <label>
//           <input
//             type="checkbox"
//             checked={penMode === 'thinner'}
//             onChange={e => {
//               changePenMode('thinner')
//             }}
//           />
//           Pen becoming thinner.
//         </label>
//         <label>
//           <input
//             type="checkbox"
//             checked={penMode === 'random'}
//             onChange={e => {
//               changePenMode('random')
//             }}
//           />
//           Pen becoming Random Width.
//         </label>
//         {penMode === 'normal' && (
//           <div>
//             pen width
//             <input type="range" min={1} max={50} onChange={changePenWidth} />
//           </div>
//         )}
//         <label>
//           <input
//             type="checkbox"
//             checked={rainbowPen}
//             onChange={e => {
//               switchRainbowpen(e.target.checked)
//             }}
//           />
//           Rainbow pen.
//         </label>
//         {!rainbowPen && (
//           <button onClick={clickRandomColor}>Change Color</button>
//         )}
//         <div>
//           stroke cap
//           <select onChange={changeCap}>
//             <option>round</option>
//             <option>butt</option>
//             <option>square</option>
//           </select>
//         </div>
//         <div>
//           Mode
//           <select onChange={changeLineJoin}>
//             <option>circuler</option>
//             <option>mitter</option>
//             <option>bevel</option>
//           </select>
//         </div>
//       </fieldset>
//       <fieldset>
//         <button onClick={clickShaking}>Shaking Animation</button>
//         <button onClick={clickStroke}>Srroke Animation</button>
//         <div>
//           Shaking Range
//           <input
//             type="range"
//             defaultValue="5"
//             min={1}
//             max={50}
//             onChange={changeShakingRange}
//           />
//         </div>
//       </fieldset>
//       <div
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap'
//         }}
//       >
//         <div>
//           <div
//             ref={divRef}
//             onTouchEnd={animationFrameUpdate}
//             onMouseMove={updatePenConfig}
//             onTouchMove={updatePenConfig}
//             onMouseUp={animationFrameUpdate}
//             style={{
//               background: `url('${gridImage}') 0 0 repeat`,
//               backgroundSize: `${size}px ${size}px`,
//               width: 500,
//               height: 500,
//               margin: 'auto'
//             }}
//           />
//         </div>
//         <div>
//           <div
//             ref={animationRef}
//             style={{
//               border: '1px solid #bbb',
//               margin: 'auto'
//             }}
//           />
//         </div>
//       </div>
//       <div>
//         <button onClick={clickClear}>Clear</button>
//         <button onClick={clickUndo}>Undo</button>
//         <button onClick={clickDownload('png')}>Download PNG</button>
//         <button onClick={clickDownload('jpg')}>Download JPG</button>
//         <button onClick={clickDownloadGIF}>Download GIF</button>
//         <button onClick={clickDownloadSVG}>Download SVG</button>
//       </div>
//     </Fragment>
//   )
// }

const Example = () => {
  const divRef = useRef<HTMLDivElement | null>(null)
  const drawingRef = useRef<SvgDrawing | null>(null)
  const [rainbowPen, switchRainbowpen] = useState(false)
  const [thinner, switchThinner] = useState(true)
  const [circuler, switchCirculer] = useState(true)
  const [close, switchClose] = useState(false)
  const [fill, setFill] = useState('none')
  const [penColor, setPenColor] = useState('black')
  const [delay, setDelay] = useState(20)
  const [penWidth, setPenWidth] = useState(1)

  const clickDownload = useCallback(
    (extention: 'png' | 'jpg' | 'svg') => (
      e: React.MouseEvent<HTMLElement>
    ) => {
      if (!drawingRef.current) return
      drawingRef.current.download(extention)
    },
    []
  )

  const pressureChange = useCallback(
    (force: any, event: any) => {
      if (!thinner) return
      if (!drawingRef.current) return
      const pw = 30 - Math.floor(force * 40)
      drawingRef.current.penWidth = pw
    },
    [thinner]
  )

  const handleChangeRainbowPen = useCallback(e => {
    if (!drawingRef.current) return
    drawingRef.current.fill = 'none'
    switchRainbowpen(e.target.checked)
  }, [])

  const handleChangeThinner = useCallback(e => {
    if (!drawingRef.current) return
    switchThinner(e.target.checked)
  }, [])
  const handleChangeCiruler = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.circuler = !circuler
    switchCirculer(!circuler)
  }, [circuler])

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

  // /**
  //  * TODO: Download action
  //  */
  // const clickDownloadGIF = useCallback(() => {
  //   if (!svgAnimationRef.current) return
  //   const frame: number = 50
  //   const encoder = new (GIFEncoder as any)()
  //   encoder.setRepeat(0)
  //   encoder.setDelay(500 / frame)
  //   encoder.setQuality(5)
  //   encoder.start()
  //   for (let i = 0; i <= frame; i++) {
  //     svgAnimationRef.current.splitEnd(i / frame)
  //     encoder.addFrame((svgAnimationRef.current.renderer as any).ctx)
  //   }
  //   encoder.finish()
  //   encoder.download(`${new Date().toISOString()}.gif`)
  // }, [])

  const clickClear = useCallback(() => {
    if (drawingRef.current) drawingRef.current.clear()
  }, [])
  const clickUndo = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current.undo()
  }, [drawingRef])
  useEffect(() => {
    if (drawingRef.current) return
    if (!divRef.current) return
    drawingRef.current = new SvgDrawing(divRef.current, {
      circuler,
      close,
      delay,
      penWidth,
      fill
    })
  })
  useEffect(() => {
    const stop = setInterval(() => {
      if (drawingRef.current && rainbowPen) {
        const color = getRandomColor()
        drawingRef.current.penColor = color
        setPenColor(color)
      }
    }, 100)
    return () => clearInterval(stop)
  }, [rainbowPen])

  useEffect(() => {
    if (!divRef.current) return
    Pressure.set(divRef.current, {
      change: throttle(pressureChange, delay)
    })
  })
  return (
    <Fragment>
      <div>
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
            checked={rainbowPen}
            onChange={handleChangeRainbowPen}
          />
          Rainbow pen
        </label>
        <label>
          <input
            type="checkbox"
            checked={thinner}
            onChange={handleChangeThinner}
          />
          Thinner
        </label>
        <label>
          <input
            type="checkbox"
            checked={circuler}
            onChange={handleChangeCiruler}
          />
          Circuler
        </label>
        <label>
          <input type="checkbox" checked={close} onChange={handleChangeClose} />
          Close
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
                    border: col === fill ? '2px solid #000' : '2px solid #999'
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
                      col === penColor ? '2px solid #000' : '2px solid #999'
                  }}
                  onClick={handleClickPenColor(col)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div
        ref={divRef}
        style={{
          backgroundImage: lattice(size),
          backgroundSize: `${size}px ${size}px`,
          width: 500,
          height: 500,
          margin: 'auto'
        }}
      />
      <div>
        <button onClick={clickClear}>Clear</button>
        <button onClick={clickUndo}>Undo</button>
        <button onClick={clickDownload('png')}>Download PNG</button>
        <button onClick={clickDownload('jpg')}>Download JPG</button>
        {/* <button onClick={clickDownloadGIF}>Download GIF</button> */}
        <button onClick={clickDownload('svg')}>Download SVG</button>
      </div>
    </Fragment>
  )
}

const app = document.createElement('div')
document.body.appendChild(app)
render(<Example />, app)
