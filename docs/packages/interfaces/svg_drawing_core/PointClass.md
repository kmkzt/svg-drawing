# Interface: PointClass

[@svg-drawing/core](../../modules/svg_drawing_core.md).PointClass

## Implemented by

- [`Point`](../../classes/svg_drawing_core/Point.md)

## Properties

### values

• `Readonly` **values**: [`number`, `number`]

#### Defined in

[core/src/types.ts:9](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L9)

___

### x

• `Readonly` **x**: `number`

#### Defined in

[core/src/types.ts:7](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L7)

___

### y

• `Readonly` **y**: `number`

#### Defined in

[core/src/types.ts:8](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L8)

## Methods

### add

▸ **add**(`p`): [`PointClass`](PointClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`PointClass`](PointClass.md)

#### Defined in

[core/src/types.ts:13](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L13)

___

### clone

▸ **clone**(): [`PointClass`](PointClass.md)

#### Returns

[`PointClass`](PointClass.md)

#### Defined in

[core/src/types.ts:15](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L15)

___

### scale

▸ **scale**(`r`): [`PointClass`](PointClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`PointClass`](PointClass.md)

#### Defined in

[core/src/types.ts:10](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L10)

___

### scaleX

▸ **scaleX**(`r`): [`PointClass`](PointClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`PointClass`](PointClass.md)

#### Defined in

[core/src/types.ts:11](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L11)

___

### scaleY

▸ **scaleY**(`r`): [`PointClass`](PointClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`PointClass`](PointClass.md)

#### Defined in

[core/src/types.ts:12](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L12)

___

### sub

▸ **sub**(`p`): [`PointClass`](PointClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`PointClass`](PointClass.md)

#### Defined in

[core/src/types.ts:14](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L14)

___

### toJson

▸ **toJson**(): `Readonly`<{ `x`: `number` ; `y`: `number`  }\>

#### Returns

`Readonly`<{ `x`: `number` ; `y`: `number`  }\>

#### Defined in

[core/src/types.ts:16](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L16)
