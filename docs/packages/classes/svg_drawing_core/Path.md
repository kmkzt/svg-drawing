# Class: Path

[@svg-drawing/core](../../modules/svg_drawing_core.md).Path

Cannot support commands that use `M` or` z` more than once.

Not support example: `M 0 0 L 1 1 Z M 1 1 L 2 2 Z`.

## Implements

- [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)

## Constructors

### constructor

• **new Path**(`attrs?`, `_key?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |
| `_key?` | `string` |

#### Defined in

[core/src/svg/path.ts:25](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L25)

## Properties

### attrs

• **attrs**: [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) = `{}`

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[attrs](../../interfaces/svg_drawing_core/PathClass.md#attrs)

___

### key

• **key**: `string`

Identification key. Use for update, delete. Return same key when PathClass cloned.

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[key](../../interfaces/svg_drawing_core/PathClass.md#key)

#### Defined in

[core/src/svg/path.ts:24](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L24)

## Accessors

### absoluteCommands

• `get` **absoluteCommands**(): [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Returns

[`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[absoluteCommands](../../interfaces/svg_drawing_core/PathClass.md#absolutecommands)

#### Defined in

[core/src/svg/path.ts:29](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L29)

___

### relativeCommands

• `get` **relativeCommands**(): [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Returns

[`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[relativeCommands](../../interfaces/svg_drawing_core/PathClass.md#relativecommands)

#### Defined in

[core/src/svg/path.ts:33](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L33)

## Methods

### addCommand

▸ **addCommand**(`param`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `param` | readonly [`CommandObject`](../../modules/svg_drawing_core.md#commandobject)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[] \| `Readonly`<[`CommandObject`](../../modules/svg_drawing_core.md#commandobject)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>\> |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[addCommand](../../interfaces/svg_drawing_core/PathClass.md#addcommand)

#### Defined in

[core/src/svg/path.ts:43](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L43)

___

### clone

▸ **clone**(): [`Path`](Path.md)

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[clone](../../interfaces/svg_drawing_core/PathClass.md#clone)

#### Defined in

[core/src/svg/path.ts:124](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L124)

___

### deleteCommand

▸ **deleteCommand**(`i`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[deleteCommand](../../interfaces/svg_drawing_core/PathClass.md#deletecommand)

#### Defined in

[core/src/svg/path.ts:63](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L63)

___

### getCommandString

▸ **getCommandString**(): `string`

#### Returns

`string`

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[getCommandString](../../interfaces/svg_drawing_core/PathClass.md#getcommandstring)

#### Defined in

[core/src/svg/path.ts:83](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L83)

___

### scale

▸ **scale**(`r`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[scale](../../interfaces/svg_drawing_core/PathClass.md#scale)

#### Defined in

[core/src/svg/path.ts:68](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L68)

___

### scaleX

▸ **scaleX**(`r`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[scaleX](../../interfaces/svg_drawing_core/PathClass.md#scalex)

#### Defined in

[core/src/svg/path.ts:73](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L73)

___

### scaleY

▸ **scaleY**(`r`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[scaleY](../../interfaces/svg_drawing_core/PathClass.md#scaley)

#### Defined in

[core/src/svg/path.ts:78](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L78)

___

### setAttributes

▸ **setAttributes**(`attrs`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[setAttributes](../../interfaces/svg_drawing_core/PathClass.md#setattributes)

#### Defined in

[core/src/svg/path.ts:103](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L103)

___

### setCommands

▸ **setCommands**(`commands`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `commands` | readonly [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[] \| `Readonly`<[`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>\> |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[setCommands](../../interfaces/svg_drawing_core/PathClass.md#setcommands)

#### Defined in

[core/src/svg/path.ts:37](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L37)

___

### toJson

▸ **toJson**(): [`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Returns

[`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[toJson](../../interfaces/svg_drawing_core/PathClass.md#tojson)

#### Defined in

[core/src/svg/path.ts:92](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L92)

___

### translate

▸ **translate**(`po`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[translate](../../interfaces/svg_drawing_core/PathClass.md#translate)

#### Defined in

[core/src/svg/path.ts:118](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L118)

___

### updateAttributes

▸ **updateAttributes**(`attrs`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[updateAttributes](../../interfaces/svg_drawing_core/PathClass.md#updateattributes)

#### Defined in

[core/src/svg/path.ts:109](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L109)

___

### updateCommand

▸ **updateCommand**(`i`, `update`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |
| `update` | (`absoluteCommand`: [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>) => [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\> |

#### Returns

[`Path`](Path.md)

#### Implementation of

[PathClass](../../interfaces/svg_drawing_core/PathClass.md).[updateCommand](../../interfaces/svg_drawing_core/PathClass.md#updatecommand)

#### Defined in

[core/src/svg/path.ts:52](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/path.ts#L52)
