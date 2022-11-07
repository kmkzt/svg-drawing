# Module: @svg-drawing/react

## Type Aliases

### AnimatePathsProps

Ƭ **AnimatePathsProps**: [`PathsProps`](svg_drawing_react.md#pathsprops) & { `animatePaths?`: `AnimationObject`  }

#### Defined in

[react/src/types.ts:94](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L94)

___

### BoundingBoxProps

Ƭ **BoundingBoxProps**: { `boundingBox`: `EditSvgObject`[``"boundingBox"``]  } & `Pick`<[`EditProps`](svg_drawing_react.md#editprops), ``"selectedOnlyPaths"`` \| ``"onSelectPaths"`` \| ``"onResizeStart"`` \| ``"onTranslateStart"``\>

#### Defined in

[react/src/types.ts:77](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L77)

___

### DrawAction

Ƭ **DrawAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `draw` | `DrawingClass` |
| `clear` | () => `PathClass`[] |
| `undo` | () => `undefined` \| `PathClass` |
| `update` | () => `void` |

#### Defined in

[react/src/types.ts:39](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L39)

___

### EditPathsProps

Ƭ **EditPathsProps**: [`PathsProps`](svg_drawing_react.md#pathsprops) & [`EditProps`](svg_drawing_react.md#editprops)

#### Defined in

[react/src/types.ts:76](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L76)

___

### EditProps

Ƭ **EditProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `boundingBox` | `EditSvgObject`[``"boundingBox"``] \| ``null`` |
| `editPaths` | `EditSvgObject`[``"paths"``] \| ``null`` |
| `selectedOnlyPaths` | `boolean` |
| `onResizeStart` | (`base`: `ResizeBoundingBoxBase`) => `void` |
| `onSelectPaths` | (`sel`: `SelectIndex` \| `SelectIndex`[]) => `void` |
| `onTranslateStart` | (`po`: `Readonly`<{ `x`: `number` ; `y`: `number`  }\>) => `void` |

#### Defined in

[react/src/types.ts:67](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L67)

___

### EditSvgAction

Ƭ **EditSvgAction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `changeAttributes` | `Editing`[``"changeAttributes"``] |
| `edit` | `Editing` |
| `editProps` | [`EditProps`](svg_drawing_react.md#editprops) |
| `keyboardMap` | [`KeyboardMap`](svg_drawing_react.md#keyboardmap) |
| `translate` | `Editing`[``"translate"``] |
| `cancelSelect` | () => `void` |
| `deletePaths` | () => `void` |
| `selectPaths` | (`sel`: `SelectIndex` \| `SelectIndex`[]) => `void` |
| `update` | () => `void` |

#### Defined in

[react/src/types.ts:55](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L55)

___

### KeyboardMap

Ƭ **KeyboardMap**: `Object`

#### Index signature

▪ [key: `string`]: () => `void` \| `undefined`

#### Defined in

[react/src/types.ts:111](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L111)

___

### PathsProps

Ƭ **PathsProps**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `paths` | `SvgObject`[``"paths"``] |

#### Defined in

[react/src/types.ts:27](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L27)

___

### SvgProps

Ƭ **SvgProps**: `HTMLAttributes`<`SVGSVGElement`\> & { `background?`: `SvgObject`[``"background"``] ; `children?`: `React.ReactNode` ; `onSelectSvg?`: () => `void`  }

#### Defined in

[react/src/types.ts:21](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L21)

___

### UseAnimation

Ƭ **UseAnimation**: (`arg`: { `onChangeAnimation`: (`obj`: ``null`` \| `AnimationObject`) => `void`  }) => { `instance`: `Animation` ; `setup`: `Animation`[``"setup"``] ; `clear`: () => `void` ; `update`: (`paths`: `PathClass`[]) => `void`  }

#### Type declaration

▸ (`arg`): `Object`

UseAnimation

##### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `Object` |
| `arg.onChangeAnimation` | (`obj`: ``null`` \| `AnimationObject`) => `void` |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `instance` | `Animation` |
| `setup` | `Animation`[``"setup"``] |
| `clear` | () => `void` |
| `update` | (`paths`: `PathClass`[]) => `void` |

#### Defined in

[react/src/types.ts:85](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L85)

___

### UseDraw

Ƭ **UseDraw**: (`opts`: [`UseDrawOptions`](svg_drawing_react.md#usedrawoptions)) => [`DrawAction`](svg_drawing_react.md#drawaction)

#### Type declaration

▸ (`opts`): [`DrawAction`](svg_drawing_react.md#drawaction)

UseDraw

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`UseDrawOptions`](svg_drawing_react.md#usedrawoptions) |

##### Returns

[`DrawAction`](svg_drawing_react.md#drawaction)

#### Defined in

[react/src/types.ts:32](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L32)

___

### UseDrawEventHandler

Ƭ **UseDrawEventHandler**<`E`\>: (`ref`: `RefObject`<`E`\>, `drawing`: `DrawingClass`, `active?`: `boolean`) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `HTMLElement` = `HTMLElement` |

#### Type declaration

▸ (`ref`, `drawing`, `active?`): `void`

UseDrawEventHandler

##### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `RefObject`<`E`\> |
| `drawing` | `DrawingClass` |
| `active?` | `boolean` |

##### Returns

`void`

#### Defined in

[react/src/types.ts:98](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L98)

___

### UseDrawOptions

Ƭ **UseDrawOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `factory` | `DrawFactory` |
| `svg` | `SvgClass` |
| `onChangeSvg` | (`obj`: `SvgObject`) => `void` |

#### Defined in

[react/src/types.ts:34](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L34)

___

### UseEdit

Ƭ **UseEdit**: (`opts`: { `editSvgObject`: `EditSvgObject` \| ``null`` ; `multipleSelectBindKey?`: `string` ; `svg`: `SvgClass` ; `onChangeEdit`: (`arg`: ``null`` \| `EditSvgObject`) => `void` ; `onChangeSvg`: (`obj`: `SvgObject`) => `void`  }) => [`EditSvgAction`](svg_drawing_react.md#editsvgaction)

#### Type declaration

▸ (`opts`): [`EditSvgAction`](svg_drawing_react.md#editsvgaction)

UseEdit

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.editSvgObject` | `EditSvgObject` \| ``null`` |
| `opts.multipleSelectBindKey?` | `string` |
| `opts.svg` | `SvgClass` |
| `opts.onChangeEdit` | (`arg`: ``null`` \| `EditSvgObject`) => `void` |
| `opts.onChangeSvg` | (`obj`: `SvgObject`) => `void` |

##### Returns

[`EditSvgAction`](svg_drawing_react.md#editsvgaction)

#### Defined in

[react/src/types.ts:47](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L47)

___

### UseParseFile

Ƭ **UseParseFile**: (`opts`: { `svg`: `SvgClass`  }) => (`file`: `File`) => `Promise`<`void`\>

#### Type declaration

▸ (`opts`): (`file`: `File`) => `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.svg` | `SvgClass` |

##### Returns

`fn`

▸ (`file`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `File` |

##### Returns

`Promise`<`void`\>

#### Defined in

[react/src/types.ts:115](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L115)

___

### UseResize

Ƭ **UseResize**<`T`\>: (`ref`: `RefObject`<`T`\>, `onResize`: `ResizeCallback`, `active?`: `boolean`) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `HTMLElement` = `HTMLElement` |

#### Type declaration

▸ (`ref`, `onResize`, `active?`): `void`

UseResize

##### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `RefObject`<`T`\> |
| `onResize` | `ResizeCallback` |
| `active?` | `boolean` |

##### Returns

`void`

#### Defined in

[react/src/types.ts:105](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L105)

___

### UseSvg

Ƭ **UseSvg**: (`opts`: `Partial`<`SvgOption`\>) => `SvgClass`

#### Type declaration

▸ (`opts`): `SvgClass`

UseSvg

##### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Partial`<`SvgOption`\> |

##### Returns

`SvgClass`

#### Defined in

[react/src/types.ts:20](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/types.ts#L20)

## Functions

### AnimatePaths

▸ **AnimatePaths**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`AnimatePathsProps`](svg_drawing_react.md#animatepathsprops) |

#### Returns

`Element`

#### Defined in

[react/src/components/Animate.tsx:4](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/components/Animate.tsx#L4)

___

### BackgroundRect

▸ **BackgroundRect**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.fill` | `undefined` \| `string` |

#### Returns

`Element`

#### Defined in

[react/src/components/BackgroundRect.tsx:4](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/components/BackgroundRect.tsx#L4)

___

### EditPaths

▸ **EditPaths**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`EditPathsProps`](svg_drawing_react.md#editpathsprops) |

#### Returns

`Element`

#### Defined in

[react/src/components/Edit.tsx:10](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/components/Edit.tsx#L10)

___

### Paths

▸ **Paths**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`PathsProps`](svg_drawing_react.md#pathsprops) |

#### Returns

`Element`

#### Defined in

[react/src/components/Paths.tsx:4](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/components/Paths.tsx#L4)

___

### Svg

▸ **Svg**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SvgProps`](svg_drawing_react.md#svgprops) |

#### Returns

`Element`

#### Defined in

[react/src/components/Svg.tsx:5](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/components/Svg.tsx#L5)

___

### useAnimation

▸ **useAnimation**(`arg`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `Object` |
| `arg.onChangeAnimation` | (`obj`: ``null`` \| `AnimationObject`) => `void` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `instance` | `Animation` |
| `setup` | (`frame`: `FrameAnimation`, `opts?`: { `ms?`: `number` ; `repeatCount?`: `number`  }) => `void` |
| `clear` | () => `void` |
| `update` | (`paths`: `PathClass`[]) => `void` |

#### Defined in

[react/src/hooks/useAnimation.ts:5](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useAnimation.ts#L5)

___

### useDraw

▸ **useDraw**(`opts`): [`DrawAction`](svg_drawing_react.md#drawaction)

### Basic usage.

```ts
import { PencilHandler } from '@svg-drawing/core'
import {
  Svg,
  useDrawFactory,
  useDrawEventHandler,
} from '@svg-drawing/react'

const DrawArea = () => {
  const svg = useSvg({ width: 500, height: 500 })
  const [svgObject, setSvgObject] = useState(svg.toJson())

  const factory = useDrawFactory(
    { stroke: '#000', fill: 'none' },
    { curve: true, close: false }
  )

  const draw = useDraw({
    svg,
    factory,
    onChangeSvg: setSvgObject,
  })

  const ref = useRef(null)
  const handler = usePencilHandler(ref, draw, true)

  return (
    <div ref={ref}>
      <Svg {...svgObject} />
    </div>
  )
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`UseDrawOptions`](svg_drawing_react.md#usedrawoptions) |

#### Returns

[`DrawAction`](svg_drawing_react.md#drawaction)

#### Defined in

[react/src/hooks/useDraw.ts:43](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useDraw.ts#L43)

___

### useDrawEventHandler

▸ **useDrawEventHandler**<`E`\>(`__namedParameters`): `void`

**`example`** useDrawEventHandler

```ts
const ref = useRef(null)
const handler = useSetupHandler(setup, drawing)

UseDrawEventHandler({ ref, handler })
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `E` | extends `HTMLElement` = `HTMLElement` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.active?` | `boolean` |
| `__namedParameters.handler` | `DrawEventHandler` |
| `__namedParameters.ref` | `RefObject`<`E`\> |

#### Returns

`void`

#### Defined in

[react/src/hooks/useDrawEventHandler.ts:17](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useDrawEventHandler.ts#L17)

___

### useDrawFactory

▸ **useDrawFactory**(`pathAttrs`, `__namedParameters`): `DrawFactory`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathAttrs` | `PathAttributes` |
| `__namedParameters` | `Object` |
| `__namedParameters.close` | `boolean` |
| `__namedParameters.curve` | `boolean` |

#### Returns

`DrawFactory`

#### Defined in

[react/src/hooks/useDrawFactory.ts:5](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useDrawFactory.ts#L5)

___

### useEdit

▸ **useEdit**(`opts`): [`EditSvgAction`](svg_drawing_react.md#editsvgaction)

### Basic usage.

```ts
import { useEdit, Svg, EditPaths } from '@svg-drawing/react'
import type { EditSvgObject } from '@svg-drawing/core'

const EditExample = ({ sharedSvg }) => {
  const [{ paths, ...svgProps }, onChangeSvg] = useState(
    sharedSvg.toJson()
  )
  const [editSvgObject, onChangeEdit] = useState<EditSvgObject | null>(
    null
  )

  const { editProps, cancelSelect } = useEdit({
    svg: sharedSvg,
    editSvgObject,
    onChangeEdit,
    onChangeSvg,
  })

  return (
    <div
      style={{
        border: '1px solid #333',
        width: 500,
        height: 500,
        touchAction: 'none',
        boxSizing: 'border-box',
      }}
    >
      <Svg {...svgProps} onSelectSvg={cancelSelect}>
        <EditPaths paths={paths} {...editProps} />
      </Svg>
    </div>
  )
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.editSvgObject` | ``null`` \| `EditSvgObject` |
| `opts.multipleSelectBindKey?` | `string` |
| `opts.svg` | `SvgClass` |
| `opts.onChangeEdit` | (`arg`: ``null`` \| `EditSvgObject`) => `void` |
| `opts.onChangeSvg` | (`obj`: `SvgObject`) => `void` |

#### Returns

[`EditSvgAction`](svg_drawing_react.md#editsvgaction)

#### Defined in

[react/src/hooks/useEdit.ts:52](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useEdit.ts#L52)

___

### useKeyboardBind

▸ **useKeyboardBind**(`keyboardMap?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyboardMap` | [`KeyboardMap`](svg_drawing_react.md#keyboardmap) |

#### Returns

`void`

#### Defined in

[react/src/hooks/useKeyboardBind.ts:4](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useKeyboardBind.ts#L4)

___

### useParseFile

▸ **useParseFile**(`opts`): (`file`: `File`) => `Promise`<`void`\>

### Load svg from uploaded file.

```ts
import { useSvg, useParseFile } from '@svg-drawing/react'

const svg = useSvg({ width: 500, height: 500 })
const parseFile = useParseFile({ svg })

const onChangeFile = useCallback<ChangeEventHandler<HTMLInputElement>>(
  async (e) => {
    if (!e.target?.files) return
    await parseFile(e.target.files[0])
  },
  []
)

return <input type="file" onChange={onChangeFile} />
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Object` |
| `opts.svg` | `SvgClass` |

#### Returns

`fn`

▸ (`file`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `File` |

##### Returns

`Promise`<`void`\>

#### Defined in

[react/src/hooks/useParseFile.ts:26](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useParseFile.ts#L26)

___

### usePenHandler

▸ **usePenHandler**(`ref`, `drawing`, `active?`): `void`

**`example`**

```ts
import { usePenHandler } from '@svg-drawing/react'

const draw = useDraw({...}) const ref = uesRef<HTMLElement>(null)

usePenHandler(ref, draw)
```

**`example`** Switch active status

```ts
import { usePenHandler } from '@svg-drawing/react'

const draw = useDraw(opts)
const ref = useRef(null)
const [active, setActive] = useState(true)

usePenHandler(ref, draw, active)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `RefObject`<`HTMLElement`\> |
| `drawing` | `DrawingClass` |
| `active?` | `boolean` |

#### Returns

`void`

#### Defined in

[react/src/hooks/useDrawEventHandler.ts:90](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useDrawEventHandler.ts#L90)

___

### usePencilHandler

▸ **usePencilHandler**(`ref`, `drawing`, `active?`): `void`

**`example`**

```ts
import { usePencilHandler } from '@svg-drawing/react'

const draw = useDraw({...}) const ref = uesRef<HTMLElement>(null)

usePencilHandler(ref, draw)
```

**`example`** Switch active status

```ts
import { usePencilHandler } from '@svg-drawing/react'

const draw = useDraw(opts) const ref = uesRef<HTMLElement>(null)
const [active, setActive] = useState(true)

usePencilHandler(ref, draw, active)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `RefObject`<`HTMLElement`\> |
| `drawing` | `DrawingClass` |
| `active?` | `boolean` |

#### Returns

`void`

#### Defined in

[react/src/hooks/useDrawEventHandler.ts:61](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useDrawEventHandler.ts#L61)

___

### usePressedKey

▸ **usePressedKey**(`key`): `MutableRefObject`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`MutableRefObject`<`boolean`\>

#### Defined in

[react/src/hooks/usePressedKey.ts:4](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/usePressedKey.ts#L4)

___

### useRenderInterval

▸ **useRenderInterval**(`ms?`): (`update`: `UpdateCallback`) => `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `ms` | `undefined` \| `number` | `RENDER_INTERVAL` |

#### Returns

`fn`

▸ (`update`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `update` | `UpdateCallback` |

##### Returns

`void`

#### Defined in

[react/src/hooks/useRenderInterval.ts:7](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useRenderInterval.ts#L7)

___

### useResize

▸ **useResize**(`ref`, `onResize`, `active?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `RefObject`<`HTMLElement`\> |
| `onResize` | `ResizeCallback` |
| `active?` | `boolean` |

#### Returns

`void`

#### Defined in

[react/src/hooks/useResize.ts:5](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useResize.ts#L5)

___

### useSvg

▸ **useSvg**(`opts`): `SvgClass`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `Partial`<`SvgOption`\> |

#### Returns

`SvgClass`

#### Defined in

[react/src/hooks/useSvg.ts:5](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/react/src/hooks/useSvg.ts#L5)
