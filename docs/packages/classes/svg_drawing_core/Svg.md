# Class: Svg

[@svg-drawing/core](../../modules/svg_drawing_core.md).Svg

## Constructors

### constructor

• **new Svg**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SvgOption`](../../modules/svg_drawing_core.md#svgoption) |

#### Defined in

[core/src/svg.ts:250](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L250)

## Properties

### background

• `Optional` **background**: `string`

#### Defined in

[core/src/svg.ts:248](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L248)

___

### height

• **height**: `number`

#### Defined in

[core/src/svg.ts:247](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L247)

___

### paths

• **paths**: [`Path`](Path.md)[]

#### Defined in

[core/src/svg.ts:245](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L245)

___

### width

• **width**: `number`

#### Defined in

[core/src/svg.ts:246](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L246)

## Methods

### addPath

▸ **addPath**(`pa`): [`Svg`](Svg.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pa` | [`Path`](Path.md) \| [`Path`](Path.md)[] |

#### Returns

[`Svg`](Svg.md)

#### Defined in

[core/src/svg.ts:273](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L273)

___

### clonePaths

▸ **clonePaths**(): [`Path`](Path.md)[]

#### Returns

[`Path`](Path.md)[]

#### Defined in

[core/src/svg.ts:282](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L282)

___

### copy

▸ **copy**(`svg`): [`Svg`](Svg.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `svg` | [`Svg`](Svg.md) |

#### Returns

[`Svg`](Svg.md)

#### Defined in

[core/src/svg.ts:302](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L302)

___

### parseSVGElement

▸ **parseSVGElement**(`svgEl`): [`Svg`](Svg.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `svgEl` | `SVGSVGElement` |

#### Returns

[`Svg`](Svg.md)

#### Defined in

[core/src/svg.ts:321](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L321)

___

### parseSVGString

▸ **parseSVGString**(`svgStr`): [`Svg`](Svg.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `svgStr` | `string` |

#### Returns

[`Svg`](Svg.md)

#### Defined in

[core/src/svg.ts:310](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L310)

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

[core/src/svg.ts:258](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L258)

___

### scalePath

▸ **scalePath**(`r`): [`Svg`](Svg.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Svg`](Svg.md)

#### Defined in

[core/src/svg.ts:264](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L264)

___

### toJson

▸ **toJson**(): [`SvgObject`](../../modules/svg_drawing_core.md#svgobject)

#### Returns

[`SvgObject`](../../modules/svg_drawing_core.md#svgobject)

#### Defined in

[core/src/svg.ts:293](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L293)

___

### updatePath

▸ **updatePath**(`pa`, `i?`): [`Svg`](Svg.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pa` | [`Path`](Path.md) |
| `i?` | `number` |

#### Returns

[`Svg`](Svg.md)

#### Defined in

[core/src/svg.ts:286](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L286)
