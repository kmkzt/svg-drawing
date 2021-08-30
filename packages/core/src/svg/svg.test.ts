import { Svg } from './svg'
import { Path } from './path'
import { Command, COMMAND_TYPE } from './command'
import { download, toBase64 } from '../download'
import { svgObjectToElement } from '../renderer'

describe('svg/svg.ts', () => {
  describe('Svg', () => {
    let svg: Svg
    beforeEach(() => {
      svg = new Svg({ width: 500, height: 500 })
        // TODO: rewrite bezier curve test
        .addPath(
          new Path()
            .addCommand(new Command(COMMAND_TYPE.MOVE, [0, 0]))
            .addCommand(
              new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
                0.2,
                0.2,
                0.6,
                0.8,
                1,
                1,
              ])
            )
            .addCommand(
              new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
                1.4,
                1.2,
                1.6,
                1.2,
                2,
                1,
              ])
            )
            .addCommand(
              new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
                2.4,
                0.8,
                2.8,
                0.2,
                3,
                0,
              ])
            )
        )
        .addPath(
          new Path({
            strokeLinecap: 'square',
            strokeLinejoin: 'mitter',
          })
            .addCommand(new Command(COMMAND_TYPE.MOVE, [4, 4]))
            .addCommand(new Command(COMMAND_TYPE.LINE, [9, 4]))
            .addCommand(new Command(COMMAND_TYPE.LINE, [9, 8]))
            .addCommand(new Command(COMMAND_TYPE.LINE, [3, 0]))
            .addCommand(new Command(COMMAND_TYPE.CLOSE))
        )
    })

    it('parseSVGString', () => {
      expect(
        new Svg({ width: 400, height: 400 }).parseSVGString(`
      <svg width="200" height="200">
        <path fill="#f00" stroke="#00f" stroke-width="4" d="M 1 1 L 2 2 C 3 3 5 3 7 3 Z"></path>
      </svg>`)
      ).toMatchSnapshot()
    })
    it('parseSVGElement', () => {
      const svgEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      )
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
      expect(
        new Svg({ width: 400, height: 400 }).parseSVGElement(svgEl)
      ).toMatchSnapshot()
    })
    // TODO: Fix width, height
    it('toJson', () => {
      expect(svg.toJson()).toMatchSnapshot()
    })
    it('toElement', () => {
      const el = svgObjectToElement(svg.toJson())
      expect(el).toMatchSnapshot()
    })
    // TODO: replace image snapshot
    it('toBase64', () => {
      expect(toBase64(svg.toJson())).toMatchSnapshot()
    })

    describe('download', () => {
      let svg: Svg
      beforeEach(() => {
        svg = new Svg({ width: 4, height: 4 })
          .addPath(
            new Path()
              .addCommand(new Command(COMMAND_TYPE.MOVE, [0, 0]))
              .addCommand(
                new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
                  0.2,
                  0.2,
                  0.6,
                  0.8,
                  1,
                  1,
                ])
              )
              .addCommand(
                new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
                  1.4,
                  1.2,
                  1.6,
                  1.2,
                  2,
                  1,
                ])
              )
              .addCommand(
                new Command(COMMAND_TYPE.CUBIC_BEZIER_CURVE, [
                  2.4,
                  0.8,
                  2.8,
                  0.2,
                  3,
                  0,
                ])
              )
          )
          .addPath(
            new Path({
              strokeLinecap: 'square',
              strokeLinejoin: 'mitter',
            })
              .addCommand(new Command(COMMAND_TYPE.MOVE, [4, 4]))
              .addCommand(new Command(COMMAND_TYPE.LINE, [9, 4]))
              .addCommand(new Command(COMMAND_TYPE.LINE, [9, 8]))
              .addCommand(new Command(COMMAND_TYPE.LINE, [3, 0]))
              .addCommand(new Command(COMMAND_TYPE.CLOSE))
          )
      })

      it('svg download', () => {
        expect.assertions(1)
        const testDownload = (param: any): void => {
          expect(param).toMatchSnapshot()
        }
        download(svg, { extension: 'svg' }, testDownload)
      })
      // TODO: Fix download test
      it.skip('jpg download', (done) => {
        expect.assertions(1)
        const testDownload = (param: any): void => {
          expect(param).toMatchSnapshot()
        }
        download(svg, { extension: 'jpg' }, testDownload)
      }, 30000)
      it.skip('png download', (done) => {
        expect.assertions(1)
        const testDownload = (param: any): void => {
          expect(param).toMatchSnapshot()
        }
        download(svg, { extension: 'png' }, testDownload)
      }, 30000)
    })
  })
})
