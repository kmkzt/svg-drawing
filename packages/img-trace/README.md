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
import { download } from '@svg-drawing/core'

const svgDownload = async () => {
  new ImgLoader().fromUrl('./images/example.png', (imgd) => {
    const svg = new ImgTrace().load(imgd)
    download(svg)
  }
}

svgDownload()
```

Example of rendering an image converted to Svg

```ts
import { Renderer } from '@svg-drawing/core'
import {
  ImgTrace
  ImgLoader,
} from '@svg-drawing/img-trace'

const handleImage = (imgd) => {
  const svg = new ImgTrace().load(imgd)
  const renderer = new Renderer(document.getElementById('render-area'))
  renderer.update(svg.toJson())
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
import { download } from '@svg-drawing/core'

// imgd is new ImageData()
const colorSvgDownload = () => {
  new ImgLoader().fromUrl('./images/example.png', (imgd) => {
    // extracting colors from an image.
    const palette = Palette.imageData(imgd, {
      numberOfColors: 8 // The default value.　If it is 8 or less, the value is gray scale.
    })
    // const palette = Palette.number(8) // Extracts the color evenly by the number passed
    // const palette = Palette.grey(8) // Grey scale palettes.
    
    const svg = new ImgTrace({ palettes }).load(imgd)
    download(svg)
  })
}

colorSvgDownload()

```

## Thanks

https://github.com/jankovicsandras/imagetracerjs
