import { useEffect } from 'react'
import type { KeyboardMap } from '../types'

export const useKeyboardBind = (keyboardMap: KeyboardMap = {}) => {
  useEffect(() => {
    const handleKeyboardEvent = (ev: KeyboardEvent) => {
      const fn = keyboardMap[ev.key]
      if (typeof fn !== 'function') return
      fn()
    }
    addEventListener('keydown', handleKeyboardEvent)
    return () => {
      removeEventListener('keydown', handleKeyboardEvent)
    }
  }, [keyboardMap])
}
