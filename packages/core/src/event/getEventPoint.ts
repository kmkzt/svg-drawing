import type { EventPoint } from '../types'

export const getEventPoint = (
  ev: MouseEvent | TouchEvent | PointerEvent
): EventPoint => {
  if ('touches' in ev) {
    const touche = ev.touches.length ? ev.touches[0] : ev.changedTouches[0]
    return {
      x: touche.clientX,
      y: touche.clientY,
      pressure: touche.force,
    }
  }

  return {
    x: ev.clientX,
    y: ev.clientY,
    pressure: 'pressure' in ev ? ev.pressure : undefined,
  }
}
