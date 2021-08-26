import {
  BezierCurve,
  closeCommands,
  CommandsConverter,
  convertLineCommands,
} from '@svg-drawing/core'
import { useMemo } from 'react'
import { UseCommandsConverterOptions } from '../types'

export const useCommandsConverter = ({
  curve,
  close,
}: UseCommandsConverterOptions) =>
  useMemo<CommandsConverter>(() => {
    const converter = curve ? new BezierCurve().convert : convertLineCommands
    return (po) => (close ? closeCommands(converter(po)) : converter(po))
  }, [close, curve])
