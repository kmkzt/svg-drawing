import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { svgObjectToElement } from '@svg-drawing/core'
import { loadPngData } from './__test__/loadPngData'
import { Palette } from './palette'
import { ImgTrace } from './trace'
import type { ImgTraceOption } from './trace'

const testPattern: {
  [key: string]: Partial<ImgTraceOption>
} = {
  default: {},
  curvy: { rightangleenhance: false },
  ltres: { ltres: 0.01 },
  qtres: { qtres: 0.01 },
  pathomit_20: { pathOmit: 20 },
  commandOmit: { commandOmit: 3 },
  palettes_custom: {
    palettes: [
      { r: 0, g: 0, b: 100, a: 255 },
      { r: 255, g: 255, b: 255, a: 255 },
    ],
  },
}

describe('trace.ts', () => {
  const testimage = resolve(__dirname, '__test__/panda.png')
  it('TestPattern', () => {
    // TestPattern
    expect(testPattern).toMatchInlineSnapshot(`
      Object {
        "commandOmit": Object {
          "commandOmit": 3,
        },
        "curvy": Object {
          "rightangleenhance": false,
        },
        "default": Object {},
        "ltres": Object {
          "ltres": 0.01,
        },
        "palettes_custom": Object {
          "palettes": Array [
            Object {
              "a": 255,
              "b": 100,
              "g": 0,
              "r": 0,
            },
            Object {
              "a": 255,
              "b": 255,
              "g": 255,
              "r": 255,
            },
          ],
        },
        "pathomit_20": Object {
          "pathOmit": 20,
        },
        "qtres": Object {
          "qtres": 0.01,
        },
      }
    `)
  })
  describe('ImgTrace', () => {
    Object.entries(testPattern).map(([testname, testopts]) => {
      it(`${testname}`, (done) => {
        loadPngData(testimage, (png) => {
          const svg = new ImgTrace({
            palettes: Palette.imageData(png),
            ...testopts,
          }).load(png)

          const data = svgObjectToElement(svg.toJson()).outerHTML
          /** DEBUG */
          if (process.env.DEBUG === 'debug') {
            writeFileSync(
              resolve(__dirname, `__debug__/${testname}-${Date.now()}.svg`),
              data
            )
          }

          // TODO: visual regression

          // Effect Image
          // TODO: visual regression
          // expect(imgd).toMatchInlineSnapshot()

          // SvgString
          expect(data).toMatchSnapshot()
          done()
        })
      })
    })
  })
})
