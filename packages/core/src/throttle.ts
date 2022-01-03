/**
 * @example
 *   const handleMouseMove = throttle(
 *     (ev) => console.log(ev.target.clientX, ev.target.clientY),
 *     50
 *   )
 *
 *   window.addEventListener('onmousemove', handleMouseMove)
 */
export function throttle<T extends (...args: any) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => ReturnType<T> | null {
  let context: any | null
  let args: any | null
  let result: ReturnType<T> | null
  let timeout: any | null = null
  let previous = 0

  const later = (): void => {
    previous = Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) {
      context = null
      args = null
    }
  }

  return function wrap(
    this: typeof func,
    ...wrapArg: Parameters<T>
  ): ReturnType<T> | null {
    const now = Date.now()
    const remaining = wait - (now - previous)
    context = this
    args = wrapArg
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) {
        context = null
        args = null
      }
    } else if (!timeout) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
