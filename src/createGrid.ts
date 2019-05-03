import Two from 'two.js'
import * as _ from 'lodash'

export const createGrid = (size: number = 30) => {
  const two = new Two({
    type: Two.Types.canvas,
    width: size,
    height: size
  })

  const a = two.makeLine(two.width / 2, 0, two.width / 2, two.height)
  const b = two.makeLine(0, two.height / 2, two.width, two.height / 2)
  a.stroke = b.stroke = '#6dcff6'

  two.update()

  _.defer(function() {
    document.body.setAttribute(
      'style',
      `background: url('${(two.renderer as any).domElement.toDataURL(
        'image/png'
      )}') 0 0 repeat,
        background-size: ${size}px ${size}px
      `
    )
  })
}
