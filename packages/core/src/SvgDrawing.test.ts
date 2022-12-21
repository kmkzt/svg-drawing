import { toElement, svgElement } from './renderer/svgRenderer'
import { SvgDrawing } from './SvgDrawing'

describe('SvgDrawing', () => {
  it('default', () => {
    const draw = new SvgDrawing(document.createElement('div'))
    draw.drawStart()
    draw.drawMove({ x: 0, y: 0 })
    draw.drawMove({ x: 1, y: 1 })
    draw.drawMove({ x: 2, y: 1 })
    draw.drawMove({ x: 3, y: 0 })
    draw.drawEnd()
    expect(toElement({ svg: draw.toJson() })).toMatchInlineSnapshot(`
      <svg
        height="0"
        version="1.1"
        width="0"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M0 0 c0.4 0.4 0.49404 0.74702 1 1 c0.35777 0.17889 0.64223 0.17889 1 0 c0.50596 -0.25298 0.6 -0.6 1 -1"
          fill="none"
          stroke="#000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
        />
      </svg>
    `)
  })

  it('close', () => {
    const draw = new SvgDrawing(document.createElement('div'))
    draw.changeClose(true)
    draw.drawStart()
    draw.drawMove({ x: 0, y: 0 })
    draw.drawMove({ x: 1, y: 1 })
    draw.drawMove({ x: 2, y: 1 })
    draw.drawMove({ x: 3, y: 0 })
    draw.drawEnd()
    const el = toElement({ svg: draw.toJson() })
    expect(el).toMatchInlineSnapshot(`
      <svg
        height="0"
        version="1.1"
        width="0"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M0 0 c0.4 0.4 0.49404 0.74702 1 1 c0.35777 0.17889 0.64223 0.17889 1 0 c0.50596 -0.25298 0.6 -0.6 1 -1"
          fill="none"
          stroke="#000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
        />
      </svg>
    `)
  })

  it('curve = false', () => {
    const draw = new SvgDrawing(document.createElement('div'))
    draw.changeCurve(false)
    draw.drawStart()
    draw.drawMove({ x: 0, y: 0 })
    draw.drawMove({ x: 1, y: 1 })
    draw.drawMove({ x: 2, y: 1 })
    draw.drawMove({ x: 3, y: 0 })
    draw.drawEnd()
    const el = toElement({ svg: draw.toJson() })
    expect(el).toMatchInlineSnapshot(`
      <svg
        height="0"
        version="1.1"
        width="0"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M0 0 l1 1 l1 0 l1 -1"
          fill="none"
          stroke="#000"
          stroke-linecap="mitter"
          stroke-linejoin="square"
          stroke-width="1"
        />
      </svg>
    `)
  })

  it('clear()', () => {
    const draw = new SvgDrawing(document.createElement('div'))
    draw.changeCurve(false)
    draw.drawStart()
    draw.drawMove({ x: 0, y: 0 })
    draw.drawEnd()
    draw.clear()
    const el = toElement({ svg: draw.toJson() })
    expect(el).toMatchInlineSnapshot(`
      <svg
        height="0"
        version="1.1"
        width="0"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      />
    `)
  })

  it('undo()', () => {
    const draw = new SvgDrawing(document.createElement('div'))
    draw.drawStart()
    draw.drawMove({ x: 0, y: 0 })
    draw.drawEnd()
    draw.drawStart()
    draw.drawMove({ x: 0, y: 0 })
    draw.drawEnd()
    draw.undo()
    const el = toElement({ svg: draw.toJson() })
    expect(el).toMatchInlineSnapshot(`
      <svg
        height="0"
        version="1.1"
        width="0"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M0 0"
          fill="none"
          stroke="#000"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
        />
      </svg>
    `)
  })
})
