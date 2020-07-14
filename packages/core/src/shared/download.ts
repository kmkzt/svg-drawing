const mimeTypeMap = {
  png: 'image/png',
  jpg: 'image/jpeg',
  svg: 'image/svg+xml',
} as const

export const download = ({
  data,
  extension,
  filename,
}: {
  data: string
  extension: keyof typeof mimeTypeMap
  filename?: string
}): void => {
  const bin = atob(data.replace(/^.*,/, ''))
  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i += 1) {
    buffer[i] = bin.charCodeAt(i)
  }
  const fname = filename || `${Date.now()}.${extension}`
  const blob = new Blob([buffer.buffer], {
    type: mimeTypeMap[extension],
  })
  if (window.navigator.msSaveBlob) {
    // IE
    window.navigator.msSaveBlob(blob, fname)
  } else if (window.URL && window.URL.createObjectURL) {
    // Firefox, Chrome, Safari
    const a = document.createElement('a')
    a.download = fname
    a.href = window.URL.createObjectURL(blob)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } else {
    // Other
    window.open(data, '_blank')
  }
}
