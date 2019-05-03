import Two from 'two.js'
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
  type: Two.Types.svg,
  width: area.clientWidth,
  height: area.clientHeight,
  autostart: true
}).appendTo(area)

/**
 * shaking trigger
 */
const shake = document.createElement('button')
shake.innerHTML = 'Shaking Line'
document.body.appendChild(shake)
shake.onclick = () => {
  drawing.shaking()
}
const svgdownload = document.createElement('button')
svgdownload.innerHTML = 'download'
document.body.appendChild(svgdownload)
svgdownload.onclick = () => {
  console.log(drawing)
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
