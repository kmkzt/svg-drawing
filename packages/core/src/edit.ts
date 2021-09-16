import { Command, Path, Point, Svg } from './svg'
import type {
  PointObject,
  ControlPoint,
  BoundingBox,
  PathObject,
  Selecting,
  EditSvgObject,
  EditPathObject,
  ResizeBoundingBoxBase,
} from './types'

const genOutline = (points: PointObject[]) =>
  points.reduce(
    (str, po, i) => (i === 0 ? `M ${po.x} ${po.y}` : str + `L ${po.x} ${po.y}`),
    ''
  )

const fallbackBoundingBox: BoundingBox = {
  min: { x: 0, y: 0 },
  max: { x: 0, y: 0 },
}

const getResizeEditObject = (
  resizeBase: ResizeBoundingBoxBase,
  boundingBox: BoundingBox,
  translatePoint: PointObject
): { scale: PointObject; move: PointObject } => {
  const movePoint = {
    x: translatePoint.x - resizeBase.point.x,
    y: translatePoint.y - resizeBase.point.y,
  }

  const width = boundingBox.max.x - boundingBox.min.x
  const height = boundingBox.max.y - boundingBox.min.y

  switch (resizeBase.fixedType) {
    case 'LeftTop': {
      const scale = {
        x: (width - movePoint.x) / width,
        y: (height - movePoint.y) / height,
      }
      const move = {
        x: -(boundingBox.max.x * scale.x - boundingBox.max.x),
        y: -(boundingBox.max.y * scale.y - boundingBox.max.y),
      }
      return { scale, move }
    }
    case 'RightTop': {
      const scale = {
        x: (width + movePoint.x) / width,
        y: (height - movePoint.y) / height,
      }
      return {
        scale,
        move: {
          x: -(boundingBox.min.x * scale.x - boundingBox.min.x),
          y: -(boundingBox.max.y * scale.y - boundingBox.max.y),
        },
      }
    }
    case 'LeftBottom': {
      const scale = {
        x: (width - movePoint.x) / width,
        y: (height + movePoint.y) / height,
      }

      return {
        scale,
        move: {
          x: -(boundingBox.max.x * scale.x - boundingBox.max.x),
          y: -(boundingBox.min.y * scale.y - boundingBox.min.y),
        },
      }
    }
    case 'RightBottom': {
      const scale = {
        x: (width + movePoint.x) / width,
        y: (height + movePoint.y) / height,
      }
      return {
        scale,
        move: {
          x: -(boundingBox.min.x * scale.x - boundingBox.min.x),
          y: -(boundingBox.min.y * scale.y - boundingBox.min.y),
        },
      }
    }
  }
}
export class SvgEditing {
  constructor(
    public editSvg: EditSvg,
    public updater: (eSvg: EditSvg) => void = () => void 0
  ) {
    this.translate = this.translate.bind(this)
    this.translatePreview = this.translatePreview.bind(this)
    this.handleTranslateEnd = this.handleTranslateEnd.bind(this)
    this.handleTranslatePreview = this.handleTranslatePreview.bind(this)

    this.resizeBoundingBox = this.resizeBoundingBox.bind(this)
    this.resizeBoundingBoxPreview = this.resizeBoundingBoxPreview.bind(this)
    this.handleResizeBoundingBoxEnd = this.handleResizeBoundingBoxEnd.bind(this)
    this.handleResizeBoundingBoxPreview =
      this.handleResizeBoundingBoxPreview.bind(this)
  }

  public setupUpdater(upd: (eSvg: EditSvg) => void) {
    this.updater = upd
  }

  public cancelSelect() {
    this.editSvg.setupSelecting(null)
    this.updater(this.editSvg)
  }

  public select(sel: Selecting | null) {
    this.editSvg.setupSelecting(sel)
    this.updater(this.editSvg)
  }

  public deletePaths() {
    this.editSvg.delete()
    this.cancelSelect()
  }

  public changeAttributes(attrs: PathObject) {
    this.editSvg.changeAttributes(attrs)
    this.updater(this.editSvg)
  }

  public startTranslate(po: PointObject, sel?: Selecting) {
    if (sel) this.editSvg.setupSelecting(sel)
    this.editSvg.setupTranslateBsePoint(po)

    this.addTranslateListener()
  }

  public translatePreview(move: PointObject) {
    const preview = this.editSvg.preview()
    preview.translate(move)

    this.updater(preview)
  }

  public translate(move: PointObject) {
    this.editSvg.translate(move)
    this.editSvg.setupTranslateBsePoint(null)

    this.updater(this.editSvg)
  }

  private handleTranslatePreview(ev: MouseEvent | TouchEvent) {
    this.translatePreview(getPointFromEvent(ev))
  }

  private handleTranslateEnd(ev: MouseEvent | TouchEvent) {
    this.translate(getPointFromEvent(ev))
    this.removeTranslateListener()
  }

  public addTranslateListener() {
    addEventListener('mouseup', this.handleTranslateEnd)
    addEventListener('touchcancel', this.handleTranslateEnd)

    addEventListener('mousemove', this.handleTranslatePreview)
    addEventListener('touchmove', this.handleTranslatePreview)
  }

