import { Svg, Path, Command, COMMAND_TYPE } from './svg'
import { download, toBase64 } from './download'

describe('download.ts', () => {
  const svg = new Svg({ width: 4, height: 4 })
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
