# svg-drawing

[![npm version](https://badge.fury.io/js/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing) [![npm download](https://img.shields.io/npm/dt/svg-drawing.svg)](https://www.npmjs.com/package/svg-drawing) [![codecov](https://codecov.io/gh/kmkzt/svg-drawing/branch/master/graph/badge.svg)](https://codecov.io/gh/kmkzt/svg-drawing)

![animation svg sample](./src/example/animation.svg)

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
<script src="https://unpkg.com/svg-drawing@2.1.1/lib/index.min.js"></script>

<!-- ES Modules -->
<script type="module">
  import {
    SvgDrawing,
    SvgAnimation
  } from 'https://unpkg.com/svg-drawing@2.1.1/lib/index.esm.js'
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

// Load svg data. Only the path element.
// SVG exported by this library can be read.
draw.parseSVGString(
  '<svg width="200" height="200"><path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path></svg>'
)
draw.parseSVGElement(document.getElementByID('loadSVG'))
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

// Example drawing animation.
// Callback function to set SvgAnimation
// Since the Path Object before animation is passed as an argument, it is converted and returned.

const setupAnimation = () => {
  // Copy drawwing data.
  // You can also use `parseSVGElement` or `parseSVGString`.
  // anim.parseSVGElement(document.getElementByID('targetSvg'))
  // draw.parseSVGString('<svg width="100" height="100"><path fill="#f00" stroke="#00f"stroke-width="4" d="M 10 10 L 20 20 C 30 30 50 30 70 30 Z"></path></svg>')
  anim.copy(draw)

  // Sets the animation callback function. `fid` is number of frame index.
  // It repeat times number of total commands. You can change the number of repeats as an option.
  anim.setAnimation(
    (paths, fid) => {
      let dispNum = fid
      const update = []
      for (let i = 0; i < paths.length; i += 1) {
        if (count < paths[i].commands.length) {
          paths[i].commands = paths[i].commands.slice(0, dispNum)
          update.push(paths[i])
          break
        }
        dispNum -= paths[i].commands.length
        update.push(paths[i])
      }
      return update
    }

    // The default value for the option. It works the same without writing.
    // This option cannot be used before version 2. When setting the number of frames, you need to have a global variable used in the animation function
    {
      frames: anim.paths.reduce((l, p) => l + p.commands.length, 0), // The number of frames in the animation.
      repeatCount: 'indefinete' // Set repeatCount attribute  to animate element
    }
  )
}


// Animation Start
const start = document.getElementById('start')
start.onclick = () => {
  // load draw data
  loadSvgAnimation()

  // Method to animate Svg with JavaScript
  anim.start()

  // Or use SVGAnimateElement.
  anim.el.replaceChild(anim.toAnimationElement(), anim.el.childNodes[0])
  console.log(anim.toAnimationElement()) // <svg height="100" version="1.1" width="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M 10 10 L 20 20 C 30 30 50 30 70 30 Z" fill="#f00" id="t0" stroke="#00f" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><animateattributeName="d" dur="240ms" keyTimes="0;0.25;0.5;0.75;1" repeatCount="indefinite" values="M 10 10 L 20 20 C 30 30 50 30 70 30 Z;M 10 10;M 10 10;M 10 10 L 20 20;M 10 10 L 20 20 C 30 30 50 30 70 30" /></path></svg>
}

// Animation Stop
const stop = document.getElementById('stop')
stop.onclick = () => {
  // Stop Animation.
  anim.stop()
  // Restore Svg before animation.
  anim.resotre()
}

// Download animtaion svg.
const download = document.getElementById('download')
download.onclick = () => {
  loadAnimation()
  anim.downloadAnimation()
}
```

```javascript
const anim = new SvgAnimation(el)

// Property `ms` can be changed to set Animation frame. `ms` is mili seconds.
// Can be changed during animation
anim.ms = 50

// Animation Start
anim.start()
// Animation Stop
anim.stop()
// Return to Svg before animation
anim.restore()

/**
 * Only version 3 or later is supported
 */
// Creata animation svg element.
anim.toAnimationElement()
// Download animation svg element.
anim.downloadAnimation()
```
