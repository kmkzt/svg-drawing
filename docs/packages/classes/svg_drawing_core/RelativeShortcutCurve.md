# Class: RelativeShortcutCurve

[@svg-drawing/core](../../modules/svg_drawing_core.md).RelativeShortcutCurve

Shortcut curve relative

`s 10 60 10 30`

## Implements

- [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<``"s"``\>

## Constructors

### constructor

• **new RelativeShortcutCurve**(`points`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `points` | [[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md), [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)] |

#### Defined in

[core/src/svg/command.ts:492](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L492)

## Properties

### points

• **points**: [[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md), [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[points](../../interfaces/svg_drawing_core/CommandClass.md#points)

___

### type

• `Readonly` **type**: ``"s"``

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[type](../../interfaces/svg_drawing_core/CommandClass.md#type)

#### Defined in

[core/src/svg/command.ts:491](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L491)

## Accessors

### point

• `get` **point**(): [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Returns

[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[point](../../interfaces/svg_drawing_core/CommandClass.md#point)

#### Defined in

[core/src/svg/command.ts:501](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L501)

___

### values

• `get` **values**(): [`number`, `number`, `number`, `number`]

#### Returns

[`number`, `number`, `number`, `number`]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[values](../../interfaces/svg_drawing_core/CommandClass.md#values)

#### Defined in

[core/src/svg/command.ts:494](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L494)

## Methods

### clone

▸ **clone**(): [`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Returns

[`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[clone](../../interfaces/svg_drawing_core/CommandClass.md#clone)

#### Defined in

[core/src/svg/command.ts:533](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L533)

___

### scale

▸ **scale**(`r`): [`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scale](../../interfaces/svg_drawing_core/CommandClass.md#scale)

#### Defined in

[core/src/svg/command.ts:515](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L515)

___

### scaleX

▸ **scaleX**(`r`): [`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleX](../../interfaces/svg_drawing_core/CommandClass.md#scalex)

#### Defined in

[core/src/svg/command.ts:521](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L521)

___

### scaleY

▸ **scaleY**(`r`): [`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleY](../../interfaces/svg_drawing_core/CommandClass.md#scaley)

#### Defined in

[core/src/svg/command.ts:527](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L527)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[toString](../../interfaces/svg_drawing_core/CommandClass.md#tostring)

#### Defined in

[core/src/svg/command.ts:505](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L505)

___

### translate

▸ **translate**(`p`): [`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`RelativeShortcutCurve`](RelativeShortcutCurve.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[translate](../../interfaces/svg_drawing_core/CommandClass.md#translate)

#### Defined in

[core/src/svg/command.ts:509](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L509)
