import { resolve } from 'path'
import { loadPngData } from './__test__/loadPngData'
import { Palette } from './palette'
import type { Rgba } from './palette'

const TEST_NUMBER_OF_COLORS = [undefined, 2, 4, 7, 8, 27, 64]
const TEST_COLOR_QUANT_CYCLES = [undefined, 1, 8]
const getTestResult = (pal: Rgba[]) =>
  pal.map((c) => `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a / 255})`)

describe('palette.ts', () => {
  const testimage = resolve(__dirname, '__test__/panda.png')
  describe('Palette', () => {
    describe('Palette.imageData', () => {
      TEST_COLOR_QUANT_CYCLES.map((colorQuantCycles: number | undefined) => {
        TEST_NUMBER_OF_COLORS.map((numberOfColors: number | undefined) => {
          it(`colorQuantCycles: ${
            colorQuantCycles || 'default'
          } ;numberOfColors: ${numberOfColors || 'default'}`, (done) => {
            loadPngData(testimage, (imgd) => {
              expect(
                getTestResult(
                  Palette.imageData(imgd, { colorQuantCycles, numberOfColors })
                )
              ).toMatchSnapshot()
              done()
            })
          })
        })
      })
    })
    describe('Palette.number', () => {
      // TODO: Rest colors
      ;[8, 27].map((arg: number | undefined) => {
        it(`numberOfColors: ${arg || 'default'}`, () => {
          expect(getTestResult(Palette.number(arg))).toMatchSnapshot()
        })
      })
    })
    describe('Palette.gray', () => {
      ;[2, 7, 16].map((arg: number | undefined) => {
        it(`numberOfColors: ${arg || 'default'}`, () => {
          expect(getTestResult(Palette.grey(arg))).toMatchSnapshot()
        })
      })
    })
  })
})
