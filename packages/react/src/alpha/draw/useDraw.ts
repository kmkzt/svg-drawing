import { useCallback, useMemo } from 'react'
import { SvgDrawing } from '@svg-drawing/core'
import { useSvg } from '../svg/useSvg'
import type { UseDraw, DrawAction, KeyboardMap } from '../types'

/**
 * @todo Fix drawHandler type. change to DrawEventHandler
 */
export const useDraw: UseDraw = ({
  pathFactory: pathFactory,
  drawHandler,
  sharedSvg,
}) => {
  const [svgObj, { svg, onUpdate, ...rest }] = useSvg({
    sharedSvg,
  })
  const drawing = useMemo(
    () => new SvgDrawing(svg, pathFactory, drawHandler, onUpdate),
    [pathFactory, drawHandler, onUpdate, svg]
  )

  const onUndoDraw = useCallback<DrawAction['onUndoDraw']>(() => {
    drawing.undo()
  }, [drawing])

  /** @fixme Doesn't work!! */
  const keyboardMap = useMemo<KeyboardMap>(
    () => ({
      ['Escape']: drawing.drawEnd,
    }),
    [drawing.drawEnd]
  )

  return [
    svgObj,
    {
      svg,
      onUndoDraw,
      onUpdate,
      keyboardMap,
      ...rest,
    },
  ]
}
