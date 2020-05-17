# svg-drawing

[![npm version](https://badge.fury.io/js/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing) [![npm download](https://img.shields.io/npm/dt/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing)

`svg-drawing` is svg based drawing library with lightweight, no dependencies.

This is a **[demo](https://kmkzt.github.io/svg-drawing/)**.

## Install

### npm

```shell
yarn add svg-drawing
# or
# npm i svg-drawing
```

Example code is [here](src/example/)

### CDN

```html
<!-- Common JS-->
<script src="https://unpkg.com/svg-drawing@2.0.0-alpha.3/lib/index.min.js"></script>

<!-- ES Modules -->
<script type="module">
  import {
    SvgDrawing,
    SvgAnimation
  } from 'https://unpkg.com/svg-drawing@2.0.0-alpha.4/lib/index.esm.js'
  ...
</script>
```

[Here](example/) is an example for Html only.

## How to use

### Drawing Example

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

// drawing deactivate
draw.off()
// drawing reactivate
draw.on()

// drawing all clear
draw.clear()
// undo drawing
draw.undo()

// change parameter.　There are other changeable parameters like fill, close, curve, etc.
draw.penColor = '#00b'
draw.penWidth = 10

// Download image. Also available in SvgAnimation, Renderer
draw.download('svg')
draw.download('jpg')
draw.download('png')
```

### Animation Example

This example is to animate what you drew with Svg Drawing

```js
import { SvgDrawing, SvgAnimation } from 'svg-drawing'

// Render drawing area. omitted the description
const draw = new SvgDrawing(el)

// Render animation
// It is resized to fit the rendering area as well as the SvgDrawing area.
const anim = new SvgAnimation(animEl, {
  ms: 20
})

// Example stroke animation.
// Callback function to set SvgAnimation
// Since the Path Object before animation is passed as an argument, it is converted and returned.
let cur = 0
const strokeAnimation = paths => {
  const total = paths.reduce((l, p) => l + p.commands.length, 0)
  if (cur > total) cur = 0
  else cur += 1
  const update = []
  let count = cur
  for (let i = 0; i < paths.length; i += 1) {
    if (count < paths[i].commands.length) {
      paths[i].commands = paths[i].commands.slice(0, count)
      update.push(paths[i])
      break
    }
    count -= paths[i].commands.length
    update.push(paths[i])
  }
  return update
}

const start = document.getElementById('start')
start.onclick = () => {
  // Sets the animation callback function
  anim.setAnimation(strokeAnimation)
  // Copy drawwing data
  anim.copy(draw)
  // Start Animation
  anim.start()
}

const stop = document.getElementById('stop')
stop.onclick = () => {
  // Stop Animation
  anim.stop()
  // Put it back before animating
  anim.resotre()
}
```

SvgAnimation methods.

```javascript
const anim = new SvgAnimation(el)

// Animation Start
anim.start()
// Animation Stop
anim.stop()
// Return to Svg before animation
anim.restore()

// Parameter `ms` can be changed to set Animation frame. `ms` is mili seconds.
// Can be changed during animation
anim.ms = 50
```
