export const camel2kebab = (str: string) =>
  str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
