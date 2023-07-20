# Interface: VectorClass

[@svg-drawing/core](../../modules/svg_drawing_core.md).VectorClass

## Implemented by

- [`Vector`](../../classes/svg_drawing_core/Vector.md)

## Properties

### angle

• `Readonly` **angle**: `number`

#### Defined in

[core/src/types.ts:26](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L26)

___

### value

• `Readonly` **value**: `number`

#### Defined in

[core/src/types.ts:25](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L25)

## Methods

### rotate

▸ **rotate**(`a`): [`VectorClass`](VectorClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |

#### Returns

[`VectorClass`](VectorClass.md)

#### Defined in

[core/src/types.ts:28](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L28)

___

### scale

▸ **scale**(`r`): [`VectorClass`](VectorClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`VectorClass`](VectorClass.md)

#### Defined in

[core/src/types.ts:27](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L27)

___

### toJson

▸ **toJson**(): `Readonly`<{ `angle`: `number` ; `value`: `number`  }\>

#### Returns

`Readonly`<{ `angle`: `number` ; `value`: `number`  }\>

#### Defined in

[core/src/types.ts:29](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L29)
