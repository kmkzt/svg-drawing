export const getPassiveOptions = (
  passive: boolean = true
): boolean | { passive: boolean } => {
  try {
    const check = () => null
    window.addEventListener('testPassive', check, { passive })
    window.removeEventListener('testPassive', check)
    return { passive }
  } catch (e) {
    return false
  }
}
