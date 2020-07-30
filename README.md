# svg-drawing

[![npm version](https://img.shields.io/npm/v/@svg-drawing/core/latest.svg)](https://www.npmjs.com/package/svg-drawing) [![npm download](https://img.shields.io/npm/dm/@svg-drawing/core.svg)](https://www.npmjs.com/package/svg-drawing) [![codecov](https://codecov.io/gh/kmkzt/svg-drawing/branch/master/graph/badge.svg)](https://codecov.io/gh/kmkzt/svg-drawing)

![svg animation image](https://raw.githubusercontent.com/kmkzt/svg-drawing/master/logo.svg)

`svg-drawing` is svg based drawing library.

This is a **[demo](https://kmkzt.github.io/svg-drawing/demo/drawing)**.
Code is [here](https://github.com/kmkzt/svg-drawing/tree/master/examples/docs/pages/demo).

This project has moved to monorepo. If you want to use the previous version, please use [here](https://github.com/kmkzt/svg-drawing/tree/v3.0.0).

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
<script src="https://unpkg.com/@svg-drawing/core@4.0.0-beta.6/lib/index.umd.js"></script>
<script>
  var draw = new SVGDCore.SvgDrawing(document.getElementById('draw-area'))
</script>
```

**[Here](https://github.com/kmkzt/svg-drawing/tree/master/examples/html)** is an example for Html only.

## Packages

| Packages                                                                                                                   | Description                                                                |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [@svg-drawing/core![npm version](https://img.shields.io/npm/v/@svg-drawing/core/latest.svg)](https://github.com/kmkzt/svg-drawing/tree/master/packages/core)                | Core Module                                                                |
| [@svg-drawing/animation![npm version](https://img.shields.io/npm/v/@svg-drawing/animation/latest.svg)](https://github.com/kmkzt/svg-drawing/tree/master/packages/animation) | Animate the drawn Svg. Can be animations using `JavaScript` or `<animate>` |
| [@svg-drawing/img-trace![npm version](https://img.shields.io/npm/v/@svg-drawing/img-trace/latest.svg)](https://github.com/kmkzt/svg-drawing/tree/master/packages/img-trace) | Image(png/jpg) convert Svg.                                                |
| [@svg-drawing/react![npm version](https://img.shields.io/npm/v/@svg-drawing/react/latest.svg)](https://github.com/kmkzt/svg-drawing/tree/master/packages/react)             | For React.                                                                 |
