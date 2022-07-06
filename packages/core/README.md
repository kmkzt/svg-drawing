# `@svg-drawing/core`

[![npm version](https://img.shields.io/npm/v/@svg-drawing/core/latest.svg)](https://www.npmjs.com/package/@svg-drawing/core) [![npm download](https://img.shields.io/npm/dm/@svg-drawing/core.svg)](https://www.npmjs.com/package/@svg-drawing/core)

## How to use

### npm

Install

```shell
yarn add @svg-drawing/core
# or
# npm i svg-drawing
```

Example code is [here](/examples/docs/pages/demo/drawing.tsx)

This example renders the drawing area.

```javascript
import { SvgDrawing } from '@svg-drawing/core'

const el = document.createElement('div')

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

SvgDrawing methods.

```javascript
const draw = new SvgDrawing(el)

// change parameter.　There are other changeable parameters like fill, close, curve, etc.
draw.penColor = '#00b'
draw.penWidth = 10

// drawing deactivate
draw.off()
// drawing reactivate
draw.on()

// drawing all clear
draw.clear()
// undo drawing
draw.undo()

// Download image. Also available in SvgAnimation, Renderer
draw.download() // Default download is svg.
draw.download({ extension: 'jpg', filename: 'example.jpg' })
draw.download({ extension: 'png', filename: 'example.png' })

// Load svg data. Only the path element.
// SVG exported by this library can be read.
draw.svg.parseSVGString(
  '<svg width="200" height="200"><path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path></svg>'
)
draw.svg.parseSVGElement(document.getElementByID('loadSVG'))
```

### CDN

```html
<div id="draw-area" style="width: 100vw;height: 100vh;"></div>
<script src="https://unpkg.com/@svg-drawing/core@4.0.0-beta.6/lib/index.umd.js"></script>
<script>
  var draw = new SVGDCore.SvgDrawing(document.getElementById('draw-area'))
</script>
```

[Here](/example/html/) is an example for Html only.
