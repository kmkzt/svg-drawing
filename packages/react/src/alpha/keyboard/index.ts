import { useEffect } from 'react'

export type KeyboardMap = {
  [key: string]: (() => void) | undefined
}
export const useKeyboard = (keyboardMap: KeyboardMap = {}) => {
  useEffect(() => {
    const handleKeyboardEvent = (ev: KeyboardEvent) => {
      const fn = keyboardMap[ev.key]
      if (typeof fn !== 'function') return
      ev.preventDefault()
      fn()
    }
    addEventListener('keydown', handleKeyboardEvent)
    return () => {
      removeEventListener('keydown', handleKeyboardEvent)
    }
  }, [keyboardMap])
}
