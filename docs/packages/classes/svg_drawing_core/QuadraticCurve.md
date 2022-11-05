# Class: QuadraticCurve

[@svg-drawing/core](../../modules/svg_drawing_core.md).QuadraticCurve

Quadratic curve

Q 10 60 10 30

## Implements

- [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<``"Q"``\>

## Constructors

### constructor

• **new QuadraticCurve**(`points`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `points` | [[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md), [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)] |

#### Defined in

[core/src/svg/command.ts:548](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L548)

## Properties

### points

• **points**: [[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md), [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[points](../../interfaces/svg_drawing_core/CommandClass.md#points)

___

### type

• `Readonly` **type**: ``"Q"``

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[type](../../interfaces/svg_drawing_core/CommandClass.md#type)

#### Defined in

[core/src/svg/command.ts:547](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L547)

## Accessors

### point

• `get` **point**(): [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Returns

[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[point](../../interfaces/svg_drawing_core/CommandClass.md#point)

#### Defined in

[core/src/svg/command.ts:557](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L557)

___

### values

• `get` **values**(): [`number`, `number`, `number`, `number`]

#### Returns

[`number`, `number`, `number`, `number`]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[values](../../interfaces/svg_drawing_core/CommandClass.md#values)

#### Defined in

[core/src/svg/command.ts:550](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L550)

## Methods

### clone

▸ **clone**(): [`QuadraticCurve`](QuadraticCurve.md)

#### Returns

[`QuadraticCurve`](QuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[clone](../../interfaces/svg_drawing_core/CommandClass.md#clone)

#### Defined in

[core/src/svg/command.ts:589](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L589)

___

### scale

▸ **scale**(`r`): [`QuadraticCurve`](QuadraticCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`QuadraticCurve`](QuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scale](../../interfaces/svg_drawing_core/CommandClass.md#scale)

#### Defined in

[core/src/svg/command.ts:571](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L571)

___

### scaleX

▸ **scaleX**(`r`): [`QuadraticCurve`](QuadraticCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`QuadraticCurve`](QuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleX](../../interfaces/svg_drawing_core/CommandClass.md#scalex)

#### Defined in

[core/src/svg/command.ts:577](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L577)

___

### scaleY

▸ **scaleY**(`r`): [`QuadraticCurve`](QuadraticCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`QuadraticCurve`](QuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleY](../../interfaces/svg_drawing_core/CommandClass.md#scaley)

#### Defined in

[core/src/svg/command.ts:583](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L583)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[toString](../../interfaces/svg_drawing_core/CommandClass.md#tostring)

#### Defined in

[core/src/svg/command.ts:561](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L561)

___

### translate

▸ **translate**(`p`): [`QuadraticCurve`](QuadraticCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`QuadraticCurve`](QuadraticCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[translate](../../interfaces/svg_drawing_core/CommandClass.md#translate)

#### Defined in

[core/src/svg/command.ts:565](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L565)
