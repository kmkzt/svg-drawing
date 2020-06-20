export const kebab2camel = (str: string) =>
  str.replace(/-([a-z])/g, (a: string, b: string) => b.toUpperCase())
