import { useEffect, useRef, useCallback, useState, ChangeEvent } from 'react'
import { NextPage } from 'next'
import { Box, Flex, Button, Text } from 'rebass/styled-components'
import { Slider, Input, Label } from '@rebass/forms/styled-components'
import { Command, Point } from '@svg-drawing/core'
import { SvgAnimation, FrameAnimation } from '@svg-drawing/animation'
import Layout from '../../components/Layout'
import { example } from '../../lib/example-svg'
const size = 30
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
  if (!fid) return paths
  for (let i = 0; i < paths.length; i += 1) {
    paths[i].attrs.stroke = colorfulList[fid % colorfulList.length]
    paths[i].attrs.fill = colorfulList[(fid + 4) % colorfulList.length]
  }
  return paths
}

const drawingAnimation: FrameAnimation = (paths, fid) => {
  if (!fid) return paths
  const update = []
  for (let i = 0; i < paths.length; i += 1) {
    if (fid < paths[i].commands.length) {
      paths[i].commands = paths[i].commands.slice(0, fid)
      update.push(paths[i])
      break
    }
    fid -= paths[i].commands.length
    update.push(paths[i])
  }
  return update
}

interface Props {
  isSp: boolean
}
const Animation: NextPage<Props> = ({ isSp }) => {
  const aniDivRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<SvgAnimation | null>(null)
  const [animMs, setAnimMs] = useState(20)

  const handleChangeAnimMs = useCallback((e: ChangeEvent<any>) => {
    if (!animationRef.current) return
    const num = Number(e.target.value)
    if (Number.isNaN(num)) return
    animationRef.current.ms = num
    setAnimMs(num)
  }, [])

  useEffect(() => {
    if (animationRef.current) return
    if (!aniDivRef.current) return
    animationRef.current = new SvgAnimation(aniDivRef.current, {
      ms: animMs,
      background: '#fff',
    })

    // SET EXAMPLE
    animationRef.current.svg.parseSVGString(example)
    handleDrawingAnimation()
  })

  const handleFiles = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = function (ev: ProgressEvent<FileReader>) {
      if (!ev.target || typeof ev.target.result !== 'string') return
      const [type, data] = ev.target.result.split(',')
      if (type === 'data:image/svg+xml;base64') {
        const svgxml = atob(data)
        if (!animationRef.current) return
        animationRef.current.svg.parseSVGString(svgxml)
        animationRef.current.update()
      }
    }
    if (!e.target?.files) return
    reader.readAsDataURL(e.target.files[0])
  }, [])
  const handleShake = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.setAnimation(shake, {
      frames: 3,
    })
    animationRef.current.start()
  }, [])
  const handleDrawingAnimation = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.setAnimation(drawingAnimation, {
      repeatCount: 1,
    })
    animationRef.current.start()
  }, [])
  const handleColorfulAnimation = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.setAnimation(colorfulAnimation, {
      frames: colorfulList.length,
    })
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
    animationRef.current.download()
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
