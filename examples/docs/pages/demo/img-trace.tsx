import {
  useState,
  useCallback,
  ChangeEvent,
  useRef,
  RefObject,
  useEffect,
} from 'react'
import {
  Box,
  Flex,
  Button,
  Card,
  Image,
  Heading,
} from 'rebass/styled-components'
import { Input } from '@rebass/forms/styled-components'
import { Renderer, Svg, download } from '@ranklab/svg-drawing-core'
import {
  ImgTrace,
  Rgba,
  Palette,
  // Blur,
  ImgLoader,
} from '@ranklab/svg-drawing-img-trace'
import Layout from '../../components/Layout'

const IMAGE_LIST = [
  '/img_trace/cat.jpg',
  '/img_trace/harinezumi.jpg',
  '/img_trace/kuma.jpg',
  '/img_trace/panda.png',
  '/img_trace/risu.jpg',
  '/img_trace/tanuki.jpg',
].map((url) =>
  // For gh-pages
  process.env.IS_GH_PAGE === 'true' ? `/svg-drawing${url}` : url
)

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
  // const [blurOption] = useState({ radius: 20, delta: 0 })
  const [traceOption] = useState({})
  const [imageUrl, setImageUrl] = useState(IMAGE_LIST[0])
  const [inputUrl, setInputUrl] = useState('')
  const [svg, setSvg] = useState<Svg>()
  const imgRef: RefObject<HTMLImageElement> = useRef(null)
  // const canvasRef: RefObject<HTMLCanvasElement> = useRef(null)
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
  const traceImage = useCallback(async () => {
    try {
      const imgd =
        imageData ||
        (await new ImgLoader({ corsenabled: true }).fromUrl(imageUrl))
      if (!imageData && imgd) {
        setImageData(imgd)
      }
      if (!imgd) return
      const trace = new ImgTrace({ ...traceOption, palettes })
      const svg = trace.load(imgd)
      setSvg(svg)
      if (trace.palettes) setPalettes(trace.palettes)
    } catch (err) {
      // throw err
    }
  }, [imageUrl, imageData, palettes, traceOption])

  /**
   * Update Svg Render
   */
  useEffect(() => {
    if (!renderRef.current) return
    const renderSvg = () => {
      if (!renderRef.current || !svg) return
      const renderer = new Renderer(renderRef.current)
      const { width, height } = renderRef.current.getBoundingClientRect()
      svg.resize({ width, height })
      renderer.update(svg.toJson())
    }
    renderSvg()
    window.addEventListener('resize', renderSvg)
    return () => window.removeEventListener('resize', renderSvg)
  }, [svg])

  // const blurImage = useCallback(async () => {
  //   try {
  //     const imgd =
  //       imageData ||
  //       (await new ImgLoader({ corsenabled: true }).fromUrl(imageUrl))
  //     if (!imageData && imgd) {
  //       setImageData(imgd)
  //     }
  //     if (!imgd) return
  //     const blurImage = new Blur(blurOption).apply(imgd)
  //     setImageData(blurImage)
  //     if (canvasRef.current) {
  //       canvasRef.current.width = blurImage.width
  //       canvasRef.current.height = blurImage.height

  //       const ctx = canvasRef.current.getContext('2d')
  //       ctx?.putImageData(
  //         blurImage,
  //         0,
  //         0,
  //         0,
  //         0,
  //         blurImage.width,
  //         blurImage.height
  //       )
  //     }
  //   } catch (err) {
  //     // throw err
  //   }
  // }, [imageData, blurOption, imageUrl])
  const handleSelect = useCallback(
    (url: string) => () => {
      setImageUrl(url)
      if (!list.includes(url)) {
        setList([...list, url])
      }
    },
    [setImageUrl, list]
  )

  const handleDownload = useCallback(() => {
    if (!svg) return
    download(svg)
  }, [svg])

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
    <Layout>
      <Flex justifyContent="start" flexWrap="wrap">
        <Box mb={3}>
          <Button mr={2} mb={2} onClick={createPalette}>
            Load Image Palette!
          </Button>
          <Button mr={2} mb={2} onClick={resetPalette}>
            GrayScale Palette!
          </Button>
          <Flex justifyContent="start" py="2px" px="0">
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
                    backgroundColor: `rgba(${pal.r}, ${pal.g}, ${pal.b}, ${pal.a / 255
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
          </Flex>
        </Box>
        <Box mb={3}>
          {/* <Button onClick={blurImage}>Blur Image!</Button> */}
          <Button mr={2} mb={2} variant="secondary" onClick={traceImage}>
            Image Trace!
          </Button>
          {svg && (
            <Button mr={2} mb={2} onClick={handleDownload}>
              Download
            </Button>
          )}
          <Flex justifyContent="start" flexWrap="wrap">
            <Box
              width={['80vw', '80vw', '30vw']}
              height={['80vw', '80vw', '30vw']}
            >
              <Image
                width="100%"
                ref={imgRef}
                crossOrigin="anonymous"
                src={imageUrl}
                alt=""
              />
            </Box>
            {/* <Box style={{ width: '256px', height: '256px' }}>
              <canvas style={{ width: '100%' }} ref={canvasRef} />
            </Box> */}
            <Box
              width={['80vw', '80vw', '30vw']}
              height={['80vw', '80vw', '30vw']}
            >
              <div style={{ width: '100%', height: '100%' }} ref={renderRef} />
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Box as="fieldset">
        <Heading>Select Image</Heading>
        <Box>
          <Input
            type="text"
            placeholder="input image url"
            value={inputUrl}
            onChange={handleInputUrl}
          />
          <Button onClick={handleSelect(inputUrl)}>Load image url</Button>
        </Box>
        <Flex flexWrap="wrap">
          {list.map((l, i) => (
            <Card key={i} width="256px">
              <Image src={l} alt={l} onClick={handleSelect(l)} />
            </Card>
          ))}
        </Flex>
      </Box>
    </Layout>
  )
}
