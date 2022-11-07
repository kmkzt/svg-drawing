# Interface: CommandClass<T\>

[@svg-drawing/core](../../modules/svg_drawing_core.md).CommandClass

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CommandType`](../../modules/svg_drawing_core.md#commandtype) = [`CommandType`](../../modules/svg_drawing_core.md#commandtype) |

## Properties

### point

• `Readonly` **point**: `T` extends [`OtherCommandType`](../../modules/svg_drawing_core.md#othercommandtype) ? `undefined` : [`PointClass`](PointClass.md)

#### Defined in

[core/src/types.ts:73](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L73)

___

### points

• **points**: `PointsLengthMap`<`T`\>

#### Defined in

[core/src/types.ts:74](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L74)

___

### type

• `Readonly` **type**: `T`

#### Defined in

[core/src/types.ts:71](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L71)

___

### values

• `Readonly` **values**: `number`[]

#### Defined in

[core/src/types.ts:72](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L72)

## Methods

### clone

▸ **clone**(): [`CommandClass`](CommandClass.md)<`T`\>

#### Returns

[`CommandClass`](CommandClass.md)<`T`\>

#### Defined in

[core/src/types.ts:76](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L76)

___

### scale

▸ **scale**(`r`): [`CommandClass`](CommandClass.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`CommandClass`](CommandClass.md)<`T`\>

#### Defined in

[core/src/types.ts:77](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L77)

___

### scaleX

▸ **scaleX**(`r`): [`CommandClass`](CommandClass.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`CommandClass`](CommandClass.md)<`T`\>

#### Defined in

[core/src/types.ts:78](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L78)

___

### scaleY

▸ **scaleY**(`r`): [`CommandClass`](CommandClass.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`CommandClass`](CommandClass.md)<`T`\>

#### Defined in

[core/src/types.ts:79](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L79)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[core/src/types.ts:75](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L75)

___

### translate

▸ **translate**(`po`): [`CommandClass`](CommandClass.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`CommandClass`](CommandClass.md)<`T`\>

#### Defined in

[core/src/types.ts:80](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L80)
