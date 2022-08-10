# Module: @svg-drawing/core

## Classes

- [Command](../classes/svg_drawing_core/Command.md)
- [Convert](../classes/svg_drawing_core/Convert.md)
- [DrawHandler](../classes/svg_drawing_core/DrawHandler.md)
- [Path](../classes/svg_drawing_core/Path.md)
- [Point](../classes/svg_drawing_core/Point.md)
- [Renderer](../classes/svg_drawing_core/Renderer.md)
- [ResizeHandler](../classes/svg_drawing_core/ResizeHandler.md)
- [Svg](../classes/svg_drawing_core/Svg.md)
- [SvgDrawing](../classes/svg_drawing_core/SvgDrawing.md)
- [Vector](../classes/svg_drawing_core/Vector.md)

## Interfaces

- [ConvertOption](../interfaces/svg_drawing_core/ConvertOption.md)

## Type Aliases

### CommandObject

Ƭ **CommandObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | [`CommandType`](svg_drawing_core.md#commandtype) |
| `value` | `number`[] |

#### Defined in

[core/src/types.ts:37](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L37)

___

### CommandType

Ƭ **CommandType**: ``"M"`` \| ``"m"`` \| ``"L"`` \| ``"l"`` \| ``"C"`` \| ``"c"`` \| ``"Z"`` \| ``"H"`` \| ``"h"`` \| ``"V"`` \| ``"v"`` \| ``"A"`` \| ``"a"`` \| ``"Q"`` \| ``"q"``

Command Object

#### Defined in

[core/src/types.ts:21](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L21)

___

### DownloadOption

Ƭ **DownloadOption**: `Object`

Download options

#### Type declaration

| Name | Type |
| :------ | :------ |
| `extension` | ``"svg"`` \| ``"png"`` \| ``"jpg"`` |
| `filename?` | `string` |

#### Defined in

[core/src/types.ts:64](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L64)

___

### DrawEventName

Ƭ **DrawEventName**: `Extract`<keyof `GlobalEventHandlersEventMap`, ``"pointerdown"`` \| ``"pointermove"`` \| ``"pointerleave"`` \| ``"pointercancel"`` \| ``"pointerup"`` \| ``"touchstart"`` \| ``"touchmove"`` \| ``"touchend"`` \| ``"touchcancel"`` \| ``"mousedown"`` \| ``"mousemove"`` \| ``"mouseleave"`` \| ``"mouseout"`` \| ``"mouseup"``\>

#### Defined in

[core/src/types.ts:82](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L82)

___

### DrawHandlerCallback

Ƭ **DrawHandlerCallback**: `Object`

DrawHandler callback

#### Type declaration

| Name | Type |
| :------ | :------ |
| `end` | () => `void` |
| `move` | (`po`: [`PointObject`](svg_drawing_core.md#pointobject)) => `void` |
| `start` | () => `void` |

#### Defined in

[core/src/types.ts:69](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L69)

___

### DrawListenerType

Ƭ **DrawListenerType**: ``"pointer"`` \| ``"touch"`` \| ``"mouse"``

#### Defined in

[core/src/types.ts:80](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L80)

___

### DrawingOption

Ƭ **DrawingOption**: [`RendererOption`](svg_drawing_core.md#rendereroption) & { `close?`: `boolean` ; `curve?`: `boolean` ; `delay?`: `number` ; `fill?`: `string` ; `penColor?`: `string` ; `penWidth?`: `number`  }

SvgDrawing options

#### Defined in

[core/src/types.ts:55](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L55)

___

### ListenerMaps

Ƭ **ListenerMaps**: `Record`<[`DrawListenerType`](svg_drawing_core.md#drawlistenertype), { `end`: [`DrawEventName`](svg_drawing_core.md#draweventname)[] ; `frameout`: [`DrawEventName`](svg_drawing_core.md#draweventname)[] ; `move`: [`DrawEventName`](svg_drawing_core.md#draweventname)[] ; `start`: [`DrawEventName`](svg_drawing_core.md#draweventname)[]  }\>

#### Defined in

[core/src/types.ts:99](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L99)

___

### PathObject

Ƭ **PathObject**: `Object`

Svg Path JSON

#### Index signature

▪ [camelCase: `string`]: `string` \| `undefined`

#### Defined in

[core/src/types.ts:2](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L2)

___

### PointObject

Ƭ **PointObject**: `Object`

Path Object

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pressure?` | `number` |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[core/src/types.ts:14](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L14)

___

### RendererOption

Ƭ **RendererOption**: `Pick`<[`SvgOption`](svg_drawing_core.md#svgoption), ``"background"``\>

Renderer options

#### Defined in

[core/src/types.ts:52](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L52)

___

### ResizeHandlerCallback

Ƭ **ResizeHandlerCallback**: `Object`

ResizeHandler callback

#### Type declaration

| Name | Type |
| :------ | :------ |
| `resize` | (`rect`: `DOMRect` \| { `height`: `number` ; `left`: `number` ; `top`: `number` ; `width`: `number`  }) => `void` |

#### Defined in

[core/src/types.ts:75](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L75)

___

### SvgObject

Ƭ **SvgObject**: `Object`

Svg JSON

#### Type declaration

| Name | Type |
| :------ | :------ |
| `background?` | `string` |
| `height` | `number` |
| `paths` | [`PathObject`](svg_drawing_core.md#pathobject)[] |
| `width` | `number` |

#### Defined in

[core/src/types.ts:6](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L6)

___

### SvgOption

Ƭ **SvgOption**: `Object`

Svg options

#### Type declaration

| Name | Type |
| :------ | :------ |
| `background?` | `string` |
| `height` | `number` |
| `width` | `number` |

#### Defined in

[core/src/types.ts:42](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/types.ts#L42)

## Variables

### COMMAND\_TYPE

• `Const` **COMMAND\_TYPE**: `Object`

#### Index signature

▪ [name: `string`]: [`CommandType`](svg_drawing_core.md#commandtype)

#### Defined in

[core/src/svg.ts:39](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L39)

___

### mimeTypeMap

• `Const` **mimeTypeMap**: { [key in DownloadOption["extension"]]: string }

#### Defined in

[core/src/download.ts:12](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/download.ts#L12)

## Functions

### camel2kebab

▸ **camel2kebab**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[core/src/utils.ts:1](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/utils.ts#L1)

___

### createSvgChildElement

▸ **createSvgChildElement**(`elname`, `attrs`): `SVGElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elname` | `string` |
| `attrs` | `Attrs` |

#### Returns

`SVGElement`

#### Defined in

[core/src/renderer.ts:29](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/renderer.ts#L29)

___

### createSvgElement

▸ **createSvgElement**(`attrs`, `childs`): `SVGSVGElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | `Attrs` |
| `childs` | `SVGElement`[] |

#### Returns

`SVGSVGElement`

#### Defined in

[core/src/renderer.ts:10](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/renderer.ts#L10)

___

### download

▸ **download**(`svg`, `opt?`, `dlb?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `svg` | [`Svg`](../classes/svg_drawing_core/Svg.md) | `undefined` |
| `opt` | [`DownloadOption`](svg_drawing_core.md#downloadoption) | `defaultOpts` |
| `dlb` | (`__namedParameters`: { `data`: `string` ; `extension`: ``"svg"`` \| ``"png"`` \| ``"jpg"`` ; `filename?`: `string`  }) => `void` | `downloadBlob` |

#### Returns

`void`

#### Defined in

[core/src/download.ts:57](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/download.ts#L57)

___

### downloadBlob

▸ **downloadBlob**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.data` | `string` |
| `__namedParameters.extension` | ``"svg"`` \| ``"png"`` \| ``"jpg"`` |
| `__namedParameters.filename?` | `string` |

#### Returns

`void`

#### Defined in

[core/src/download.ts:18](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/download.ts#L18)

___

### getPassiveOptions

▸ **getPassiveOptions**(`passive?`): `boolean` \| { `passive`: `boolean`  }

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `passive` | `boolean` | `true` |

#### Returns

`boolean` \| { `passive`: `boolean`  }

#### Defined in

[core/src/handler.ts:8](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/handler.ts#L8)

___

### isAlmostSameNumber

▸ **isAlmostSameNumber**(`a`, `b`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |
| `b` | `number` |

#### Returns

`boolean`

#### Defined in

[core/src/utils.ts:9](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/utils.ts#L9)

___

### isNaN

▸ **isNaN**(`num`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | `number` |

#### Returns

`boolean`

#### Defined in

[core/src/utils.ts:12](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/utils.ts#L12)

___

### kebab2camel

▸ **kebab2camel**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[core/src/utils.ts:6](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/utils.ts#L6)

___

### pathObjectToElement

▸ **pathObjectToElement**(`path`): `SVGElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`PathObject`](svg_drawing_core.md#pathobject) |

#### Returns

`SVGElement`

#### Defined in

[core/src/renderer.ts:42](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/renderer.ts#L42)

___

### roundUp

▸ **roundUp**(`num`, `digits?`): `number`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `num` | `number` | `undefined` |
| `digits` | `number` | `2` |

#### Returns

`number`

#### Defined in

[core/src/utils.ts:4](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/utils.ts#L4)

___

### svg2base64

▸ **svg2base64**(`svg`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `svg` | `string` |

#### Returns

`string`

#### Defined in

[core/src/download.ts:9](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/download.ts#L9)

___

### svgObjectToElement

▸ **svgObjectToElement**(`__namedParameters`): `SVGSVGElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SvgObject`](svg_drawing_core.md#svgobject) |

#### Returns

`SVGSVGElement`

#### Defined in

[core/src/renderer.ts:56](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/renderer.ts#L56)

___

### throttle

▸ **throttle**<`T`\>(`func`, `wait`, `options?`): (...`args`: `Parameters`<`T`\>) => `ReturnType`<`T`\> \| ``null``

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends (...`args`: `any`) => `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | `T` |
| `wait` | `number` |
| `options` | `Options` |

#### Returns

`fn`

▸ (...`args`): `ReturnType`<`T`\> \| ``null``

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `Parameters`<`T`\> |

##### Returns

`ReturnType`<`T`\> \| ``null``

#### Defined in

[core/src/throttle.ts:6](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/throttle.ts#L6)

___

### toBase64

▸ **toBase64**(`svgObj`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `svgObj` | [`SvgObject`](svg_drawing_core.md#svgobject) |

#### Returns

`string`

#### Defined in

[core/src/download.ts:5](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/download.ts#L5)
