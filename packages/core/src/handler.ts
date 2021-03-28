import {
  DrawHandlerCallback,
  ResizeHandlerCallback,
  ListenerMaps,
  DrawListenerType,
  DrawEventHandler,
  ClearListener,
} from './types'

export const getPassiveOptions = (
  passive = true
): boolean | { passive: boolean } => {
  try {
    const check = () => null
    addEventListener('testPassive', check, { passive })
    removeEventListener('testPassive', check)
    return { passive }
  } catch (e) {
    return false
  }
}

export class DrawHandler implements DrawEventHandler {
  /**
   * Remove EventList
   */
  protected _clearEventList: Array<ClearListener>
  /**
   * addEventListener Options
   */
  protected _listenerOption: ReturnType<typeof getPassiveOptions>
  /**
   * Offset coordinates
   */
  protected _left: number
  protected _top: number
  /**
   * EventHandler
   */
  public end: DrawHandlerCallback['end']
  public start: DrawHandlerCallback['start']
  public move: DrawHandlerCallback['move']
  constructor(
    protected _el: HTMLElement,
    { end, start, move }: DrawHandlerCallback
  ) {
    /**
     * Bind property from arguments.
     */
    this.end = end
    this.start = start
    this.move = move
    /**
     * Set offset coordinates
     */
    const { left, top } = _el.getBoundingClientRect()
    this._left = left
    this._top = top
    /**
     * Setup property.
     */
    this._clearEventList = []
    this._listenerOption = getPassiveOptions(false)
  }

  /**
   * Exec removeEventListener
   */
  public off() {
    this._clearEventList.map((fn) => fn())
    this._clearEventList = []
  }

  public on() {
    this.off()
    this._clearEventList = [
      ...this._setupCoordinatesListener(),
      ...this._setupListener(),
    ]
  }

  protected _setupListener(): Array<ClearListener> {
    return []
  }

  private _setupCoordinatesListener(): Array<ClearListener> {
    const handleEvent = (_ev: Event) => {
      const { left, top } = this._el.getBoundingClientRect()
      this._left = left
      this._top = top
    }
    addEventListener('scroll', handleEvent)
    this._el.addEventListener('resize', handleEvent)
    return [
      () => {
        removeEventListener('scroll', handleEvent)
        this._el.removeEventListener('resize', handleEvent)
      },
    ]
  }
}

export class PencilHandler extends DrawHandler implements DrawHandler {
  private _eventMap: ListenerMaps = {
    pointer: {
      start: ['pointerdown'],
      move: ['pointermove'],
      end: ['pointerleave', 'pointercancel'],
      flameout: ['pointerup'],
    },
    touch: {
      start: ['touchstart'],
      move: ['touchmove'],
      end: ['touchend'],
      flameout: ['touchcancel'],
    },
    mouse: {
      start: ['mousedown'],
      move: ['mousemove'],
      end: ['mouseleave', 'mouseout'],
      flameout: ['mouseup'],
    },
  }

  constructor(el: HTMLElement, callback: DrawHandlerCallback) {
    super(el, callback)
    /**
     * Bind methods
     */
    this._handleStart = this._handleStart.bind(this)
    this._handleMove = this._handleMove.bind(this)
    this._handleEnd = this._handleEnd.bind(this)
  }

  protected _setupListener(): Array<ClearListener> {
    const clearEvent: Array<ClearListener> = []
    if (window.PointerEvent) {
      clearEvent.push(...this._setupDrawListener('pointer'))
    } else {
      clearEvent.push(...this._setupDrawListener('mouse'))
    }
    if ('ontouchstart' in window) {
      clearEvent.push(...this._setupDrawListener('touch'))
    }
    return clearEvent
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
      this.move({
        x: touch.clientX - this._left,
        y: touch.clientY - this._top,
        pressure: touch.force,
      })
      return
    }
    if (ev instanceof PointerEvent) {
      this.move({
        x: ev.clientX - this._left,
        y: ev.clientY - this._top,
        pressure: ev.pressure,
      })
      return
    }
    if (ev instanceof MouseEvent) {
      this.move({
        x: ev.clientX - this._left,
        y: ev.clientY - this._top,
        pressure: (ev as any)?.pressure,
      })
      return
    }
  }

  private _setupDrawListener(type: DrawListenerType): Array<() => void> {
    const { start, move, end, flameout } = this._eventMap[type]
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
    const flameoutClear = flameout.map((evname): (() => void) => {
      addEventListener(evname, this._handleEnd, this._listenerOption)
      return () => removeEventListener(evname, this._handleEnd)
    })
    return [...startClear, ...moveClear, ...endClear, ...flameoutClear]
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
    this._clearEventList = []
  }
  public on() {
    this.off()
    this._setupListener()
  }

  private _setupListener(): void {
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
      addEventListener('resize', handleResizeEvent)
      this._clearEventList.push(() =>
        removeEventListener('resize', handleResizeEvent)
      )
    }
  }
}