  public removeTranslateListener() {
    removeEventListener('mouseup', this.handleTranslateEnd)
    removeEventListener('touchcancel', this.handleTranslateEnd)

    removeEventListener('mousemove', this.handleTranslatePreview)
    removeEventListener('touchmove', this.handleTranslatePreview)
  }

  public startResizeBoundingBox(base: ResizeBoundingBoxBase) {
    this.editSvg.setupResizeBoundingBox(base)
    this.addResizeBoundingBoxListener()
  }
  public resizeBoundingBox(po: PointObject) {
    this.editSvg.resizeBoundingBox(po)
    this.updater(this.editSvg)

    this.removeResizeBoundingBoxListener()
  }

  public resizeBoundingBoxPreview(po: PointObject) {
    const preview = this.editSvg.preview()
    preview.resizeBoundingBox(po)

    this.updater(preview)
  }

  public handleResizeBoundingBoxPreview(ev: MouseEvent | TouchEvent) {
    this.resizeBoundingBoxPreview(getPointFromEvent(ev))
  }

  public handleResizeBoundingBoxEnd(ev: MouseEvent | TouchEvent) {
    this.resizeBoundingBox(getPointFromEvent(ev))

    this.removeResizeBoundingBoxListener()
  }

  public addResizeBoundingBoxListener() {
    addEventListener('mouseup', this.handleResizeBoundingBoxEnd)
    addEventListener('touchcancel', this.handleResizeBoundingBoxEnd)

    addEventListener('mousemove', this.handleResizeBoundingBoxPreview)
    addEventListener('touchmove', this.handleResizeBoundingBoxPreview)
  }

  public removeResizeBoundingBoxListener() {
    removeEventListener('mouseup', this.handleResizeBoundingBoxEnd)
    removeEventListener('touchcancel', this.handleResizeBoundingBoxEnd)

    removeEventListener('mousemove', this.handleResizeBoundingBoxPreview)
    removeEventListener('touchmove', this.handleResizeBoundingBoxPreview)
  }

  public cleanup() {
    this.removeTranslateListener()
    this.removeResizeBoundingBoxListener()
  }

  public static init(svg: Svg) {
    return new SvgEditing(new EditSvg(svg))
  }
}

const getPointFromEvent = (
  ev: MouseEvent | TouchEvent | PointerEvent
): PointObject => {
  if ('touches' in ev) {
    const touche = ev.touches[0]
    return {
      x: touche.clientX,
      y: touche.clientY,
    }
  }
  return {
    x: ev.clientX,
    y: ev.clientY,
  }
}

/** @todo Rename SvgEditing or Editing or SvgEdit ? */
export class EditSvg {
  public selecting: Selecting | null = null
  public translateBasePoint: PointObject | null = null
  public resizeBoundingBoxBase: ResizeBoundingBoxBase | null = null
  constructor(public svg: Svg) {}

  public setupSelecting(sel: Selecting | null) {
    this.selecting = sel
  }

  public setupTranslateBsePoint(base: PointObject | null) {
    this.translateBasePoint = base
  }

  public setupResizeBoundingBox(base: ResizeBoundingBoxBase | null) {
    this.resizeBoundingBoxBase = base
  }

  private exec(
    pathExec: (path: Path, i: { path: number }) => void,
    commandExec?: (
      command: Command,
      i: { path: number; command: number }
    ) => void,
    pointExec?: (
      point: Point,
      i: { path: number; command: number; point: number }
    ) => void
  ): void {
    for (const pathKey in this.selecting) {
      const path = this.svg.paths[+pathKey]
      const selectingCommand = this.selecting[pathKey]

      if (Object.keys(selectingCommand).length === 0 || !commandExec) {
        pathExec(path, { path: +pathKey })
        continue
      }

      for (const commandKey in selectingCommand) {
        const command = path.commands[+commandKey]
        const selectingPoint = selectingCommand[+commandKey]
        if (Object.keys(selectingPoint).length === 0 || !pointExec) {
          commandExec(command, { path: +pathKey, command: +commandKey })
          continue
        }

        selectingPoint.map((pointKey: number) => {
          const po = new Point(
            command.value[pointKey],
            command.value[pointKey + 1]
          )
          pointExec(po, {
            path: +pathKey,
            command: +commandKey,
            point: +pointKey,
          })
          command.value[pointKey] = po.x
          command.value[pointKey + 1] = po.y
        })
      }
    }
  }

  public changeAttributes({ d, ...attrs }: PathObject) {
    this.exec((path) => {
      path.attrs = {
        ...path.attrs,
        ...attrs,
      }
      if (d) path.parseCommandString(d)
    })
  }

  public translate(po: PointObject) {
    const move: PointObject = {
      x: po.x - (this.translateBasePoint?.x ?? 0),
      y: po.y - (this.translateBasePoint?.y ?? 0),
    }

    this.exec(
      (path) => path.translate(move),
      (command) => command.translate(move),
      (point) => point.translate(new Point(move.x, move.y))
    )
  }

  public scale(r: number) {
    this.exec(
      (path) => path.scale(r),
      (command) => command.scale(r),
      (point) => point.scale(r)
    )
  }

