[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/core](../modules/svg_drawing_core.md) / SvgDrawing

# Class: SvgDrawing

[@svg-drawing/core](../modules/svg_drawing_core.md).SvgDrawing

## Constructors

### constructor

• **new SvgDrawing**(`el`, `__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `HTMLElement` |
| `__namedParameters` | [`DrawingOption`](../modules/svg_drawing_core.md#drawingoption) |

#### Defined in

[core/src/drawing.ts:33](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L33)

## Properties

### \_drawMoveThrottle

• `Private` **\_drawMoveThrottle**: (`po`: [`PointObject`](../modules/svg_drawing_core.md#pointobject)) => `void`

#### Type declaration

▸ (`po`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `po` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |

##### Returns

`void`

#### Defined in

[core/src/drawing.ts:32](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L32)

___

### \_drawPath

• `Private` **\_drawPath**: ``null`` \| [`Path`](svg_drawing_core.Path.md)

Private property

#### Defined in

[core/src/drawing.ts:30](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L30)

___

### \_drawPoints

• `Private` **\_drawPoints**: [`PointObject`](../modules/svg_drawing_core.md#pointobject)[]

#### Defined in

[core/src/drawing.ts:31](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L31)

___

### close

• **close**: `boolean`

#### Defined in

[core/src/drawing.ts:21](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L21)

___

### convert

• **convert**: [`Convert`](svg_drawing_core.Convert.md)

#### Defined in

[core/src/drawing.ts:25](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L25)

___

### curve

• **curve**: `boolean`

#### Defined in

[core/src/drawing.ts:20](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L20)

___

### delay

• **delay**: `number`

#### Defined in

[core/src/drawing.ts:22](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L22)

___

### drawHandler

• **drawHandler**: [`DrawHandler`](svg_drawing_core.DrawHandler.md)

#### Defined in

[core/src/drawing.ts:27](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L27)

___

### el

• **el**: `HTMLElement`

___

### fill

• **fill**: `string`

#### Defined in

[core/src/drawing.ts:19](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L19)

___

### penColor

• **penColor**: `string`

Draw Option

#### Defined in

[core/src/drawing.ts:17](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L17)

___

### penWidth

• **penWidth**: `number`

#### Defined in

[core/src/drawing.ts:18](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L18)

___

### renderer

• **renderer**: [`Renderer`](svg_drawing_core.Renderer.md)

#### Defined in

[core/src/drawing.ts:26](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L26)

___

### resizeHandler

• **resizeHandler**: [`ResizeHandler`](svg_drawing_core.ResizeHandler.md)

#### Defined in

[core/src/drawing.ts:28](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L28)

___

### svg

• **svg**: [`Svg`](svg_drawing_core.Svg.md)

Module

#### Defined in

[core/src/drawing.ts:24](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L24)

## Methods

### \_addDrawPoint

▸ `Private` **_addDrawPoint**(`p4`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `p4` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:155](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L155)

___

### \_createCommand

▸ `Private` **_createCommand**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:139](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L139)

___

### \_createDrawPath

▸ `Private` **_createDrawPath**(): [`Path`](svg_drawing_core.Path.md)

#### Returns

[`Path`](svg_drawing_core.Path.md)

#### Defined in

[core/src/drawing.ts:160](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L160)

___

### \_resize

▸ `Private` **_resize**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `DOMRect` \| { `height`: `number` ; `left`: `number` ; `top`: `number` ; `width`: `number`  } |

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:172](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L172)

___

### changeDelay

▸ **changeDelay**(`delay`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `delay` | `number` |

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:97](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L97)

___

### clear

▸ **clear**(): [`Path`](svg_drawing_core.Path.md)[]

#### Returns

[`Path`](svg_drawing_core.Path.md)[]

#### Defined in

[core/src/drawing.ts:84](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L84)

___

### download

▸ **download**(`opt?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `opt?` | [`DownloadOption`](../modules/svg_drawing_core.md#downloadoption) |

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:182](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L182)

___

### drawEnd

▸ **drawEnd**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:134](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L134)

___

### drawMove

▸ **drawMove**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:119](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L119)

___

### drawStart

▸ **drawStart**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:113](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L113)

___

### off

▸ **off**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:108](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L108)

___

### on

▸ **on**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:103](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L103)

___

### undo

▸ **undo**(): `undefined` \| [`Path`](svg_drawing_core.Path.md)

#### Returns

`undefined` \| [`Path`](svg_drawing_core.Path.md)

#### Defined in

[core/src/drawing.ts:91](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L91)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[core/src/drawing.ts:81](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/core/src/drawing.ts#L81)
