# Class: OtherCommand<T\>

[@svg-drawing/core](../../modules/svg_drawing_core.md).OtherCommand

**`deprecated`**

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`OtherCommandType`](../../modules/svg_drawing_core.md#othercommandtype) |

## Implements

- [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`OtherCommandType`](../../modules/svg_drawing_core.md#othercommandtype)\>

## Constructors

### constructor

• **new OtherCommand**<`T`\>(`type`, `values?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`OtherCommandType`](../../modules/svg_drawing_core.md#othercommandtype) |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | `T` | `undefined` |
| `values` | `number`[] | `[]` |

#### Defined in

[core/src/svg/command.ts:56](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L56)

## Properties

### type

• **type**: `T`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[type](../../interfaces/svg_drawing_core/CommandClass.md#type)

___

### values

• **values**: `number`[] = `[]`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[values](../../interfaces/svg_drawing_core/CommandClass.md#values)

___

### Types

▪ `Static` **Types**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `A` | ``"A"`` | Arc curve  `A 6 4 10 0 1 14 10` |
| `H` | ``"H"`` | Horizontal  `H 10` |
| `V` | ``"V"`` | Vertical  V 10 |
| `a` | ``"a"`` | Arc curve relative  `a 6 4 10 0 1 14 10` |
| `h` | ``"h"`` | Horizontal relative  `h 10` |
| `v` | ``"v"`` | Vertical relative  `v 10` |

#### Defined in

[core/src/svg/command.ts:17](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L17)

## Accessors

### point

• `get` **point**(): `undefined`

#### Returns

`undefined`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[point](../../interfaces/svg_drawing_core/CommandClass.md#point)

#### Defined in

[core/src/svg/command.ts:71](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L71)

___

### points

• `get` **points**(): [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)[]

#### Returns

[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)[]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[points](../../interfaces/svg_drawing_core/CommandClass.md#points)

#### Defined in

[core/src/svg/command.ts:63](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L63)

• `set` **points**(`p`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)[] |

#### Returns

`void`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[points](../../interfaces/svg_drawing_core/CommandClass.md#points)

#### Defined in

[core/src/svg/command.ts:58](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L58)

## Methods

### clone

▸ **clone**(): [`OtherCommand`](OtherCommand.md)<`T`\>

#### Returns

[`OtherCommand`](OtherCommand.md)<`T`\>

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[clone](../../interfaces/svg_drawing_core/CommandClass.md#clone)

#### Defined in

[core/src/svg/command.ts:107](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L107)

___

### scale

▸ **scale**(`r`): [`OtherCommand`](OtherCommand.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`OtherCommand`](OtherCommand.md)<`T`\>

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scale](../../interfaces/svg_drawing_core/CommandClass.md#scale)

#### Defined in

[core/src/svg/command.ts:79](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L79)

___

### scaleX

▸ **scaleX**(`r`): [`OtherCommand`](OtherCommand.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`OtherCommand`](OtherCommand.md)<`T`\>

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleX](../../interfaces/svg_drawing_core/CommandClass.md#scalex)

#### Defined in

[core/src/svg/command.ts:87](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L87)

___

### scaleY

▸ **scaleY**(`r`): [`OtherCommand`](OtherCommand.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`OtherCommand`](OtherCommand.md)<`T`\>

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleY](../../interfaces/svg_drawing_core/CommandClass.md#scaley)

#### Defined in

[core/src/svg/command.ts:97](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L97)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[toString](../../interfaces/svg_drawing_core/CommandClass.md#tostring)

#### Defined in

[core/src/svg/command.ts:75](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L75)

___

### translate

▸ **translate**(`p`): [`OtherCommand`](OtherCommand.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`OtherCommand`](OtherCommand.md)<`T`\>

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[translate](../../interfaces/svg_drawing_core/CommandClass.md#translate)

#### Defined in

[core/src/svg/command.ts:111](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L111)

___

### validTypes

▸ `Static` **validTypes**(`t`): t is OtherCommandType

#### Parameters

| Name | Type |
| :------ | :------ |
| `t` | `any` |

#### Returns

t is OtherCommandType

#### Defined in

[core/src/svg/command.ts:117](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L117)
