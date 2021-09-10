import { Svg, Path, Command } from './svg'
import { download, toBase64 } from './download'

describe('download.ts', () => {
  const svg = new Svg({ width: 4, height: 4 })
    .addPath(
      new Path()
        .addCommand(new Command('M', [0, 0]))
        .addCommand(new Command('C', [0.2, 0.2, 0.6, 0.8, 1, 1]))
        .addCommand(new Command('C', [1.4, 1.2, 1.6, 1.2, 2, 1]))
        .addCommand(new Command('C', [2.4, 0.8, 2.8, 0.2, 3, 0]))
    )
    .addPath(
      new Path({
        strokeLinecap: 'square',
        strokeLinejoin: 'mitter',
      })
        .addCommand(new Command('M', [4, 4]))
        .addCommand(new Command('L', [9, 4]))
        .addCommand(new Command('L', [9, 8]))
        .addCommand(new Command('L', [3, 0]))
        .addCommand(new Command('Z'))
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
