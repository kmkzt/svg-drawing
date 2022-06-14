[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/core](../modules/svg_drawing_core.md) / Point

# Class: Point

[@svg-drawing/core](../modules/svg_drawing_core.md).Point

## Constructors

### constructor

• **new Point**(`x`, `y`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[core/src/svg.ts:7](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L7)

## Properties

### x

• **x**: `number`

#### Defined in

[core/src/svg.ts:5](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L5)

___

### y

• **y**: `number`

#### Defined in

[core/src/svg.ts:6](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L6)

## Methods

### add

▸ **add**(`p`): [`Point`](svg_drawing_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`Point`](svg_drawing_core.Point.md) |

#### Returns

[`Point`](svg_drawing_core.Point.md)

#### Defined in

[core/src/svg.ts:22](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L22)

___

### clone

▸ **clone**(): [`Point`](svg_drawing_core.Point.md)

#### Returns

[`Point`](svg_drawing_core.Point.md)

#### Defined in

[core/src/svg.ts:34](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L34)

___

### eql

▸ **eql**(`p`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`Point`](svg_drawing_core.Point.md) |

#### Returns

`boolean`

#### Defined in

[core/src/svg.ts:30](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L30)

___

### scale

▸ **scale**(`r`): [`Point`](svg_drawing_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Point`](svg_drawing_core.Point.md)

#### Defined in

[core/src/svg.ts:18](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L18)

___

### sub

▸ **sub**(`p`): [`Point`](svg_drawing_core.Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`Point`](svg_drawing_core.Point.md) |

#### Returns

[`Point`](svg_drawing_core.Point.md)

#### Defined in

[core/src/svg.ts:26](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L26)

___

### toVector

▸ **toVector**(): [`Vector`](svg_drawing_core.Vector.md)

#### Returns

[`Vector`](svg_drawing_core.Vector.md)

#### Defined in

[core/src/svg.ts:12](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/svg.ts#L12)
