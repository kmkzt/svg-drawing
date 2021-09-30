import { download, toBase64 } from './download'
import { Svg, Path, Move, Point, Curve, Line, Close } from './svg'

describe('download.ts', () => {
  const svg = new Svg({ width: 4, height: 4 })
    .addPath(
      new Path()
        .addCommand(new Move(new Point(0, 0)))
        .addCommand(
          new Curve([new Point(0.2, 0.2), new Point(0.6, 0.8), new Point(1, 1)])
        )
        .addCommand(
          new Curve([new Point(1.4, 1.2), new Point(1.6, 1.2), new Point(2, 1)])
        )
        .addCommand(
          new Curve([new Point(1.4, 1.2), new Point(1.6, 1.2), new Point(2, 1)])
        )
        .addCommand(
          new Curve([new Point(2.4, 0.8), new Point(2.8, 0.2), new Point(3, 0)])
        )
    )
    .addPath(
      new Path({
        strokeLinecap: 'square',
        strokeLinejoin: 'mitter',
      })
        .addCommand(new Move(new Point(4, 4)))
        .addCommand(new Line(new Point(9, 4)))
        .addCommand(new Line(new Point(9, 8)))
        .addCommand(new Line(new Point(3, 0)))
        .addCommand(new Close())
    )

  it('toBase64', () => {
    expect(toBase64(svg.toJson())).toMatchSnapshot()
  })

  it('download', () => {
    expect.assertions(1)
    const testDownload = (param: any): void => {
      expect(param).toMatchSnapshot()
    }
    download(svg, { extension: 'svg' }, testDownload)
  })

  it.skip('jpg download', (done) => { // eslint-disable-line
    expect.assertions(1)
    const testDownload = (param: any): void => {
      expect(param).toMatchSnapshot()
    }
    download(svg, { extension: 'jpg' }, testDownload)
  }, 30000)

  it.skip('png download', (done) => { // eslint-disable-line
    expect.assertions(1)
    const testDownload = (param: any): void => {
      expect(param).toMatchSnapshot()
    }
    download(svg, { extension: 'png' }, testDownload)
  }, 30000)
})
