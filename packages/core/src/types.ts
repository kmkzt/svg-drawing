export type DrawHandlerCallback = {
  start: () => void
  end: () => void
  move: (x: number, y: number) => void
  resize?: (x: number, y: number) => void
}

export type ResizeHandlerCallback = {
  resize: (
    rect: DOMRect | { width: number; height: number; left: number; top: number }
  ) => void
}
