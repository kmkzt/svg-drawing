export const svg2base64 = (svg: string): string =>
  `data:image/svg+xml;base64,${btoa(svg)}`
