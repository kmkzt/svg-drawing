import { useEffect, useRef, useCallback, useState, ChangeEvent } from 'react'
import { NextPage } from 'next'
import { Command, Point } from '@svg-drawing/core'
import { SvgAnimation, FrameAnimation } from '@svg-drawing/animation'
import Layout from '../components/Layout'

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
const Top: NextPage<Props> = ({ isSp }) => {
  const [CANVAS_SIZE] = useState(isSp ? '98vw' : '49vw')
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
  })

  const handleFiles = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    reader.onload = function (ev: ProgressEvent<FileReader>) {
      if (!ev.target || typeof ev.target.result !== 'string') return
      const [type, data] = ev.target.result.split(',')
      if (type === 'data:image/svg+xml;base64') {
        const svgxml = atob(data)
        if (!animationRef.current) return
        animationRef.current.parseSVGString(svgxml)
        animationRef.current.update()
      }
    }
    if (!e.target?.files) return
    reader.readAsDataURL(e.target.files[0])
  }, [])
  const handleClickShake = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.setAnimation(shake, {
      frames: 3,
    })
    animationRef.current.start()
  }, [])
  const handleClickDrawingAnimation = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.setAnimation(drawingAnimation, {
      repeatCount: 1,
    })
    animationRef.current.start()
  }, [])
  const handleClickColorfulAnimation = useCallback(() => {
    if (!animationRef.current) return
    animationRef.current.setAnimation(colorfulAnimation, {
      frames: colorfulList.length,
    })
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
  return (
    <Layout>
      <fieldset>
        <h3>Animation methods</h3>
        <button onClick={handleClickShake}>Shaking</button>
        <button onClick={handleClickDrawingAnimation}>Drawing</button>
        <button onClick={handleClickColorfulAnimation}>Colorful</button>
        <button onClick={handleClickStop}>Stop</button>
        <button onClick={handleClickRestore}>Restore</button>
        <button onClick={handleDownloadAnimation}>Download Anmation SVG</button>
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
        <h3>Load Svg files</h3>
        <p>Svg exported by this library can be read.</p>
        <input type="file" onChange={handleFiles} multiple accept="image/*" />
      </fieldset>
      <div
        ref={aniDivRef}
        style={{
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
