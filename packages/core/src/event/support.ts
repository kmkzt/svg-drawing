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
