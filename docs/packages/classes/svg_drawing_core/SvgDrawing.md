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

[core/src/drawing.ts:62](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L62)

## Properties

### close

• **close**: `boolean`

#### Defined in

[core/src/drawing.ts:48](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L48)

___

### convert

• **convert**: [`Convert`](Convert.md)

#### Defined in

[core/src/drawing.ts:53](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L53)

___

### curve

• **curve**: `boolean`

#### Defined in

[core/src/drawing.ts:47](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L47)

___

### delay

• **delay**: `number`

#### Defined in

[core/src/drawing.ts:49](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L49)

___

### drawHandler

• **drawHandler**: [`DrawHandler`](DrawHandler.md)

#### Defined in

[core/src/drawing.ts:55](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L55)

___

### el

• **el**: `HTMLElement`

___

### fill

• **fill**: `string`

#### Defined in

[core/src/drawing.ts:46](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L46)

___

### penColor

• **penColor**: `string`

#### Defined in

[core/src/drawing.ts:44](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L44)

___

### penWidth

• **penWidth**: `number`

#### Defined in

[core/src/drawing.ts:45](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L45)

___

### renderer

• **renderer**: [`Renderer`](Renderer.md)

#### Defined in

[core/src/drawing.ts:54](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L54)

___

### resizeHandler

• **resizeHandler**: [`ResizeHandler`](ResizeHandler.md)

#### Defined in

[core/src/drawing.ts:56](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L56)

___

### svg

• **svg**: [`Svg`](Svg.md)

#### Defined in

[core/src/drawing.ts:52](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L52)

## Methods

### changeDelay

▸ **changeDelay**(`delay`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `delay` | `number` |

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:132](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L132)

___

### clear

▸ **clear**(): [`Path`](Path.md)[]

#### Returns

[`Path`](Path.md)[]

#### Defined in

[core/src/drawing.ts:119](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L119)

___

### download

▸ **download**(`opt?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | [`DownloadOption`](../../modules/svg_drawing_core.md#downloadoption) |

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:217](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L217)

___

### drawEnd

▸ **drawEnd**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:169](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L169)

___

### drawMove

▸ **drawMove**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | [`PointObject`](../../modules/svg_drawing_core.md#pointobject) |

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:154](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L154)

___

### drawStart

▸ **drawStart**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:148](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L148)

___

### off

▸ **off**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:143](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L143)

___

### on

▸ **on**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:138](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L138)

___

### undo

▸ **undo**(): `undefined` \| [`Path`](Path.md)

#### Returns

`undefined` \| [`Path`](Path.md)

#### Defined in

[core/src/drawing.ts:126](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L126)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:115](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/drawing.ts#L115)
