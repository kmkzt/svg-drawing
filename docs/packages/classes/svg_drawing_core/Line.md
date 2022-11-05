# Class: Line

[@svg-drawing/core](../../modules/svg_drawing_core.md).Line

Line

`L 0 0`

## Implements

- [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<``"L"``\>

## Constructors

### constructor

• **new Line**(`point`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `point` | [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md) |

#### Defined in

[core/src/svg/command.ts:266](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L266)

## Properties

### points

• **points**: [[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[points](../../interfaces/svg_drawing_core/CommandClass.md#points)

#### Defined in

[core/src/svg/command.ts:265](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L265)

___

### type

• `Readonly` **type**: ``"L"``

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[type](../../interfaces/svg_drawing_core/CommandClass.md#type)

#### Defined in

[core/src/svg/command.ts:264](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L264)

## Accessors

### point

• `get` **point**(): [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Returns

[`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[point](../../interfaces/svg_drawing_core/CommandClass.md#point)

#### Defined in

[core/src/svg/command.ts:274](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L274)

___

### values

• `get` **values**(): `number`[]

#### Returns

`number`[]

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[values](../../interfaces/svg_drawing_core/CommandClass.md#values)

#### Defined in

[core/src/svg/command.ts:270](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L270)

## Methods

### clone

▸ **clone**(): [`Line`](Line.md)

#### Returns

[`Line`](Line.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[clone](../../interfaces/svg_drawing_core/CommandClass.md#clone)

#### Defined in

[core/src/svg/command.ts:298](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L298)

___

### scale

▸ **scale**(`r`): [`Line`](Line.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Line`](Line.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scale](../../interfaces/svg_drawing_core/CommandClass.md#scale)

#### Defined in

[core/src/svg/command.ts:286](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L286)

___

### scaleX

▸ **scaleX**(`r`): [`Line`](Line.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Line`](Line.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleX](../../interfaces/svg_drawing_core/CommandClass.md#scalex)

#### Defined in

[core/src/svg/command.ts:290](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L290)

___

### scaleY

▸ **scaleY**(`r`): [`Line`](Line.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Line`](Line.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[scaleY](../../interfaces/svg_drawing_core/CommandClass.md#scaley)

#### Defined in

[core/src/svg/command.ts:294](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L294)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[toString](../../interfaces/svg_drawing_core/CommandClass.md#tostring)

#### Defined in

[core/src/svg/command.ts:278](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L278)

___

### translate

▸ **translate**(`p`): [`Line`](Line.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`Line`](Line.md)

#### Implementation of

[CommandClass](../../interfaces/svg_drawing_core/CommandClass.md).[translate](../../interfaces/svg_drawing_core/CommandClass.md#translate)

#### Defined in

[core/src/svg/command.ts:282](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L282)
