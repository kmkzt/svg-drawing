# svg-drawing

[![npm version](https://badge.fury.io/js/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing) [![npm download](https://img.shields.io/npm/dt/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing)

### introduction

`svg-drawing` is svg based drawing library with lightweight, no dependencies.

**[demo](https://kmkzt.github.io/svg-drawing/)**
[example code](src/example/)

## Install

```shell
yarn add svg-drawing
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
new SvgDrawing(el)
```

Drawing methods.

```javascript
const app = new SvgDrawing(el)

// drawing all clear
app.clear()
// undo drawing
action.undo()

// Download image
app.download('svg')
app.download('jpg')
app.download('png')

// change parameter.　There are other changeable parameters like fill, close, circuler, etc.
app.penColor = '#00b'
app.penWidth = 10
```

## Get started

WIP
