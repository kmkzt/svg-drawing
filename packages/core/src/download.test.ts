import { Download } from './download'
import { svgObjectToElement } from './renderer'
import { Path } from './svg/path'
import { Point } from './svg/point'
import { Svg } from './svg/svg'

describe('download.ts', () => {
  const svg = new Svg({ width: 4, height: 4 })
    .addPath(
      new Path()
        .addCommand({ type: 'M', values: [0, 0] })
        .addCommand({ type: 'C', values: [0.2, 0.2, 0.6, 0.8, 1, 1] })
        .addCommand({ type: 'C', values: [1.4, 1.2, 1.6, 1.2, 2, 1] })
        .addCommand({ type: 'C', values: [2.4, 0.8, 2.8, 0.2, 3, 0] })
    )
    .addPath(
      new Path({
        strokeLinecap: 'square',
        strokeLinejoin: 'mitter',
      })
        .addCommand({ type: 'M', values: [4, 4] })
        .addCommand({ type: 'L', values: [9, 4] })
        .addCommand({ type: 'L', values: [9, 8] })
        .addCommand({ type: 'L', values: [3, 0] })
        .addCommand({ type: 'Z', values: [] })
    )
  const svgElement = svgObjectToElement(svg.toJson())

  it('toBase64', () => {
    expect(new Download(svgElement).toBase64()).toMatchInlineSnapshot(
      `"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIGhlaWdodD0iNCIgd2lkdGg9IjQiPjxwYXRoIGQ9Ik0wIDAgYzAuMiAwLjIgMC42IDAuOCAxIDEgYzAuNCAwLjIgMC42IDAuMiAxIDAgYzAuNCAtMC4yIDAuOCAtMC44IDEgLTEiPjwvcGF0aD48cGF0aCBkPSJNNCA0IGw1IDAgbDAgNCBsLTYgLTggeiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXR0ZXIiPjwvcGF0aD48L3N2Zz4="`
    )
  })

  it('download', () => {
    expect.assertions(1)
    const testDownload = (param: any): void => {
      expect(param).toMatchInlineSnapshot(`
        Object {
          "data": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIGhlaWdodD0iNCIgd2lkdGg9IjQiPjxwYXRoIGQ9Ik0wIDAgYzAuMiAwLjIgMC42IDAuOCAxIDEgYzAuNCAwLjIgMC42IDAuMiAxIDAgYzAuNCAtMC4yIDAuOCAtMC44IDEgLTEiPjwvcGF0aD48cGF0aCBkPSJNNCA0IGw1IDAgbDAgNCBsLTYgLTggeiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXR0ZXIiPjwvcGF0aD48L3N2Zz4=",
          "extension": "svg",
          "filename": "download.svg",
        }
      `)
    }
    new Download(svgElement, testDownload).svg('download.svg')
  })

  it.skip('jpg download', (done) => {
    // eslint-disable-line
    expect.assertions(1)
    const testDownload = (param: any): void => {
      expect(param).toMatchInlineSnapshot()
    }
    new Download(svgElement, testDownload).jpg('download.jpg')
  }, 30000)

  it.skip('png download', (done) => {
    // eslint-disable-line
    expect.assertions(1)
    const testDownload = (param: any): void => {
      expect(param).toMatchInlineSnapshot()
    }
    new Download(svgElement, testDownload).png('download.png')
  }, 30000)
})
