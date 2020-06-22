import { Renderer } from './renderer'
import { Path, Point, COMMAND_TYPE, Command } from './svg'

describe('renderer.ts', () => {
  describe('Renderer', () => {
    let renderer: Renderer
    beforeEach(() => {
      const el = document.createElement('div')
      renderer = new Renderer(el)
        .addPath(
          new Path()
            .addCommand(new Command(COMMAND_TYPE.MOVE, [0, 0]))
            .addCommand(
              new Command(COMMAND_TYPE.CURVE, [0.2, 0.2, 0.6, 0.8, 1, 1])
            )
            .addCommand(
              new Command(COMMAND_TYPE.CURVE, [1.4, 1.2, 1.6, 1.2, 2, 1])
            )
            .addCommand(
              new Command(COMMAND_TYPE.CURVE, [2.4, 0.8, 2.8, 0.2, 3, 0])
            )
        )
        .addPath(
          new Path({
            attrs: {
              strokeLinecap: 'square',
              strokeLinejoin: 'mitter'
            }
          })
            .addCommand(new Command(COMMAND_TYPE.MOVE, [4, 4]))
            .addCommand(new Command(COMMAND_TYPE.LINE, [9, 4]))
            .addCommand(new Command(COMMAND_TYPE.LINE, [9, 8]))
            .addCommand(new Command(COMMAND_TYPE.LINE, [3, 0]))
            .addCommand(new Command(COMMAND_TYPE.CLOSE))
        )
    })

    it('download svg', () => {
      const testDownload = (param: any): void => {
        expect(param).toMatchSnapshot()
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
