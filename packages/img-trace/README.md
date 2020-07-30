# `@svg-drawing/img-trace`

[![npm version](https://img.shields.io/npm/v/@svg-drawing/img-trace/latest.svg)](https://www.npmjs.com/package/@svg-drawing/img-trace) [![npm download](https://img.shields.io/npm/dm/@svg-drawing/img-trace.svg)](https://www.npmjs.com/package/@svg-drawing/img-trace)

## Install

### npm

```shell
yarn add @svg-drawing/img-trace
# or
# npm i @svg-drawing/img-trace
```

## How to use

Example code is [here](/examples/docs/pages/demo/img-trace.tsx)

Example of downloading the image converted to Svg

```ts
import {
  ImgTrace
  ImgLoader,
} from '@svg-drawing/img-trace'

// imgd is new ImageData()
const svgDownload = () => {
  new ImgLoader().fromUrl('./images/example.png', (imgd) => {
    const svg = new ImgTrace({
      // Default color list.
      // palettes: [
      //   { r: 0, g: 0, b: 0, a: 255 },
      //   { r: 50, g: 50, b: 50, a: 255 },
      //   { r: 100, g: 100, b: 100, a: 255 },
      //   { r: 150, g: 150, b: 150, a: 255 },
      //   { r: 200, g: 200, b: 200, a: 255 },
      // ]
    }).load(imgd)
    svg.download()
  })
}

// async/await
const svgDownloadAsync = async () => {
  try {
    const imgd = new ImgLoader().fromUrl('./images/example.png')
    const svg = new ImgTrace().load(imgd)
    svg.download()
  } catch {}
}

```

Example of rendering an image converted to Svg

```ts
import { Renderer } from '@svg-drawing/core'
import {
  ImgTrace
  ImgLoader,
} from '@svg-drawing/img-trace'

const renderer = new Renderer(document.getElementById('render-area'))
const handleImage = (imgd) => {
  const svg = new ImgTrace().load(imgd)
  renderer.copy(svg)
  renderer.update()
}

new ImgLoader().fromUrl('./images/example.png', handleImage)
```

Example of get colors palettes.

```ts
import {
  ImgTrace
  ImgLoader,
  Palette
} from '@svg-drawing/img-trace'

// imgd is new ImageData()
const colorSvgDownload = () => {
  new ImgLoader().fromUrl('./images/example.png', (imgd) => {
    // extracting colors from an image.
    const palette = Palette.imageData(imgd, {
      numberOfColors: 8 // The default value.　If it is 8 or less, the value is grayscale.
    })

    // Extracts the color evenly by the number passed
    const palette = Palette.number(8)

    // Greyscale palettes.
    const palette = Palette.grey(8)

    const svg = new ImgTrace({ palettes }).load(imgd)
    svg.download()
  })
}


```

## Thanks

https://github.com/jankovicsandras/imagetracerjs
