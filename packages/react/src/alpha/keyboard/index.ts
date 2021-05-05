import { useEffect } from 'react'

export type KeyBindMap = {
  [key: string]: (() => void) | undefined
}
export const useKeyBind = (keyBindMap: KeyBindMap) => {
  useEffect(() => {
    const handleKeyboardEvent = (ev: KeyboardEvent) => {
      const fn = keyBindMap[ev.key]
      if (!fn) return
      ev.preventDefault()
      fn()
    }
    window.addEventListener('keydown', handleKeyboardEvent)
    return () => {
      window.removeEventListener('keydown', handleKeyboardEvent)
    }
  }, [keyBindMap])
}