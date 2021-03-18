import { useEffect, useCallback, useState, ChangeEvent } from 'react'
import { NextPage } from 'next'
import { useSvgDrawing } from '@svg-drawing/react'
import { Box, Flex, Button, Text } from 'rebass/styled-components'
import { Input, Checkbox, Label, Slider } from '@rebass/forms/styled-components'
import Layout from '../../components/Layout'
import { download } from '@svg-drawing/core'

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
const DrawingDemo: NextPage<Props> = ({ isSp }) => {
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
    (extension: 'png' | 'jpg' | 'svg') => (
      e: React.MouseEvent<HTMLElement>
    ) => {
      draw.download({ extension })
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

  // TODO: improve UI
  // const clickOff = useCallback(() => {
  //   if (!draw.instance) return
  //   draw.instance.off()
  // }, [draw])
  // const clickOn = useCallback(() => {
  //   if (!draw.instance) return
  //   draw.instance.on()
  // }, [draw])

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
          if (!draw.instance.current) return
          draw.instance.current.svg.parseSVGString(svgxml)
          draw.instance.current.update()
        }
      }
      if (!e.target?.files) return
      reader.readAsDataURL(e.target.files[0])
    },
    [draw]
  )
  return (
    <Layout>
      <Box as="fieldset">
        <Flex flexWrap="wrap">
          <Box width={[1, 1 / 2, 1 / 2]} pr={3}>
            <Flex alignItems="center">
              <Label fontSize={[2, 1, 1]} width={3 / 10} htmlFor="strokeWidth">
                STROKE WIDTH:
              </Label>
              <Slider
                width={5 / 10}
                min="1"
                max="20"
                step="1"
                value={penWidth}
                onChange={handlePenWidth}
              />
              <Input
                width="auto"
                id="strokeWidth"
                type="number"
                min="1"
                max="20"
                step="1"
                value={penWidth}
                onChange={handlePenWidth}
              />
            </Flex>
            <Flex alignItems="center">
              <Label
                width={3 / 10}
                fontSize={[2, 1, 1]}
                htmlFor="throttleDelay"
              >
                THROTTLE DELAY:
              </Label>
              <Slider
                width={5 / 10}
                type="range"
                min="0"
                max="300"
                step="5"
                value={delay}
                onChange={handleChangeDelay}
              />
              <Input
                width="auto"
                id="throttleDelay"
                type="number"
                min="0"
                max="300"
                step="5"
                value={delay}
                onChange={handleChangeDelay}
              />
            </Flex>
            <Flex pt={3} justifyContent="start">
              <Label htmlFor="curve">
                <Checkbox
                  id="curve"
                  checked={curve}
                  onChange={handleChangeCiruler}
                />
                Curve
              </Label>
              {!rainbowPen && (
                <Label htmlFor="close">
                  <Checkbox
                    id="close"
                    checked={close}
                    onChange={handleChangeClose}
                  />
                  Close
                </Label>
              )}
              <Label htmlFor="rainbow">
                <Checkbox
                  id="rainbow"
                  checked={rainbowPen}
                  onChange={handleChangeRainbowPen}
                />
                Rainbow pen
              </Label>
            </Flex>
          </Box>
          {!rainbowPen && (
            <Box width={[1, 1 / 2, 1 / 2]}>
              <Label fontSize={0} htmlFor="fill">
                FILL:
                <Input
                  p={1}
                  fontSize={0}
                  id="fill"
                  type="text"
                  placeholder="#000 or black or rgba(0,0,0,1)"
                  value={fill}
                  onChange={handleChangeFill}
                />
              </Label>
              <Flex flexWrap="wrap">
                {colorList.map((col: string) => (
                  <Box
                    key={col}
                    width={['24px', '24px', '20px']}
                    height={['24px', '24px', '20px']}
                    style={{
                      display: 'inline-block',
                      backgroundColor: col,
                      border:
                        col === fill ? '2px solid #000' : '2px solid #999',
                    }}
                    onClick={handleClickFill(col)}
                  />
                ))}
              </Flex>
              <Label
                fontSize={0}
                htmlFor="penColor"
                style={{ whiteSpace: 'nowrap' }}
              >
                PEN COLOR:
                <Input
                  fontSize={0}
                  p={1}
                  id="penColor"
                  type="text"
                  placeholder="#000 or black or rgba(0,0,0,1)"
                  value={penColor}
                  onChange={handleChangePenColor}
                />
              </Label>
              <Flex flexWrap="wrap">
                {colorList.map((col: string) => (
                  <Box
                    key={col}
                    width={['24px', '24px', '20px']}
                    height={['24px', '24px', '20px']}
                    bg={col}
                    style={{
                      border:
                        col === penColor ? '2px solid #000' : '2px solid #999',
                    }}
                    onClick={handleClickPenColor(col)}
                  />
                ))}
              </Flex>
            </Box>
          )}
        </Flex>
      </Box>
      <Box as="fieldset">
        <Flex flexWrap="wrap" justifyContent="start">
          <Box mr={2}>
            <Button mr={1} mb={1} onClick={clickClear}>
              Clear
            </Button>
            <Button mr={1} mb={1} onClick={clickUndo}>
              Undo
            </Button>
            <Button
              variant="secondary"
              mr={1}
              mb={1}
              onClick={clickDownload('png')}
            >
              Download PNG
            </Button>
            <Button
              variant="secondary"
              mr={1}
              mb={1}
              onClick={clickDownload('jpg')}
            >
              Download JPG
            </Button>
            {/* <button onClick={clickDownloadGIF}>Download GIF</button> */}
            <Button
              variant="secondary"
              mr={1}
              mb={1}
              onClick={clickDownload('svg')}
            >
              Download SVG
            </Button>
          </Box>
          {!isSp && (
            <Box width="auto">
              <Text fontSize={0}>
                Svg exported by this library can be read.
              </Text>
              <Input
                type="file"
                onChange={handleFiles}
                multiple
                accept="image/*"
              />
            </Box>
          )}
        </Flex>
      </Box>
      <Box width={['96vw', '96vw', '40vw']} height={['96vw', '96vw', '40vw']}>
        <div
          ref={divRef}
          style={{
            backgroundImage: lattice(size),
            backgroundSize: `${size}px ${size}px`,
            border: '1px solid #333',
            margin: '0 auto 0 0',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
    </Layout>
  )
}

DrawingDemo.getInitialProps = ({ req }) => {
  const ua = req ? req.headers['user-agent'] : navigator.userAgent
  return {
    isSp: ua ? /iPhone|Android.+Mobile/.test(ua) : true,
  }
}

export default DrawingDemo
