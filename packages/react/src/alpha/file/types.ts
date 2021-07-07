import { Svg } from '@svg-drawing/core'

export type UseParseFile = (opts: { svg: Svg }) => (file: File) => Promise<void>
