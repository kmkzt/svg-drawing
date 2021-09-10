/* eslint-disable jest/no-test-callback */
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { ImgTrace, ImgTraceOption } from './trace'
import { Palette } from './palette'
import { loadPngData } from './__test__/loadPngData'
import { svgObjectToElement } from '@svg-drawing/core'

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
    expect(testPattern).toMatchSnapshot()
  })
  describe('ImgTrace', () => {
    Object.entries(testPattern).map(([testname, testopts]) => {
      it(testname, (done) => {
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
          // expect(imgd).toMatchSnapshot()

          // SvgString
          expect(data).toMatchSnapshot()
          done()
        })
      })
    })
  })
})
