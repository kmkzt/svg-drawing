# svg-drawing

[![npm version](https://img.shields.io/npm/v/svg-drawing/latest.svg)](https://www.npmjs.com/package/svg-drawing) [![npm download](https://img.shields.io/npm/dm/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing) [![codecov](https://codecov.io/gh/kmkzt/svg-drawing/branch/master/graph/badge.svg)](https://codecov.io/gh/kmkzt/svg-drawing)

![svg animation image](./logo.svg)

`svg-drawing` is svg based drawing library.

This is a **[demo](https://kmkzt.github.io/svg-drawing/)**.

[Here](example/html) is an example for Html only.

## Getting Started

```shell
yarn add @svg-drawing/core
```

```javascript
import { SvgDrawing } from '@svg-drawing/core'

const drawel = document.createElement('div')

// Drawing area will be resized to fit the rendering area
el.setAttribute(
  'style',
  `
  border: 1px solid #ddd;
  width: 500px;
  height: 500px;
  `
)
document.body.appendChid(el)
new SvgDrawing(el)
```

## Project

| packages                                     | version                                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| [@svg-drawing/core](packages/coer)           | ![npm version](https://img.shields.io/npm/v/@svg-drawing/core/latest.svg)      |
| [@svg-drawing/animation](packages/animation) | ![npm version](https://img.shields.io/npm/v/@svg-drawing/animation/latest.svg) |
