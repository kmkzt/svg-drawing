export const camel2kebab = (str: string): string =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

export const roundUp = (num: number, digits = 2): number => +num.toFixed(digits)

export const kebab2camel = (str: string): string =>
  str.replace(/-([a-z])/g, (a: string, b: string) => b.toUpperCase())
