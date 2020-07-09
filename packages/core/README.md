# @svg-drawing/core

## Install

### npm

```shell
yarn add @svg-drawing/core
# or
# npm i svg-drawing
```

Example code is [here](src/example/)

### CDN

```html
<!-- Common JS-->
<script src="https://unpkg.com/svg-drawing@3.0.0/lib/index.min.js"></script>

<!-- ES Modules -->
<script type="module">
  import {
    SvgDrawing,
    SvgAnimation
  } from 'https://unpkg.com/svg-drawing@3.0.0/lib/index.esm.js'
  ...
</script>
```

[Here](/example/demo/) is an example for Html only.

## How to use

This example renders the drawing area.

```javascript
import { SvgDrawing } from 'svg-drawing'

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
draw.download('svg')
draw.download('jpg')
draw.download('png')

// Load svg data. Only the path element.
// SVG exported by this library can be read.
draw.parseSVGString(
  '<svg width="200" height="200"><path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path></svg>'
)
draw.parseSVGElement(document.getElementByID('loadSVG'))
```
