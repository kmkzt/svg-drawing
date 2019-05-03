import Two from 'two.js'
interface GridOption {
  size: number
  color: Two.Color
}
export const createGrid = (
  el: HTMLElement,
  { size, color }: GridOption = {
    size: 30,
    color: '#6dcff6'
  }
) => {
  const two = new Two({
    type: Two.Types.canvas,
    width: size,
    height: size
  })

  const a = two.makeLine(two.width / 2, 0, two.width / 2, two.height)
  const b = two.makeLine(0, two.height / 2, two.width, two.height / 2)
  a.stroke = b.stroke = color

  two.update()

  el.setAttribute(
    'style',
    `background: url('${(two.renderer as any).domElement.toDataURL(
      'image/png'
    )}') 0 0 repeat;
      background-size: ${size}px ${size}px;
    `
  )
}
