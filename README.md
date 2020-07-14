# svg-drawing

[![npm version](https://img.shields.io/npm/v/@svg-drawing/core/latest.svg)](https://www.npmjs.com/package/svg-drawing) [![npm download](https://img.shields.io/npm/dm/@svg-drawing/core.svg)](https://www.npmjs.com/package/svg-drawing) [![codecov](https://codecov.io/gh/kmkzt/svg-drawing/branch/master/graph/badge.svg)](https://codecov.io/gh/kmkzt/svg-drawing)

![svg animation image](./logo.svg)

`svg-drawing` is svg based drawing library.

This is a **[demo](https://kmkzt.github.io/svg-drawing/)**.
Code is [here](examples/demo).

This project has moved to monorepo. If you want to use the previous version, please use [here](/tree/v3.0.0).

## Getting Started

### npm

```shell
npm i @svg-drawing/core
# or
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

### CDN

```html
<div id="draw-area" style="width: 100vw;height: 100vh;"></div>
<!-- Common JS-->
<script src="https://unpkg.com/@svg-drawing/core@4.0.0-beta.3/lib/index.umd.js"></script>
<script>
  var draw = new SVGDCore.SvgDrawing(document.getElementById('draw-area'))
</script>
```

[Here](/example/demo/) is an example for Html only.

## Packages

| packages                                                                                                                   | Description                                                                |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [@svg-drawing/core![npm version](https://img.shields.io/npm/v/@svg-drawing/core/latest.svg)](packages/core)                | Core Module                                                                |
| [@svg-drawing/animation![npm version](https://img.shields.io/npm/v/@svg-drawing/animation/latest.svg)](packages/animation) | Animate the drawn Svg. Can be animations using `JavaScript` or `<animate>` |
| [@svg-drawing/react![npm version](https://img.shields.io/npm/v/@svg-drawing/react/latest.svg)](packages/react)             | For react.                                                                 |
