export class PressedKeyHandler {
  private _key: string | null = null
  constructor() {
    this.handleOn = this.handleOn.bind(this)
    this.handleOff = this.handleOff.bind(this)
  }

  get key() {
    return this._key
  }

  private handleOn(ev: KeyboardEvent) {
    this._key = ev.key
  }

  private handleOff() {
    this._key = null
  }

  setup() {
    addEventListener('keydown', this.handleOn)
    addEventListener('keyup', this.handleOff)
  }

  cleanup() {
    removeEventListener('keydown', this.handleOn)
    removeEventListener('keyup', this.handleOff)
  }
}
