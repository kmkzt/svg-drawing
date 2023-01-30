export class PressedKeyHandler {
  pressed: boolean
  constructor(private key: string) {
    this.pressed = false

    this.handleOn = this.handleOn.bind(this)
    this.handleOff = this.handleOff.bind(this)
  }

  handleOn(ev: KeyboardEvent) {
    if (ev.key !== this.key) return
    this.pressed = true
  }

  handleOff(ev: KeyboardEvent) {
    if (ev.key !== this.key) return
    this.pressed = false
  }

  start() {
    addEventListener('keydown', this.handleOn)
    addEventListener('keyup', this.handleOff)
  }

  end() {
    removeEventListener('keydown', this.handleOn)
    removeEventListener('keyup', this.handleOff)
  }
}
