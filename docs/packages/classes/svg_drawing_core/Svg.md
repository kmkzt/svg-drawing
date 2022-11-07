# Class: Svg

[@svg-drawing/core](../../modules/svg_drawing_core.md).Svg

## Implements

- [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md)

## Constructors

### constructor

• **new Svg**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SvgOption`](../../modules/svg_drawing_core.md#svgoption) |

#### Defined in

[core/src/svg/svg.ts:9](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L9)

## Properties

### background

• `Optional` **background**: `string`

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[background](../../interfaces/svg_drawing_core/SvgClass.md#background)

#### Defined in

[core/src/svg/svg.ts:7](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L7)

___

### height

• **height**: `number`

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[height](../../interfaces/svg_drawing_core/SvgClass.md#height)

#### Defined in

[core/src/svg/svg.ts:6](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L6)

___

### paths

• **paths**: [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

Svg child element

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[paths](../../interfaces/svg_drawing_core/SvgClass.md#paths)

#### Defined in

[core/src/svg/svg.ts:4](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L4)

___

### width

• **width**: `number`

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[width](../../interfaces/svg_drawing_core/SvgClass.md#width)

#### Defined in

[core/src/svg/svg.ts:5](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L5)

## Methods

### addPath

▸ **addPath**(`pa`): [`Svg`](Svg.md)

Add multiple paths.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pa` | [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md) \| [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[] |

#### Returns

[`Svg`](Svg.md)

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[addPath](../../interfaces/svg_drawing_core/SvgClass.md#addpath)

#### Defined in

[core/src/svg/svg.ts:31](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L31)

___

### clone

▸ **clone**(): [`Svg`](Svg.md)

Return cloned class object.

#### Returns

[`Svg`](Svg.md)

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[clone](../../interfaces/svg_drawing_core/SvgClass.md#clone)

#### Defined in

[core/src/svg/svg.ts:88](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L88)

___

### clonePaths

▸ **clonePaths**(): [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

Return cloned paths.

#### Returns

[`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[clonePaths](../../interfaces/svg_drawing_core/SvgClass.md#clonepaths)

#### Defined in

[core/src/svg/svg.ts:57](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L57)

___

### copy

▸ **copy**(`svg`): [`Svg`](Svg.md)

Copy resized paths.

**`example`**

```ts
const drawSvg = new Svg()
const animateSvg = new Svg().copy(drawSvg)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `svg` | [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md) |

#### Returns

[`Svg`](Svg.md)

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[copy](../../interfaces/svg_drawing_core/SvgClass.md#copy)

#### Defined in

[core/src/svg/svg.ts:80](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L80)

___

### deletePath

▸ **deletePath**(`deletePath`): [`Svg`](Svg.md)

Delete paths

#### Parameters

| Name | Type |
| :------ | :------ |
| `deletePath` | [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md) |

#### Returns

[`Svg`](Svg.md)

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[deletePath](../../interfaces/svg_drawing_core/SvgClass.md#deletepath)

#### Defined in

[core/src/svg/svg.ts:52](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L52)

___

### getPath

▸ **getPath**(`key`): `undefined` \| [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)

Get path

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`undefined` \| [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[getPath](../../interfaces/svg_drawing_core/SvgClass.md#getpath)

#### Defined in

[core/src/svg/svg.ts:40](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L40)

___

### resize

▸ **resize**(`__namedParameters`): `void`

Resize svg and path of children.

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.height` | `number` |
| `__namedParameters.width` | `number` |

#### Returns

`void`

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[resize](../../interfaces/svg_drawing_core/SvgClass.md#resize)

#### Defined in

[core/src/svg/svg.ts:16](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L16)

___

### toJson

▸ **toJson**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `background` | `undefined` \| `string` |
| `height` | `number` |
| `paths` | [`PathObject`](../../modules/svg_drawing_core.md#pathobject)[] |
| `width` | `number` |

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[toJson](../../interfaces/svg_drawing_core/SvgClass.md#tojson)

#### Defined in

[core/src/svg/svg.ts:61](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L61)

___

### updatePath

▸ **updatePath**(`path`): [`Svg`](Svg.md)

Update path

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md) |

#### Returns

[`Svg`](Svg.md)

#### Implementation of

[SvgClass](../../interfaces/svg_drawing_core/SvgClass.md).[updatePath](../../interfaces/svg_drawing_core/SvgClass.md#updatepath)

#### Defined in

[core/src/svg/svg.ts:44](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/svg.ts#L44)
