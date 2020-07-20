interface ImageLoaderOption {
  corsenabled: boolean
}

export class ImageLoader {
  public corsenabled: boolean

  constructor(options: Partial<ImageLoaderOption>) {
    this.corsenabled = options.corsenabled ?? true
  }
  public fromUrl(url: string, callback: (imgd: ImageData) => void): void {
    // TODO: cors improve
    // const xhr = new XMLHttpRequest()
    // xhr.responseType = 'blob'
    // xhr.open('GET', url, true)
    // xhr.onload = function() {
    //   const img = new Image()
    //   img.onload = function() {
    //     this.loadImageElement(img, callback)
    //   }
    //   img.onerror = (err: any) => {
    //     console.log(err)
    //   }
    //   console.log(this.response)

    //   img.src = URL.createObjectURL(this.response)
    // }
    // xhr.onerror = (err: any) => console.log(err)
    // xhr.send(null)

    const img = new Image()
    if (this.corsenabled) {
      img.crossOrigin = 'Anonymous'
    }
    img.onload = () => {
      this.fromImageElement(img, callback)
    }
    img.onerror = (err: any) => {
      console.log(err)
    }
    img.src = url
  }

  public fromImageElement(
    img: HTMLImageElement,
    callback: (imgd: ImageData) => void
  ): void {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height
    const context = canvas.getContext('2d')
    context?.drawImage(img, 0, 0)
    const imgd: ImageData | undefined = context?.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    )
    if (!imgd) throw 'error canvas context.'
    callback(imgd)
  }
}
