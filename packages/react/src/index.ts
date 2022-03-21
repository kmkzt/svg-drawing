export { Svg } from './components/Svg'
export { Paths } from './components/Paths'
export { EditPaths, EditBoundingBox } from './components/Edit'
export { AnimatePaths } from './components/Animate'
export { BackgroundRect } from './components/BackgroundRect'

export { useDraw } from './hooks/useDraw'
export {
  useDrawEventHandler,
  useSetupHandler,
  usePenHandler,
  usePencilHandler,
} from './hooks/useDrawEventHandler'
export { useDrawFactory } from './hooks/useDrawFactory'
export { useEdit } from './hooks/useEdit'
export { useSvg } from './hooks/useSvg'
export { useKeyboardBind } from './hooks/useKeyboardBind'
export { usePressedKey } from './hooks/usePressedKey'
export { useParseFile } from './hooks/useParseFile'
export { useAnimation } from './hooks/useAnimation'
export { useResize } from './hooks/useResize'
export { useRenderInterval } from './hooks/useRenderInterval'

export * from './types'
