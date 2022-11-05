# Class: Close

[@svg-drawing/core](../../modules/svg_drawing_core.md).Close

Close

'z'

## Implements

- [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<``"z"``\>

## Constructors

### constructor

• **new Close**()

## Properties

### type

• `Readonly` **type**: ``"z"``

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[type](../../interfaces/svg_drawing_core/CommandClass.md#type)

#### Defined in

[core/src/svg/command.ts:657](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L657)

## Accessors

### point

• `get` **point**(): `undefined`

#### Returns

`undefined`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[point](../../interfaces/svg_drawing_core/CommandClass.md#point)

#### Defined in

[core/src/svg/command.ts:667](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L667)

___

### points

• `get` **points**(): []

#### Returns

[]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[points](../../interfaces/svg_drawing_core/CommandClass.md#points)

#### Defined in

[core/src/svg/command.ts:663](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L663)

___

### values

• `get` **values**(): []

#### Returns

[]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[values](../../interfaces/svg_drawing_core/CommandClass.md#values)

#### Defined in

[core/src/svg/command.ts:659](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L659)

## Methods

### clone

▸ **clone**(): [`Close`](Close.md)

#### Returns

[`Close`](Close.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[clone](../../interfaces/svg_drawing_core/CommandClass.md#clone)

#### Defined in

[core/src/svg/command.ts:691](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L691)

___

### scale

▸ **scale**(`_r`): [`Close`](Close.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_r` | `number` |

#### Returns

[`Close`](Close.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scale](../../interfaces/svg_drawing_core/CommandClass.md#scale)

#### Defined in

[core/src/svg/command.ts:679](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L679)

___

### scaleX

▸ **scaleX**(`r`): [`Close`](Close.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Close`](Close.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleX](../../interfaces/svg_drawing_core/CommandClass.md#scalex)

#### Defined in

[core/src/svg/command.ts:683](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L683)

___

### scaleY

▸ **scaleY**(`r`): [`Close`](Close.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Close`](Close.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleY](../../interfaces/svg_drawing_core/CommandClass.md#scaley)

#### Defined in

[core/src/svg/command.ts:687](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L687)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[toString](../../interfaces/svg_drawing_core/CommandClass.md#tostring)

#### Defined in

[core/src/svg/command.ts:671](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L671)

___

### translate

▸ **translate**(`_p`): [`Close`](Close.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`Close`](Close.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[translate](../../interfaces/svg_drawing_core/CommandClass.md#translate)

#### Defined in

[core/src/svg/command.ts:675](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L675)
