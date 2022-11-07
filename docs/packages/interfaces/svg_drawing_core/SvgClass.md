# Interface: SvgClass

[@svg-drawing/core](../../modules/svg_drawing_core.md).SvgClass

## Implemented by

- [`Svg`](../../classes/svg_drawing_core/Svg.md)

## Properties

### background

• `Optional` **background**: `string`

#### Defined in

[core/src/types.ts:139](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L139)

___

### height

• **height**: `number`

#### Defined in

[core/src/types.ts:138](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L138)

___

### paths

• **paths**: [`PathClass`](PathClass.md)[]

Svg child element

#### Defined in

[core/src/types.ts:136](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L136)

___

### width

• **width**: `number`

#### Defined in

[core/src/types.ts:137](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L137)

## Methods

### addPath

▸ **addPath**(`path`): `this`

Add multiple paths.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`PathClass`](PathClass.md) \| [`PathClass`](PathClass.md)[] |

#### Returns

`this`

#### Defined in

[core/src/types.ts:143](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L143)

___

### clone

▸ **clone**(): [`SvgClass`](SvgClass.md)

Return cloned class object.

#### Returns

[`SvgClass`](SvgClass.md)

#### Defined in

[core/src/types.ts:165](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L165)

___

### clonePaths

▸ **clonePaths**(): [`PathClass`](PathClass.md)[]

Return cloned paths.

#### Returns

[`PathClass`](PathClass.md)[]

#### Defined in

[core/src/types.ts:151](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L151)

___

### copy

▸ **copy**(`svg`): `this`

Copy resized paths.

```ts
class Svg implements SvgClass {}

const drawSvg = new Svg()
const animateSvg = new Svg().copy(drawSvg)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `svg` | [`SvgClass`](SvgClass.md) |

#### Returns

`this`

#### Defined in

[core/src/types.ts:163](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L163)

___

### deletePath

▸ **deletePath**(`path`): `this`

Delete paths

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`PathClass`](PathClass.md) |

#### Returns

`this`

#### Defined in

[core/src/types.ts:149](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L149)

___

### getPath

▸ **getPath**(`key`): `undefined` \| [`PathClass`](PathClass.md)

Get path

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`undefined` \| [`PathClass`](PathClass.md)

#### Defined in

[core/src/types.ts:145](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L145)

___

### resize

▸ **resize**(`arg`): `void`

Resize svg and path of children.

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `Object` |
| `arg.height` | `number` |
| `arg.width` | `number` |

#### Returns

`void`

#### Defined in

[core/src/types.ts:141](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L141)

___

### toJson

▸ **toJson**(): [`SvgObject`](../../modules/svg_drawing_core.md#svgobject)

#### Returns

[`SvgObject`](../../modules/svg_drawing_core.md#svgobject)

#### Defined in

[core/src/types.ts:152](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L152)

___

### updatePath

▸ **updatePath**(`path`): `this`

Update path

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`PathClass`](PathClass.md) |

#### Returns

`this`

#### Defined in

[core/src/types.ts:147](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L147)
