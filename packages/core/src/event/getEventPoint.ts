import type { EventPoint } from '../types'

export const SUPPORT_POINTER_EVENT = typeof PointerEvent !== 'undefined'

export const SUPPORT_ON_TOUCH_START = typeof ontouchstart !== 'undefined'

export const SUPPORT_EVENT_LISTENER_PASSIVE_OPTION = (() => {
  try {
    const check = () => null
    addEventListener('testPassive', check, { passive: true })
    removeEventListener('testPassive', check)
    return true
  } catch (e) {
    return false
  }
})()

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
