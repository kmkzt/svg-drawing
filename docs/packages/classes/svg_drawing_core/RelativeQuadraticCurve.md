# Class: RelativeQuadraticCurve

[@svg-drawing/core](../../modules/svg_drawing_core.md).RelativeQuadraticCurve

Quadratic curve relative

`q 10 60 10 30`

## Implements

- [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<``"q"``\>

## Constructors

### constructor

• **new RelativeQuadraticCurve**(`points`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `points` | [[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md), [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)] |

#### Defined in

[core/src/svg/command.ts:603](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L603)

## Properties

### points

• **points**: [[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md), [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[points](../../interfaces/svg_drawing_core/CommandClass.md#points)

___

### type

• `Readonly` **type**: ``"q"``

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[type](../../interfaces/svg_drawing_core/CommandClass.md#type)

#### Defined in

[core/src/svg/command.ts:602](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L602)

## Accessors

### point

• `get` **point**(): [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Returns

[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[point](../../interfaces/svg_drawing_core/CommandClass.md#point)

#### Defined in

[core/src/svg/command.ts:612](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L612)

___

### values

• `get` **values**(): [`number`, `number`, `number`, `number`]

#### Returns

[`number`, `number`, `number`, `number`]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[values](../../interfaces/svg_drawing_core/CommandClass.md#values)

#### Defined in

[core/src/svg/command.ts:605](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L605)

## Methods

### clone

▸ **clone**(): [`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Returns

[`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[clone](../../interfaces/svg_drawing_core/CommandClass.md#clone)

#### Defined in

[core/src/svg/command.ts:644](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L644)

___

### scale

▸ **scale**(`r`): [`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scale](../../interfaces/svg_drawing_core/CommandClass.md#scale)

#### Defined in

[core/src/svg/command.ts:626](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L626)

___

### scaleX

▸ **scaleX**(`r`): [`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleX](../../interfaces/svg_drawing_core/CommandClass.md#scalex)

#### Defined in

[core/src/svg/command.ts:632](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L632)

___

### scaleY

▸ **scaleY**(`r`): [`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleY](../../interfaces/svg_drawing_core/CommandClass.md#scaley)

#### Defined in

[core/src/svg/command.ts:638](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L638)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[toString](../../interfaces/svg_drawing_core/CommandClass.md#tostring)

#### Defined in

[core/src/svg/command.ts:616](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L616)

___

### translate

▸ **translate**(`p`): [`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`RelativeQuadraticCurve`](RelativeQuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[translate](../../interfaces/svg_drawing_core/CommandClass.md#translate)

#### Defined in

[core/src/svg/command.ts:620](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L620)
