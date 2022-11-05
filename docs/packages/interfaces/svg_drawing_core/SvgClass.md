# Interface: SvgClass

[@svg-drawing/core](../../modules/svg_drawing_core.md).SvgClass

## Implemented by

- [`Svg`](../../classes/svg_drawing_core/Svg.md)

## Properties

### background

• `Optional` **background**: `string`

#### Defined in

[core/src/types.ts:120](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L120)

___

### height

• **height**: `number`

#### Defined in

[core/src/types.ts:119](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L119)

___

### paths

• **paths**: [`PathClass`](PathClass.md)[]

Svg child element

#### Defined in

[core/src/types.ts:117](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L117)

___

### width

• **width**: `number`

#### Defined in

[core/src/types.ts:118](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L118)

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

[core/src/types.ts:124](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L124)

___

### clone

▸ **clone**(): [`SvgClass`](SvgClass.md)

Return cloned class object.

#### Returns

[`SvgClass`](SvgClass.md)

#### Defined in

[core/src/types.ts:146](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L146)

___

### clonePaths

▸ **clonePaths**(): [`PathClass`](PathClass.md)[]

Return cloned paths.

#### Returns

[`PathClass`](PathClass.md)[]

#### Defined in

[core/src/types.ts:132](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L132)

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

[core/src/types.ts:144](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L144)

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

[core/src/types.ts:130](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L130)

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

[core/src/types.ts:126](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L126)

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

[core/src/types.ts:122](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L122)

___

### toJson

▸ **toJson**(): [`SvgObject`](../../modules/svg_drawing_core.md#svgobject)

#### Returns

[`SvgObject`](../../modules/svg_drawing_core.md#svgobject)

#### Defined in

[core/src/types.ts:133](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L133)

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

[core/src/types.ts:128](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L128)
