import { Input, Checkbox, Label, Slider } from '@rebass/forms/styled-components'
import { DrawFrame, AnimationObject } from '@svg-drawing/animation'
import {
  download,
  PenHandler,
  PencilHandler,
  PathAttributes,
  ResizeCallback,
  EditSvgObject,
} from '@svg-drawing/core'
import {
  useDraw,
  useEdit,
  useSvg,
  Svg,
  EditSvg,
  AnimateSvg,
  useDrawEventHandler,
  useParseFile,
  useKeyboardBind,
  useDrawFactory,
  useResize,
  useAnimation,
} from '@svg-drawing/react'
import { NextPage } from 'next'
import {
  useCallback,
  useState,
  ChangeEventHandler,
  useMemo,
  useRef,
} from 'react'
import { Box, Flex, Button, Text } from 'rebass/styled-components'
import Layout from '../../components/Layout'

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

const bgBoxSize = 30
const bgStyle = `
  repeating-linear-gradient(
    90deg,
    #ddd ,
    #ddd 1px,
    transparent 1px,
    transparent ${String(bgBoxSize)}px
  ),
  repeating-linear-gradient(
    0deg,
    #ddd ,
    #ddd 1px,
    transparent 1px,
    transparent ${String(bgBoxSize)}px
  ), ${String(bgBoxSize)}px ${String(bgBoxSize)}px
`
interface Props {
  isSp: boolean
}

type DrawHandlerType = 'pen' | 'pencil'

type Mode = 'edit' | 'draw'

