import Two, { Types } from 'two.js'
import { createGrid } from './createGrid'
// import { drawing } from './drawing'
import DrawingTwo from '../DrawingTwo'

const area = document.createElement('div')

document.body.appendChild(area)
const size = 30
const gridImage = (createGrid({
  size
}).renderer as any).domElement.toDataURL('image/png')
area.setAttribute(
  'style',
  `
    background: url('${gridImage}') 0 0 repeat;
    background-size: ${size}px ${size}px;
    width: 500px;
    height: 500px;
  `
)

const drawing = new DrawingTwo({
  el: area,
  type: Two.Types.svg,
  autostart: true
})

/**
 * shaking trigger
 */
const shake = document.createElement('button')
shake.innerHTML = 'Shaking Line'
document.body.appendChild(shake)
let stopShake: null | (() => void) = null
shake.onclick = () => {
  if (stopShake) {
    stopShake()
    stopShake = null
    return
  }
  stopShake = drawing.shaking()
}
const svgdownload = document.createElement('button')
svgdownload.innerHTML = 'download'
document.body.appendChild(svgdownload)
svgdownload.onclick = () => {
  console.log(drawing.scene)
  const domElemet = (drawing.renderer as any).domElement
  switch (drawing.type) {
    case Two.Types.canvas:
      console.log(domElemet.toDataURL('image/xml+svg'))
    case Two.Types.svg:
      console.log(domElemet)
    case Two.Types.webgl:
      console.log(domElemet)
    default:
      console.log(domElemet)
  }
}

const clearButton = document.createElement('button')
clearButton.innerHTML = 'clear'
document.body.appendChild(clearButton)
clearButton.onclick = () => {
  drawing.clear()
}

const changeType = document.createElement('button')
changeType.innerHTML = 'change type'
document.body.appendChild(changeType)
changeType.onclick = () => {
  drawing.type = Two.Types.canvas
}

/**
 * Refferrence Example
 */
// const draw = drawing(area)
// const randomness = 2
// draw.bind('update', (frameCount, timeDelta) => {
//   draw.scene.children.map((child: Two.Object | any) => {
//     child.vertices.map((v: any) => {
//       if (!v.position) {
//         return
//       }
//       v.x = v.position.x + (Math.random() * randomness - randomness / 2)
//       v.y = v.position.y + (Math.random() * randomness - randomness / 2)
//     })
//   })
// })
