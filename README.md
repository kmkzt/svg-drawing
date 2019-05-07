# svg-drawing

### introduction

`svg-drawing` is drawing svg library. This is use [two.js](https://github.com/jonobr1/two.js).

**[demo](https://kmkzt.github.io/svg-drawing/)**
[example code](src/example/)

## Get started

```shell
yarn add two.js svg-drawing
```

## how to use

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
new SvgDrawing({
  el,
  autostart: true
})
```

#### Refference

https://two.js.org/examples/dynamic-vertices.html
