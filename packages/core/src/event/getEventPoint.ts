import type { EventPoint, PointObject } from '../types'

export const getEventPoint = (
  ev: MouseEvent | TouchEvent | PointerEvent,
  offset: PointObject = { x: 0, y: 0 }
): EventPoint => {
  if ('touches' in ev) {
    const touche = ev.touches.length ? ev.touches[0] : ev.changedTouches[0]
    return {
      x: touche.clientX - offset.x,
      y: touche.clientY - offset.y,
      pressure: touche.force,
    }
  }

  return {
    x: ev.clientX - offset.x,
    y: ev.clientY - offset.y,
    pressure: 'pressure' in ev ? ev.pressure : undefined,
  }
}
