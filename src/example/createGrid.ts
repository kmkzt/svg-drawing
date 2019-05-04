import Two from 'two.js'
interface GridOption {
  size: number
  color: Two.Color
}
const defaultOption: GridOption = {
  size: 30,
  color: '#eee'
}
export const createGrid = (option?: Partial<GridOption>) => {
  const { size, color } = {
    ...defaultOption,
    ...option
  }
  const two = new Two({
    type: Two.Types.canvas,
    width: size,
    height: size
  })

  const a = two.makeLine(two.width / 2, 0, two.width / 2, two.height)
  const b = two.makeLine(0, two.height / 2, two.width, two.height / 2)
  a.stroke = b.stroke = color

  two.update()

  return two
}
