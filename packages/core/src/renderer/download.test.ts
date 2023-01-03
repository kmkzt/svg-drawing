import { Download } from './download'
import { toElement } from './svgRenderer'
import { Path } from '../svg/path'
import { Svg } from '../svg/svg'

describe('download.ts', () => {
  const svg = new Svg({ width: 4, height: 4 })
    .addElement(
      new Path().addCommand([
        { type: 'M', values: [0, 0] },
        { type: 'C', values: [0.2, 0.2, 0.6, 0.8, 1, 1] },
        { type: 'C', values: [1.4, 1.2, 1.6, 1.2, 2, 1] },
        { type: 'C', values: [2.4, 0.8, 2.8, 0.2, 3, 0] },
      ])
    )
    .addElement(
      new Path({
        strokeLinecap: 'square',
        strokeLinejoin: 'miter',
      }).addCommand([
        { type: 'M', values: [4, 4] },
        { type: 'L', values: [9, 4] },
        { type: 'L', values: [9, 8] },
        { type: 'L', values: [3, 0] },
        { type: 'Z', values: [] },
      ])
    )
  const svgElement = toElement({ svg: svg.toJson() })

  it('toBase64', () => {
    expect(new Download(svgElement).toBase64()).toMatchInlineSnapshot(
      `"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGRhdGEtZWRpdC10eXBlPSJmcmFtZSI+PHBhdGggZD0iTTAgMCBjMC4yIDAuMiAwLjYgMC44IDEgMSBjMC40IDAuMiAwLjYgMC4yIDEgMCBjMC40IC0wLjIgMC44IC0wLjggMSAtMSIgZGF0YS1lZGl0LXR5cGU9InBhdGgiIGRhdGEtZWxlbWVudC1rZXk9InAxIj48L3BhdGg+PHBhdGggZD0iTTQgNCBsNSAwIGwwIDQgbC02IC04IHoiIGRhdGEtZWRpdC10eXBlPSJwYXRoIiBkYXRhLWVsZW1lbnQta2V5PSJwMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PC9wYXRoPjwvc3ZnPg=="`
    )
  })

  it('download', () => {
    expect.assertions(1)
    const testDownload = (param: any): void => {
      expect(param).toMatchInlineSnapshot(`
        Object {
          "data": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGRhdGEtZWRpdC10eXBlPSJmcmFtZSI+PHBhdGggZD0iTTAgMCBjMC4yIDAuMiAwLjYgMC44IDEgMSBjMC40IDAuMiAwLjYgMC4yIDEgMCBjMC40IC0wLjIgMC44IC0wLjggMSAtMSIgZGF0YS1lZGl0LXR5cGU9InBhdGgiIGRhdGEtZWxlbWVudC1rZXk9InAxIj48L3BhdGg+PHBhdGggZD0iTTQgNCBsNSAwIGwwIDQgbC02IC04IHoiIGRhdGEtZWRpdC10eXBlPSJwYXRoIiBkYXRhLWVsZW1lbnQta2V5PSJwMiIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciI+PC9wYXRoPjwvc3ZnPg==",
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
