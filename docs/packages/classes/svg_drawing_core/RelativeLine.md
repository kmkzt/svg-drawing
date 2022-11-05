# Class: RelativeLine

[@svg-drawing/core](../../modules/svg_drawing_core.md).RelativeLine

Line relative

`l 0 0`

## Implements

- [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<``"l"``\>

## Constructors

### constructor

• **new RelativeLine**(`point`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `point` | [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md) |

#### Defined in

[core/src/svg/command.ts:221](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L221)

## Properties

### points

• **points**: [[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[points](../../interfaces/svg_drawing_core/CommandClass.md#points)

#### Defined in

[core/src/svg/command.ts:220](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L220)

___

### type

• `Readonly` **type**: ``"l"``

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[type](../../interfaces/svg_drawing_core/CommandClass.md#type)

#### Defined in

[core/src/svg/command.ts:219](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L219)

## Accessors

### point

• `get` **point**(): [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Returns

[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[point](../../interfaces/svg_drawing_core/CommandClass.md#point)

#### Defined in

[core/src/svg/command.ts:229](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L229)

___

### values

• `get` **values**(): `number`[]

#### Returns

`number`[]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[values](../../interfaces/svg_drawing_core/CommandClass.md#values)

#### Defined in

[core/src/svg/command.ts:225](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L225)

## Methods

### clone

▸ **clone**(): [`RelativeLine`](RelativeLine.md)

#### Returns

[`RelativeLine`](RelativeLine.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[clone](../../interfaces/svg_drawing_core/CommandClass.md#clone)

#### Defined in

[core/src/svg/command.ts:253](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L253)

___

### scale

▸ **scale**(`r`): [`RelativeLine`](RelativeLine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeLine`](RelativeLine.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scale](../../interfaces/svg_drawing_core/CommandClass.md#scale)

#### Defined in

[core/src/svg/command.ts:241](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L241)

___

### scaleX

▸ **scaleX**(`r`): [`RelativeLine`](RelativeLine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeLine`](RelativeLine.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleX](../../interfaces/svg_drawing_core/CommandClass.md#scalex)

#### Defined in

[core/src/svg/command.ts:245](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L245)

___

### scaleY

▸ **scaleY**(`r`): [`RelativeLine`](RelativeLine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeLine`](RelativeLine.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleY](../../interfaces/svg_drawing_core/CommandClass.md#scaley)

#### Defined in

[core/src/svg/command.ts:249](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L249)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[toString](../../interfaces/svg_drawing_core/CommandClass.md#tostring)

#### Defined in

[core/src/svg/command.ts:233](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L233)

___

### translate

▸ **translate**(`p`): [`RelativeLine`](RelativeLine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`RelativeLine`](RelativeLine.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[translate](../../interfaces/svg_drawing_core/CommandClass.md#translate)

#### Defined in

[core/src/svg/command.ts:237](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L237)
