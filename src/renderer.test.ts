import { Renderer } from './renderer'
import { Path, Point } from './svg'

describe('renderer', () => {
  describe('Renderer', () => {
    let renderer: Renderer
    beforeEach(() => {
      const el = document.createElement('div')
      renderer = new Renderer(el)

        .addPath(
          new Path({ curve: true, close: false })
            .addCommand(new Point(0, 0))
            .addCommand(new Point(1, 1))
            .addCommand(new Point(2, 1))
            .addCommand(new Point(3, 0))
        )
        .addPath(
          new Path({ curve: false, close: true })
            .addCommand(new Point(4, 4))
            .addCommand(new Point(9, 4))
            .addCommand(new Point(9, 8))
            .addCommand(new Point(3, 0))
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
