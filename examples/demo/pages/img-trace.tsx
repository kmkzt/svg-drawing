import React, {
  useState,
  useCallback,
  ChangeEvent,
  useRef,
  RefObject,
  useEffect,
} from 'react'
import { Renderer } from '@svg-drawing/core'
import {
  ImgTrace,
  Rgba,
  Palette,
  Blur,
  ImgLoader,
} from '@svg-drawing/img-trace'

const IMAGE_LIST = [
  '/img_trace/cat.jpg',
  '/img_trace/harinezumi.jpg',
  '/img_trace/kuma.jpg',
  '/img_trace/panda.png',
  '/img_trace/risu.jpg',
  '/img_trace/tanuki.jpg',
]

const GRAYSCALE_PALETTE = [
  { r: 0, g: 0, b: 0, a: 255 },
  { r: 50, g: 50, b: 50, a: 255 },
  { r: 100, g: 100, b: 100, a: 255 },
  { r: 150, g: 150, b: 150, a: 255 },
  { r: 200, g: 200, b: 200, a: 255 },
]
export default () => {
  const [list, setList] = useState(IMAGE_LIST)
  const [palettes, setPalettes] = useState<Rgba[]>(GRAYSCALE_PALETTE)
  const [imageData, setImageData] = useState<ImageData>()
  const [paletteOption] = useState({
    numberOfColors: 8,
    colorQuantCycles: 3,
  })
  const [blurOption] = useState({ radius: 20, delta: 0 })
  const [traceOption] = useState({})
  const [imageUrl, setImageUrl] = useState(IMAGE_LIST[0])
  const [inputUrl, setInputUrl] = useState('')
  const imgRef: RefObject<HTMLImageElement> = useRef(null)
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null)
  const renderRef = useRef<HTMLDivElement>(null)
  const handleInputUrl = useCallback(
    (e: ChangeEvent<any>) => {
      setInputUrl(e.target.value)
    },
    [setInputUrl]
  )

  const createPalette = useCallback(() => {
    if (!imageData) return
    setPalettes(Palette.imageData(imageData, paletteOption))
  }, [paletteOption, setPalettes, imageData])

  const resetPalette = useCallback(() => {
    setPalettes(GRAYSCALE_PALETTE)
  }, [setPalettes])

  const deleteColor = useCallback(
    (di: number) => () => {
      const update = palettes.filter((_p, i) => i !== di)
      setPalettes(update)
    },
    [setPalettes, palettes]
  )
  const traceImage = useCallback(() => {
    if (!imageData) return
    const trace = new ImgTrace({ ...traceOption, palettes })
    const svg = trace.load(imageData)
    if (trace.palettes) setPalettes(trace.palettes)
    if (!renderRef.current) return
    const render = new Renderer(renderRef.current)
    render.copy(svg)
    render.update()
    // renderRef.current.innerHTML = svg.toElement().outerHTML
  }, [imageData, palettes, traceOption])

  const blurImage = useCallback(() => {
    if (!imageData) return
    const blurImage = new Blur(blurOption).apply(imageData)
    setImageData(blurImage)
    if (canvasRef.current) {
      canvasRef.current.width = blurImage.width
      canvasRef.current.height = blurImage.height

      const ctx = canvasRef.current.getContext('2d')
      ctx?.putImageData(
        blurImage,
        0,
        0,
        0,
        0,
        blurImage.width,
        blurImage.height
      )
    }
  }, [imageData, blurOption])
  const handleSelect = useCallback(
    (url: string) => () => {
      setImageUrl(url)
      if (!list.includes(url)) {
        setList([...list, url])
      }
    },
    [setImageUrl, list]
  )

  useEffect(() => {
    if (!imgRef.current) return
    imgRef.current.onload = () => {
      if (!imgRef.current) return
      new ImgLoader({ corsenabled: true }).fromImageElement(
        imgRef.current,
        setImageData
      )
    }
  }, [setImageData])
  return (
    <>
      <div
        style={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap' }}
      >
        <ul>
          <li>
            <input
              type="text"
              placeholder="input image url"
              value={inputUrl}
              onChange={handleInputUrl}
            />
            <button onClick={handleSelect(inputUrl)}>Load image url</button>
          </li>
          {list.map((l, i) => (
            <li style={{ cursor: 'pointer' }} key={i}>
              <div onClick={handleSelect(l)}>{l}</div>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={createPalette}>Load Image Palette!</button>
          <button onClick={resetPalette}>GrayScale Palette!</button>
          <div
            style={{
              display: 'flex',
              justifyContent: 'start',
              padding: '2px 0',
            }}
          >
            {palettes
              .sort((p1: Rgba, p2: Rgba) =>
                p1.r + p1.g + p1.b > p2.r + p2.g + p2.b ? -1 : 1
              )
              .map((pal: Rgba, i) => (
                <div
                  key={i}
                  style={{
                    width: 30,
                    height: 30,
                    margin: 2,
                    position: 'relative',
                    backgroundColor: `rgba(${pal.r}, ${pal.g}, ${pal.b}, ${
                      pal.a / 255
                    })`,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      background: '#fff',
                      bottom: 2,
                      left: 2,
                      width: 8,
                      lineHeight: '8px',
                      textAlign: 'center',
                      fontSize: 3,
                      cursor: 'pointer',
                    }}
                    onMouseUp={deleteColor(i)}
                  >
                    x
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <button onClick={blurImage}>Blur Image!</button>
      <button onClick={traceImage}>Image Trace!</button>
      <div
        style={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap' }}
      >
        <div style={{ width: '30vw' }}>
          <img
            style={{ maxWidth: '100%' }}
            ref={imgRef}
            crossOrigin="anonymous"
            src={imageUrl}
            alt=""
          />
        </div>
        <div style={{ width: '30vw' }}>
          <canvas style={{ width: '100%' }} ref={canvasRef} />
        </div>
        <div style={{ width: '30vw' }} ref={renderRef}></div>
      </div>
    </>
  )
}
