import {
  BezierCurve,
  closeCommands,
  CreateCommand,
  createLineCommands,
} from '@svg-drawing/core'
import { useMemo } from 'react'
import type { UseCommandsConverterOptions } from '../types'

export const useCommandsConverter = ({
  curve,
  close,
}: UseCommandsConverterOptions) =>
  useMemo<CreateCommand>(() => {
    const converter = curve ? new BezierCurve().create : createLineCommands
    return (po) => (close ? closeCommands(converter(po)) : converter(po))
  }, [close, curve])
