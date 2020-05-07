# svg-drawing

[![npm version](https://badge.fury.io/js/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing) [![npm download](https://img.shields.io/npm/dt/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing)

### introduction

`svg-drawing` is drawing svg library. This is use [two.js](https://github.com/jonobr1/two.js).

**[demo](https://kmkzt.github.io/svg-drawing/)**
[example code](src/example/)

## Get started

```html
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/two.js/0.6.0/two.min.js"></script>
    <script src="https://unpkg.com/svg-drawing@1.8.0/lib/index.min.js"></script>
  </head>
  <body>
    <script>
      var SvgDrawing = window['svg-drawing'].SvgDrawing
      var el = document.createElement('div')
      el.setAttribute(
        'style',
        `
      border: 1px solid #ddd;
      width: 500px;
      height: 500px;
      `
      )
      document.body.appendChild(el)
      new SvgDrawing({
        el,
        autostart: true
      })
    </script>
  </body>
</html>
```

## Install

```shell
yarn add two.js svg-drawing
```

```javascript
import { SvgDrawing } from 'svg-drawing'

const el = document.createElement('div')
el.setAttribute(
  'style',
  `
  border: 1px solid #ddd;
  width: 500px;
  height: 500px;
  `
)
document.body.appendChid(el)
new SvgDrawing({
  el,
  autostart: true
})
```

#### Refference

https://two.js.org/examples/dynamic-vertices.html
