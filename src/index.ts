import { createGrid } from './createGrid'
import { drawing } from './drawing'

const two = drawing(document.body)
createGrid(document.body)

const randomness = 2
two.bind('update', (frameCount, timeDelta) => {
  two.scene.children.map((child: Two.Object | any) => {
    child.vertices.map((v: any) => {
      if (!v.position) {
        return
      }
      v.x = v.position.x + (Math.random() * randomness - randomness / 2)
      v.y = v.position.y + (Math.random() * randomness - randomness / 2)
    })
  })
})