const DrawingDemo: NextPage<Props> = ({ isSp }) => {
  const targetRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<Mode>('draw')
  const [type, changeType] = useState<DrawHandlerType>('pencil')
  const [drawActive, setDrawActive] = useState(true)
  /** PathOptions */
  const [pathOptions, setPathOptions] = useState<PathAttributes>({
    fill: 'none',
    stroke: 'black',
    strokeWidth: '5',
  })

  /** CommandConverter */
  const [curve, switchCurve] = useState(true)
  const [close, switchClose] = useState(false)
  const factory = useDrawFactory(pathOptions, { curve, close })

  /** Setup draw */
  const pencilHandler = useDrawEventHandler(
    targetRef,
    PencilHandler,
    drawActive && mode === 'draw' && type === 'pencil'
  )

  const penHandler = useDrawEventHandler(
    targetRef,
    PenHandler,
    drawActive && mode === 'draw' && type === 'pen'
  )

  const handler = useMemo(() => {
    switch (type) {
      case 'pen':
        return penHandler
      case 'pencil':
      default:
        return pencilHandler
    }
  }, [penHandler, pencilHandler, type])

  const svg = useSvg({})
  const [svgProps, onChangeSvg] = useState(svg.toJson())

  const {
    draw,
    update: updateDraw,
    clear,
    undo,
  } = useDraw({
    handler,
    factory,
    svg,
    onChangeSvg,
  })

  /** Setup edit */

  const [editSvgObject, onChangeEdit] = useState<EditSvgObject | null>(null)
  const {
    keyboardMap,
    editSvgProps,
    update: updateEdit,
    changeAttributes,
    cancelSelect,
  } = useEdit({
    svg,
    editSvgObject,
    onChangeEdit,
    onChangeSvg,
  })

  const clickDownload = useCallback(
    (extension: 'png' | 'jpg' | 'svg') => (e: React.MouseEvent<HTMLElement>) => {
      download(svg, {
        extension,
      })
    },
    [svg]
  )

  /** Setup animation */
  const [animateObj, setAnimateObj] = useState<AnimationObject | null>(null)
  const animation = useAnimation({ onChangeAnimation: setAnimateObj })

  const handleClickAnimation = useCallback(() => {
    const drawFrame = new DrawFrame(svg.paths)
    animation.setup(drawFrame)
    animation.update(svg.paths)
    updateEdit()
  }, [animation, svg.paths, updateEdit])

  /** Setup resize */
  const handleResize = useCallback<ResizeCallback>(
    (arg) => {
      console.log(arg)
      svg.resize(arg)

      console.log(svg)
      updateDraw()
      updateEdit()
    },
    [svg, updateDraw, updateEdit]
  )

  useResize(targetRef, handleResize)

  /** Setup keyboardBind */
  useKeyboardBind?.(keyboardMap)

  const handleChangeCurve = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      switchCurve(ev.target.checked)
    },
    []
  )

  const handleChangeClose = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (ev) => {
      switchClose(ev.target.checked)
    },
    []
  )

  const handlePenWidth = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const num = e.target.valueAsNumber
      if (Number.isNaN(num)) return

      setPathOptions((opts) => ({
        ...opts,
        strokeWidth: `${num}`,
      }))
      changeAttributes({
        strokeWidth: num + '',
      })
    },
    [changeAttributes]
  )

  const handleChangePenColor = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      setPathOptions((opts) => ({
        ...opts,
        stroke: e.target.value,
      }))
      changeAttributes({
        stroke: e.target.value,
      })
    },
    [changeAttributes]
  )

  const handleClickPenColor = useCallback(
    (col: string) => () => {
      setPathOptions((opts) => ({
        ...opts,
        stroke: col,
      }))
      changeAttributes({
        stroke: col,
      })
    },
    [changeAttributes]
  )

  const handleChangeFill = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      setPathOptions((opts) => ({
        ...opts,
        fill: e.target.value,
      }))
      changeAttributes({
        fill: e.target.value,
      })
    },
    [changeAttributes]
  )

  const handleClickFill = useCallback(
    (col: string) => () => {
      setPathOptions((opts) => ({
        ...opts,
        fill: col,
      }))
      changeAttributes({
        fill: col,
      })
    },
    [changeAttributes]
  )

  const parseFile = useParseFile({
    svg,
  })

  const handleFiles = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (e) => {
      if (!e.target?.files) return
      await parseFile(e.target.files[0])
      updateDraw()
      updateEdit()
    },
    [parseFile, updateDraw, updateEdit]
  )

  const handleChangeType = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (ev) => {
      const isDrawMode = (str: any): str is DrawHandlerType =>
        ['pen', 'pencil'].includes(str)
      const upd = ev.target.value
      if (isDrawMode(upd)) {
        changeType(upd)
      }
    },
    [changeType]
  )

  const handleChangeMode = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (ev) => {
      const isDrawMode = (str: any): str is Mode =>
        ['edit', 'draw'].includes(str)
      const upd = ev.target.value
      if (isDrawMode(upd)) {
        updateDraw()
        updateEdit()
        setMode(upd)
      }
    },
    [updateDraw, updateEdit]
  )

  return (
    <Layout>
      <Box as="fieldset">
        <Label htmlFor="mode">
          <Text fontSize={0}>Mode</Text>
          <select
            id="mode"
            value={mode}
            onBlur={() => undefined}
            onChange={handleChangeMode}
          >
            <option value="draw">draw</option>
            <option value="edit">edit</option>
          </select>
        </Label>
        {mode === 'draw' && (
          <Flex pt={3} justifyContent="start">
            <Label htmlFor="curve">
              <Checkbox
                id="curve"
                checked={curve}
                onChange={handleChangeCurve}
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
            <Label htmlFor="type">
              <select
                id="type"
                value={type}
                onBlur={() => undefined}
                onChange={handleChangeType}
              >
                <option value="pen">Pen</option>
                <option value="pencil">Pencil</option>
              </select>
            </Label>
            <Button mr={1} mb={1} onClick={undo}>
              Undo
            </Button>
            <Button
              mr={1}
              mb={1}
              onClick={() => setDrawActive((active) => !active)}
            >
              {drawActive ? 'Off' : 'On'}
            </Button>
            <Button mr={1} mb={1} onClick={clear}>
              Clear
            </Button>
          </Flex>
        )}
        {mode === 'edit' && (
          <Flex pt={3} justifyContent="start">
            <Button mr={1} mb={1} onClick={cancelSelect}>
              Cancel
            </Button>
            <Button mr={1} mb={1} onClick={clear}>
              Clear
            </Button>
          </Flex>
        )}
        <Button onClick={handleClickAnimation}>Animation</Button>
      </Box>
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
        </Flex>
        {!isSp && (
          <Label width="auto">
            <Text fontSize={0}>Svg exported by this library can be read.</Text>
            <Input
              type="file"
              onChange={handleFiles}
              multiple
              accept="image/*"
            />
          </Label>
        )}
      </Box>
      <Box width={['96vw', '96vw', '40vw']} height={['96vw', '96vw', '40vw']}>
        <div
          ref={targetRef}
          style={{
            background: bgStyle,
            border: '1px solid #333',
            margin: '0 auto 0 0',
            width: '100%',
            height: '100%',
            touchAction: 'none',
            boxSizing: 'border-box',
          }}
        >
          {mode === 'draw' ? (
            <Svg {...svgProps} />
          ) : (
            <EditSvg {...svgProps} {...editSvgProps} />
          )}
        </div>
      </Box>
      <AnimateSvg animatePaths={animateObj ?? undefined} {...svgProps} />
      <div>{JSON.stringify(editSvgProps.boundingBox)}</div>
      <div>{JSON.stringify(animateObj)}</div>
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
