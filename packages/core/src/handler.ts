import {
  DrawHandlerCallback,
  ResizeHandlerCallback,
  ListenerMaps,
  DrawType,
} from './types'
import { getPassiveOptions } from './shared/getPassiveOptions'

const listenerMaps: ListenerMaps = {
  pointer: {
    start: ['pointerdown'],
    move: ['pointermove'],
    end: ['pointerleave', 'pointercancel'],
    frameout: ['pointerup'],
  },
  touch: {
    start: ['touchstart'],
    move: ['touchmove'],
    end: ['touchend'],
    frameout: ['touchcancel'],
  },
  mouse: {
    start: ['mousedown'],
    move: ['mousemove'],
    end: ['mouseleave', 'mouseout'],
    frameout: ['mouseup'],
  },
}

export class DrawHandler {
  /**
   * Remove EventList
   */
  private _clearEventList: Array<() => void>
  /**
   * addEventListener Options
   */
  private _listenerOption: ReturnType<typeof getPassiveOptions>
  /**
   * EventHandler
   */
  public end: DrawHandlerCallback['end']
  public start: DrawHandlerCallback['start']
  public move: DrawHandlerCallback['move']
  constructor(
    private _el: HTMLElement,
    { end, start, move }: DrawHandlerCallback
  ) {
    /**
     * Bind property from arguments.
     */
    this.end = end
    this.start = start
    this.move = move
    /**
     * Setup property.
     */
    this._clearEventList = []
    this._listenerOption = getPassiveOptions(false)
    /**
     * Bind mthods
     */
    this._handleStart = this._handleStart.bind(this)
    this._handleMove = this._handleMove.bind(this)
    this._handleEnd = this._handleEnd.bind(this)
  }

  /**
   * Exec removeEventListener
   */
  public off() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []
  }

  /**
   * Exec addEventListener
   */
  public on(): void {
    this.off()

    if (window.PointerEvent) {
      this._setupListener('pointer')
    } else {
      this._setupListener('mouse')
    }
    if ('ontouchstart' in window) {
      this._setupListener('touch')
    }
  }

  private _handleStart(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.start()
  }

  private _handleEnd(ev: TouchEvent | MouseEvent | PointerEvent) {
    ev.preventDefault()
    this.end()
  }

  private _handleMove(ev: MouseEvent | PointerEvent | TouchEvent) {
    ev.preventDefault()
    if (ev instanceof TouchEvent) {
      const touch = ev.touches[0]
      this.move(touch.clientX, touch.clientY)
    } else {
      this.move(ev.clientX, ev.clientY)
    }
  }

  private _setupListener(type: DrawType): void {
    const { start, move, end, frameout } = listenerMaps[type]
    const startClear = start.map((evname): (() => void) => {
      this._el.addEventListener(evname, this._handleStart, this._listenerOption)
      return () => this._el.removeEventListener(evname, this._handleStart)
    })
    const moveClear = move.map((evname): (() => void) => {
      this._el.addEventListener(evname, this._handleMove, this._listenerOption)
      return () => this._el.removeEventListener(evname, this._handleMove)
    })
    const endClear = end.map((evname): (() => void) => {
      this._el.addEventListener(evname, this._handleEnd, this._listenerOption)
      return () => this._el.removeEventListener(evname, this._handleEnd)
    })
    const frameoutClear = frameout.map((evname): (() => void) => {
      window.addEventListener(evname, this._handleEnd, this._listenerOption)
      return () => window.removeEventListener(evname, this._handleEnd)
    })
    this._clearEventList = [
      ...this._clearEventList,
      ...startClear,
      ...moveClear,
      ...endClear,
      ...frameoutClear,
    ]
  }
}

export class ResizeHandler {
  /**
   * Remove EventList
   */
  private _clearEventList: Array<() => void>
  public resize: ResizeHandlerCallback['resize']
  constructor(private _el: HTMLElement, { resize }: ResizeHandlerCallback) {
    this.resize = resize
    this._clearEventList = []
  }

  public off() {
    this._clearEventList.map((fn) => fn())
  }
  public on() {
    this.off()
    this._setupListerner()
  }

  private _setupListerner(): void {
    if ((window as any).ResizeObserver) {
      const resizeObserver: any = new (window as any).ResizeObserver(
        ([entry]: any[]) => {
          this.resize(entry.contentRect)
        }
      )
      resizeObserver.observe(this._el)
      this._clearEventList.push(() => resizeObserver.disconnect())
    } else {
      const handleResizeEvent = () => {
        this.resize(this._el.getBoundingClientRect())
      }
      window.addEventListener('resize', handleResizeEvent)
      this._clearEventList.push(() =>
        window.removeEventListener('resize', handleResizeEvent)
      )
    }
  }
}
