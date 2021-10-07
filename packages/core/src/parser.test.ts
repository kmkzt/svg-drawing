import { parseCommandString, parseSVGString, parseSVGElement } from './parser'
import { Path } from './svg/path'

describe('parser', () => {
  it('parseCommandString', () => {
    const path = new Path()
    const testData =
      'M0 0 L1 1 C2 2 2 4 6 0 Q0 0 1 1 m0 0 l1 1 c1 1 2 2 3 3 H10 V20 h10 v20 A6 4 10 0 1 14 10 a6 4 10 0 1 14 10'
    path.addCommand(parseCommandString(testData))

    expect(path.getCommandString()).toBe(testData)
  })
  it('parseSVGString', () => {
    expect(
      parseSVGString(`
      <svg width="200" height="200">
        <path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
      </svg>`)
    ).toMatchSnapshot()
  })
  it('parseSVGElement', () => {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgEl.setAttribute('width', '200')
    svgEl.setAttribute('height', '200')
    const pathEl = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    )
    pathEl.setAttribute('fill', '#f00')
    pathEl.setAttribute('stroke', '#00f')
    pathEl.setAttribute('stroke-width', '4')
    pathEl.setAttribute('d', 'M 1 1 L 2 2 C 3 3 5 3 7 3 Z')
    svgEl.appendChild(pathEl)
    expect(parseSVGElement(svgEl)).toMatchSnapshot()
  })
})
