import { Renderer } from './renderer'
import { Path, Point } from './svg'

describe('renderer', () => {
  describe('Renderer', () => {
    let renderer: Renderer
    beforeEach(() => {
      const el = document.createElement('div')
      renderer = new Renderer(el)

        .addPath(
          new Path({ circuler: true, close: false })
            .addPoint(new Point(0, 0))
            .addPoint(new Point(1, 1))
            .addPoint(new Point(2, 1))
            .addPoint(new Point(3, 0))
            .formatCommand()
        )
        .addPath(
          new Path({ circuler: false, close: true })
            .addPoint(new Point(4, 4))
            .addPoint(new Point(9, 4))
            .addPoint(new Point(9, 8))
            .addPoint(new Point(3, 0))
            .formatCommand()
        )
    })
    it('download svg', done => {
      const testDownload = (param: any): void => {
        expect(param).toMatchSnapshot()
        done()
      }
      renderer.download('svg', testDownload)
    })
    // TODO: Fix download test
    // it('download jpg', done => {
    //   const testDownload = (param: any): void => {
    //     expect(param).toMatchSnapshot()
    //     done()
    //   }
    //   renderer.download('jpg', testDownload)
    // }, 30000)
    // it('download png', done => {
    //   const testDownload = (param: any): void => {
    //     expect(param).toMatchSnapshot()
    //     done()
    //   }
    //   renderer.download('png', testDownload)
    // }, 30000)
  })
})
