import { MutableRefObject, useEffect, useRef } from 'react'

export const useMultipleSelect = (
  bindKey = 'Shift'
): MutableRefObject<boolean> => {
  const multipleSelect = useRef(false)

  useEffect(() => {
    const handleOn = (ev: KeyboardEvent) => {
      if (ev.key !== bindKey) return
      multipleSelect.current = true
    }

    const handleOff = (ev: KeyboardEvent) => {
      if (ev.key !== bindKey) return
      multipleSelect.current = false
    }
    addEventListener('keydown', handleOn)
    addEventListener('keyup', handleOff)
    return () => {
      removeEventListener('keydown', handleOn)
      removeEventListener('keyup', handleOff)
    }
  }, [bindKey])
  return multipleSelect
}
