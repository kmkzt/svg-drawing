export interface DrawingEventHandler {
  start: () => void
  end: () => void
  move: (x: number, y: number) => void
  resize?: (x: number, y: number) => void
}
