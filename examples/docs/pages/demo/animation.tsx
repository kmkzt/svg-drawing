import { Slider, Input, Label } from '@rebass/forms/styled-components'
import { DrawFrame, AttributeFrame, ShakeFrame } from '@svg-drawing/animation'
import {
  SvgAnimation,
  parseSVGString,
  ResizeHandler,
  Download,
} from '@svg-drawing/core'
import { NextPage } from 'next'
import {
  useEffect,
  useRef,
  useCallback,
  useState,
  ChangeEvent,
  useMemo,
} from 'react'
import { Box, Flex, Button, Text } from 'rebass/styled-components'
import Layout from '../../components/Layout'
import { example } from '../../lib/example-svg'

const size = 30

const colorList = [
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
const attributesList = colorList.map((stroke, i) => ({
  stroke,
  fill: colorList[(i + 4) % colorList.length],
}))

interface Props {
  isSp: boolean
}

const Animation: NextPage<Props> = ({ isSp }) => {
  const aniDivRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<SvgAnimation | null>(null)
  const resizeHandler = useMemo(() => new ResizeHandler(), [])
  const [animMs, setAnimMs] = useState(20)

  const handleChangeAnimMs = useCallback((e: ChangeEvent<any>) => {
    const num = Number(e.target.value)
    if (Number.isNaN(num) || !animationRef.current) return

    animationRef.current.animation.ms = num
    setAnimMs(num)
  }, [])

  // SvgAnimation initialize
  useEffect(() => {
    if (animationRef.current) return
    if (!aniDivRef.current) return

    animationRef.current = SvgAnimation.init(aniDivRef.current, {
      ms: animMs,
      background: '#fff',
    })

    // Setup resizeHandler
    // resizeHandler.setElement(aniDivRef.current)
    // resizeHandler.setHandler(animationRef.current.resize)
    // resizeHandler.on()

    // SET EXAMPLE
    animationRef.current.svg.copy(parseSVGString(example))
    handleDrawingAnimation()
  })

  const handleFiles = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target?.files) return

    const reader = new FileReader()
    reader.onload = function (ev: ProgressEvent<FileReader>) {
      if (
        !ev.target ||
        typeof ev.target.result !== 'string' ||
        !animationRef.current
      )
        return

      const [type, data] = ev.target.result.split(',')
      if (type !== 'data:image/svg+xml;base64') return

      const svgxml = atob(data)
      animationRef.current.svg.copy(parseSVGString(svgxml))
      animationRef.current.start()
    }

    reader.readAsDataURL(e.target.files[0])
  }, [])

  const handleShake = useCallback(() => {
    if (!animationRef.current) return

    animationRef.current.animation.setup(new ShakeFrame(10))
    animationRef.current.start()
  }, [])

  const handleDrawingAnimation = useCallback(() => {
    if (!animationRef.current) return

    animationRef.current.animation.setup(
      new DrawFrame(animationRef.current.svg.paths),
      {
        repeatCount: 1,
      }
    )

    animationRef.current.start()
  }, [])

  const handleColorfulAnimation = useCallback(() => {
    if (!animationRef.current) return

    animationRef.current.animation.setup(new AttributeFrame(attributesList))

    animationRef.current.start()
  }, [])

  const handleStop = useCallback(() => {
    if (!animationRef.current) return

    animationRef.current.stop()
  }, [])

  const handleRestore = useCallback(() => {
    if (!animationRef.current) return

    animationRef.current.restore()
  }, [])

  const handleDownloadAnimation = useCallback(() => {
    if (!animationRef.current) return

    const download = new Download(animationRef.current.toElement())
    download.svg(`${Date.now()}.svg`)
  }, [])

  return (
    <Layout>
      <Box as="fieldset">
        <Flex justifyContent="start" mb={2}>
          <Label width={3 / 10} style={{ whiteSpace: 'nowrap' }}>
            ANIMATION MS:
          </Label>
          <Slider
            width={6 / 10}
            type="range"
            min="0"
            max="500"
            step="5"
            value={animMs}
            onChange={handleChangeAnimMs}
          />
          <Input
            width="auto"
            type="number"
            min="0"
            max="500"
            step="5"
            value={animMs}
            onChange={handleChangeAnimMs}
          />
        </Flex>
        <Flex flexWrap="wrap" justifyContent="start" mb={2}>
          <Box>
            <Button mr={1} mb={1} onClick={handleShake}>
              Shaking
            </Button>
            <Button
              variant="secondary"
              mr={1}
              mb={1}
              onClick={handleDrawingAnimation}
            >
              Drawing
            </Button>
            <Button
              variant="secondary"
              mr={1}
              mb={1}
              onClick={handleColorfulAnimation}
            >
              Colorful
            </Button>
            <Button mr={1} mb={1} onClick={handleStop}>
              Stop
            </Button>
            <Button mr={1} mb={1} onClick={handleRestore}>
              Restore
            </Button>
            <Button
              variant="secondary"
              mr={1}
              mb={1}
              onClick={handleDownloadAnimation}
            >
              Download Anmation SVG
            </Button>
          </Box>
        </Flex>
        <Box>
          <Text>Svg exported by this library can be read.</Text>
          <Input type="file" onChange={handleFiles} multiple accept="image/*" />
        </Box>
      </Box>
      <Box width={['96vw', '96vw', '40vw']} height={['96vw', '96vw', '40vw']}>
        <div
          ref={aniDivRef}
          style={{
            backgroundSize: `${size}px ${size}px`,
            border: '1px solid #333',
            width: '100%',
            height: '100%',
            margin: '0 auto 0 0',
          }}
        />
      </Box>
    </Layout>
  )
}

Animation.getInitialProps = ({ req }) => {
  const ua = req ? req.headers['user-agent'] : navigator.userAgent
  return {
    isSp: ua ? /iPhone|Android.+Mobile/.test(ua) : true,
  }
}

export default Animation
