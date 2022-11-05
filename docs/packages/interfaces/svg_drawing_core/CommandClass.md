# Interface: CommandClass<T\>

[@svg-drawing/core](../../modules/svg_drawing_core.md).CommandClass

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | [`CommandType`](../../modules/svg_drawing_core.md#commandtype) |

## Implemented by

- [`Close`](../../classes/svg_drawing_core/Close.md)
- [`Curve`](../../classes/svg_drawing_core/Curve.md)
- [`Line`](../../classes/svg_drawing_core/Line.md)
- [`Move`](../../classes/svg_drawing_core/Move.md)
- [`OtherCommand`](../../classes/svg_drawing_core/OtherCommand.md)
- [`QuadraticCurve`](../../classes/svg_drawing_core/QuadraticCurve.md)
- [`RelativeCurve`](../../classes/svg_drawing_core/RelativeCurve.md)
- [`RelativeLine`](../../classes/svg_drawing_core/RelativeLine.md)
- [`RelativeMove`](../../classes/svg_drawing_core/RelativeMove.md)
- [`RelativeQuadraticCurve`](../../classes/svg_drawing_core/RelativeQuadraticCurve.md)
- [`RelativeShortcutCurve`](../../classes/svg_drawing_core/RelativeShortcutCurve.md)

## Properties

### point

• **point**: `T` extends [`OtherCommandType`](../../modules/svg_drawing_core.md#othercommandtype) ? `undefined` : [`PointClass`](PointClass.md)

#### Defined in

[core/src/types.ts:59](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L59)

___

### points

• **points**: `PointsLengthMap`<`T`\>

#### Defined in

[core/src/types.ts:58](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L58)

___

### type

• **type**: `T`

#### Defined in

[core/src/types.ts:56](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L56)

___

### values

• **values**: `number`[]

#### Defined in

[core/src/types.ts:57](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L57)

## Methods

### clone

▸ **clone**(): [`CommandClass`](CommandClass.md)<`T`\>

#### Returns

[`CommandClass`](CommandClass.md)<`T`\>

#### Defined in

[core/src/types.ts:61](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L61)

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

[core/src/types.ts:62](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L62)

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

[core/src/types.ts:63](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L63)

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

[core/src/types.ts:64](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L64)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[core/src/types.ts:60](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L60)

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

[core/src/types.ts:65](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L65)
