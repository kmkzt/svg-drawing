export type UseParseFile = (opts: {
  parseSVGString: (svg: string) => void
}) => (file: File) => void
