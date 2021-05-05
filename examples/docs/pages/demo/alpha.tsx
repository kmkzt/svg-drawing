import { useCallback, useState, ChangeEvent, useMemo, useEffect } from 'react'
import { NextPage } from 'next'
import {
  useDraw,
  useEdit,
  Svg,
  EditSvg,
  useDrawHandler,
  useCommandsConverter,
  DrawHandlerMap,
  usePathOptions,
} from '@svg-drawing/react'
import { download, PenHandler, PencilHandler } from '@svg-drawing/core'
import { Box, Flex, Button, Text } from 'rebass/styled-components'
import {
  Input,
  Checkbox,
  Label,
  Slider,
  Select,
} from '@rebass/forms/styled-components'
import Layout from '../../components/Layout'

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

type DrawHandlerType = 'pen' | 'pencil'
const drawHandlerMap: DrawHandlerMap<DrawHandlerType> = {
  pencil: PencilHandler,
  pen: PenHandler,
} as const
const DrawingDemo: NextPage<Props> = ({ isSp }) => {
  /**
   * pathOptions
   */
  const [
    pathOptions,
    { changeStrokeWidth, changeFill, changeStroke },
  ] = usePathOptions({
    fill: 'none',
    stroke: 'black',
    strokeWidth: '5',
  })

  /**
   * drawHandler
   */
  const [type, changeType] = useState<DrawHandlerType>('pencil')
  const drawHandler = useDrawHandler(drawHandlerMap, type)

  /**
   * commandConverter
   */
  const [curve, switchCurve] = useState(true)
  const [close, switchClose] = useState(false)
  const commandsConverter = useCommandsConverter({ curve, close })

  /**
   * Setup draw
   */
  const [drawElRef, svgObj, draw] = useDraw<HTMLDivElement>({
    pathOptions,
    drawHandler,
    commandsConverter,
  })

  /**
   * Setup edit
   */
  const [
    editElRef,
    editSvgObj,
    { editing, edit, select, move, cancel, update, svg: editSvg },
  ] = useEdit<HTMLDivElement>({
    sharedSvg: draw.svg,
  })
  const clickDownload = useCallback(
    (extension: 'png' | 'jpg' | 'svg') => (
      e: React.MouseEvent<HTMLElement>
    ) => {
      download(draw.svg, {
        extension,
      })
    },
    [draw]
  )

  const handleChangeCiruler = useCallback(() => {
    switchCurve((curve) => !curve)
  }, [])

  const handleChangeClose = useCallback(() => {
    switchClose((close) => !close)
  }, [])

  const handlePenWidth = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const num = e.target.valueAsNumber
      if (Number.isNaN(num)) return
      changeStrokeWidth(num)
      edit({
        strokeWidth: num + '',
      })
    },
    [changeStrokeWidth, edit]
  )

  const handleChangePenColor = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeStroke(e.target.value)
      edit({
        stroke: e.target.value,
      })
    },
    [changeStroke, edit]
  )

  const handleClickPenColor = useCallback(
    (col: string) => () => {
      changeStroke(col)
      edit({
        stroke: col,
      })
    },
    [changeStroke, edit]
  )

  const handleChangeFill = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      changeFill(e.target.value)
      edit({
        fill: e.target.value,
      })
    },
    [changeFill, edit]
  )

  const handleClickFill = useCallback(
    (col: string) => () => {
      changeFill(col)
      edit({
        fill: col,
      })
    },
    [changeFill, edit]
  )

  const handleFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const reader = new FileReader()
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (!ev.target || typeof ev.target.result !== 'string') return
        const [type, data] = ev.target.result.split(',')
        if (type === 'data:image/svg+xml;base64') {
          const svgxml = atob(data)
          draw.svg.parseSVGString(svgxml)
          draw.update()
        }
      }
      if (!e.target?.files) return
      reader.readAsDataURL(e.target.files[0])
    },
    [draw]
  )

  const handleChangeMode = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const isDrawMode = (str: any): str is 'pencil' | 'pen' =>
        ['pen', 'pencil'].includes(str)
      const upd = ev.target.value
      if (isDrawMode(upd)) {
        changeType(upd)
      }
    },
    [changeType]
  )

  useEffect(() => {
    // console.log(draw.draw)
    update()
  }, [draw])

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
                value={pathOptions.strokeWidth}
                onChange={handlePenWidth}
              />
              <Input
                width="auto"
                id="strokeWidth"
                type="number"
                min="1"
                max="20"
                step="1"
                value={pathOptions.strokeWidth}
                onChange={handlePenWidth}
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
              <Label htmlFor="close">
                <Checkbox
                  id="close"
                  checked={close}
                  onChange={handleChangeClose}
                />
                Close
              </Label>
              <Label htmlFor="mode">
                <Select id="mode" value={type} onChange={handleChangeMode}>
                  <option value="pen">Pen</option>
                  <option value="pencil">Pencil</option>
                </Select>
              </Label>
            </Flex>
          </Box>
          <Box width={[1, 1 / 2, 1 / 2]}>
            <Label fontSize={0} htmlFor="fill">
              FILL:
              <Input
                p={1}
                fontSize={0}
                id="fill"
                type="text"
                placeholder="#000 or black or rgba(0,0,0,1)"
                value={pathOptions.fill}
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
                      col === pathOptions.fill
                        ? '2px solid #000'
                        : '2px solid #999',
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
                value={pathOptions.stroke}
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
                      col === pathOptions.stroke
                        ? '2px solid #000'
                        : '2px solid #999',
                  }}
                  onClick={handleClickPenColor(col)}
                />
              ))}
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box as="fieldset">
        <Flex flexWrap="wrap" justifyContent="start">
          <Box mr={2}>
            <Button mr={1} mb={1} onClick={draw.clear}>
              Clear
            </Button>
            <Button mr={1} mb={1} onClick={draw.undo}>
              Undo
            </Button>
            <Button mr={1} mb={1} onClick={draw.on}>
              On
            </Button>
            <Button mr={1} mb={1} onClick={draw.off}>
              Off
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
          ref={drawElRef}
          style={{
            backgroundImage: lattice(size),
            backgroundSize: `${size}px ${size}px`,
            border: '1px solid #333',
            margin: '0 auto 0 0',
            width: '100%',
            height: '100%',
            touchAction: 'none',
          }}
        >
          <Svg {...svgObj} />
        </div>
      </Box>
      <Box width={['96vw', '96vw', '40vw']} height={['96vw', '96vw', '40vw']}>
        <div
          ref={editElRef}
          style={{
            backgroundImage: lattice(size),
            backgroundSize: `${size}px ${size}px`,
            border: '1px solid #333',
            margin: '0 auto 0 0',
            width: '100%',
            height: '100%',
            touchAction: 'none',
          }}
        >
          <EditSvg
            {...editSvgObj}
            editing={editing}
            onSelect={select}
            onMove={move}
          />
        </div>
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
