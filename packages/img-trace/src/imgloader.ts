interface ImgLoaderOption {
  corsenabled: boolean
}

export class ImgLoader {
  public corsenabled: boolean

  constructor(options: Partial<ImgLoaderOption>) {
    this.corsenabled = options.corsenabled ?? true
  }

  // TODO: improve types.
  // if exists callback, return void. if not existed callback, return Promise<ImageData>.
  public fromUrl(
    url: string,
    callback?: (imgd: ImageData) => void
  ): void | Promise<ImageData> {
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
    const load = (
      resolve: (imgd: ImageData) => void,
      reject?: (a: any) => void
    ) => {
      const img = new Image()
      if (this.corsenabled) {
        img.crossOrigin = 'Anonymous'
      }
      img.onload = () => {
        this.fromImageElement(img, resolve)
      }
      img.onerror = (err: any) => {
        if (reject) {
          reject(err)
        } else {
          console.error(err)
        }
      }
      img.src = url
    }
    if (callback) {
      load(callback)
    } else {
      return new Promise(load)
    }
  }

  // TODO: improve types.
  // if exists callback, return void. if not existed callback, return Promise<ImageData>.
  public fromImageElement(
    img: HTMLImageElement,
    callback?: (imgd: ImageData) => void
  ): Promise<ImageData> | void {
    const load = (
      resolve: (imgd: ImageData) => void,
      reject?: (a: any) => void
    ) => {
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
      if (!imgd) {
        if (reject) {
          reject('error canvas context.')
          return
        } else {
          throw 'error canvas context.'
        }
      }
      resolve(imgd)
    }
    if (callback) {
      load(callback)
    } else {
      return new Promise(load)
    }
  }
}