  public scaleX(r: number) {
    this.exec(
      (path) => path.scaleX(r),
      (command) => command.scaleX(r),
      (point) => point.scaleX(r)
    )
  }

  public scaleY(r: number) {
    this.exec(
      (path) => path.scaleY(r),
      (command) => command.scaleY(r),
      (point) => point.scaleY(r)
    )
  }

  public resizeBoundingBox(po: PointObject) {
    if (!this.resizeBoundingBoxBase) return

    const { move, scale } = getResizeEditObject(
      this.resizeBoundingBoxBase,
      this.boundingBox,
      po
    )

    this.exec((path) => {
      path.scaleX(scale.x)
      path.scaleY(scale.y)
      path.translate(move)
    })
  }

  /** @todo Delete points */
  public delete() {
    this.exec(
      (_p, index) => this.svg.deletePath(index.path),
      (_c, index) => {
        const path = this.svg.paths[+index.path]
        path.deleteCommand(index.command)
      }
    )
  }

  public preview(): EditSvg {
    const preview = new EditSvg(this.svg.clone())
    preview.setupSelecting(this.selecting)
    preview.setupTranslateBsePoint(this.translateBasePoint)
    preview.setupResizeBoundingBox(this.resizeBoundingBoxBase)
    return preview
  }

  public get boundingBox() {
    const listX: number[] = []
    const listY: number[] = []

    this.exec((path) => {
      const editPath = new EditPath(path.clone())

      const {
        boundingBox: {
          min: { x: cMinX, y: cMinY },
          max: { x: cMaxX, y: cMaxY },
        },
      } = editPath
      listX.push(cMinX, cMaxX)
      listY.push(cMinY, cMaxY)
    })

    return listX.length !== 0 && listY.length !== 0
      ? {
          min: { x: Math.min(...listX), y: Math.min(...listY) },
          max: { x: Math.max(...listX), y: Math.max(...listY) },
        }
      : fallbackBoundingBox
  }

  public toJson(): EditSvgObject | null {
    if (!this.selecting) return null

    const listX: number[] = []
    const listY: number[] = []

    const paths: EditSvgObject['paths'] = {}

    this.exec((path, index) => {
      const editPath = new EditPath(path.clone())
      paths[index.path] = editPath.toJson()

      const {
        boundingBox: {
          min: { x: cMinX, y: cMinY },
          max: { x: cMaxX, y: cMaxY },
        },
      } = editPath
      listX.push(cMinX, cMaxX)
      listY.push(cMinY, cMaxY)
    })

    const { min, max }: BoundingBox =
      listX.length !== 0 && listY.length !== 0
        ? {
            min: { x: Math.min(...listX), y: Math.min(...listY) },
            max: { x: Math.max(...listX), y: Math.max(...listY) },
          }
        : fallbackBoundingBox
    return {
      index: this.selecting,
      paths,
      boundingBox: {
        x: min.x,
        y: min.y,
        width: max.x - min.x,
        height: max.y - min.y,
        vertex: {
          ['LeftTop']: { x: min.x, y: min.y },
          ['RightTop']: { x: max.x, y: min.y },
          ['RightBottom']: { x: max.x, y: max.y },
          ['LeftBottom']: { x: min.x, y: max.y },
        },
      },
    }
  }
}

/** @todo Rename PathEdit ? */
export class EditPath {
  constructor(public path: Path) {}

  /** @todo Compatible relative point */
  public get points(): Point[] {
    return this.path.commands.reduce(
      (p: Point[], com) => (com.point ? [...p, com.point] : p),
      []
    )
  }

  public get controlPoints(): ControlPoint[] {
    const controlPoints: ControlPoint[] = []
    const commands = this.path.commands
    for (let i = 0; i < commands.length; i += 1) {
      const curr = commands[i]
      const next = commands[i + 1]
      const outlinePoints = [
        curr.cr?.toJson(),
        curr.point?.toJson(),
        next?.cl?.toJson(),
      ].filter(Boolean) as PointObject[]
      const points: PointObject[] = [
        curr.cl?.toJson(),
        curr.cr?.toJson(),
        curr.point?.toJson(),
      ].filter(Boolean) as PointObject[]
      controlPoints.push({
        points,
        d: genOutline(outlinePoints),
      })
    }
    return controlPoints
  }

  public get boundingBox(): BoundingBox {
    const points = this.points
    if (points.length === 0) return fallbackBoundingBox
    let minX = points[0].x
    let minY = points[0].y
    let maxX = points[0].x
    let maxY = points[0].y
    for (let i = 1; i < points.length; i += 1) {
      const po = points[i]
      if (po.x < minX) minX = po.x
      if (po.x > maxX) maxX = po.x
      if (po.y < minY) minY = po.y
      if (po.y > maxY) maxY = po.y
    }

    return {
      min: { x: minX, y: minY },
      max: { x: maxX, y: maxY },
    }
  }

  public toJson(): EditPathObject {
    return {
      d: this.path.getCommandString(),
      boundingBox: this.boundingBox,
      controlPoints: this.controlPoints,
    }
  }
}
