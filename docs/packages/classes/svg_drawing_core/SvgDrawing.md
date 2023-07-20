# Class: SvgDrawing

[@svg-drawing/core](../../modules/svg_drawing_core.md).SvgDrawing

### Setup SvgDrawing

```ts
import { SvgDrawing } from '@svg-drawing/core'

const el = document.getElementById('draw-area')
new SvgDrawing(el)
```

### Set draw options.

```ts
// It is default value
const options = {
  penColor: '#000',
  penWidth: 1,
  curve: true,
  close: false,
  delay: 0,
  fill: 'none',
  background: undefined,
}

new SvgDrawing(el, options)
```

## Constructors

### constructor

• **new SvgDrawing**(`el`, `__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `HTMLElement` |
| `__namedParameters` | [`DrawingOption`](../../modules/svg_drawing_core.md#drawingoption) |

#### Defined in

[core/src/SvgDrawing.ts:51](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L51)

## Methods

### changeClose

▸ **changeClose**(`close`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `close` | `boolean` |

#### Returns

`void`

#### Defined in

[core/src/SvgDrawing.ts:108](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L108)

___

### changeCurve

▸ **changeCurve**(`curve`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `curve` | `boolean` |

#### Returns

`void`

#### Defined in

[core/src/SvgDrawing.ts:104](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L104)

___

### clear

▸ **clear**(): [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

#### Returns

[`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

#### Defined in

[core/src/SvgDrawing.ts:112](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L112)

___

### drawEnd

▸ **drawEnd**(): `void`

#### Returns

`void`

#### Defined in

[core/src/SvgDrawing.ts:96](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L96)

___

### drawMove

▸ **drawMove**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | [`EventPoint`](../../modules/svg_drawing_core.md#eventpoint) |

#### Returns

`void`

#### Defined in

[core/src/SvgDrawing.ts:92](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L92)

___

### drawStart

▸ **drawStart**(): `void`

#### Returns

`void`

#### Defined in

[core/src/SvgDrawing.ts:88](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L88)

___

### resize

▸ **resize**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.height` | `number` |
| `__namedParameters.width` | `number` |

#### Returns

`void`

#### Defined in

[core/src/SvgDrawing.ts:129](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L129)

___

### toJson

▸ **toJson**(): [`SvgObject`](../../modules/svg_drawing_core.md#svgobject)

#### Returns

[`SvgObject`](../../modules/svg_drawing_core.md#svgobject)

#### Defined in

[core/src/SvgDrawing.ts:100](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L100)

___

### undo

▸ **undo**(): `undefined` \| [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)

#### Returns

`undefined` \| [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)

#### Defined in

[core/src/SvgDrawing.ts:119](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgDrawing.ts#L119)
