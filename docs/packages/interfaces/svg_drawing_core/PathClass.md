# Interface: PathClass

[@svg-drawing/core](../../modules/svg_drawing_core.md).PathClass

## Implemented by

- [`Path`](../../classes/svg_drawing_core/Path.md)

## Properties

### absoluteCommands

• **absoluteCommands**: [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/types.ts:82](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L82)

___

### attrs

• **attrs**: [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes)

#### Defined in

[core/src/types.ts:81](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L81)

___

### key

• **key**: `string`

Identification key. Use for update, delete. Return same key when PathClass cloned.

#### Defined in

[core/src/types.ts:80](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L80)

___

### relativeCommands

• **relativeCommands**: [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/types.ts:83](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L83)

## Methods

### addCommand

▸ **addCommand**(`params`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\> \| [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[] |

#### Returns

`this`

#### Defined in

[core/src/types.ts:87](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L87)

___

### clone

▸ **clone**(): [`PathClass`](PathClass.md)

#### Returns

[`PathClass`](PathClass.md)

#### Defined in

[core/src/types.ts:97](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L97)

___

### deleteCommand

▸ **deleteCommand**(`i`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`this`

#### Defined in

[core/src/types.ts:93](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L93)

___

### getCommandString

▸ **getCommandString**(): `string`

#### Returns

`string`

#### Defined in

[core/src/types.ts:98](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L98)

___

### scale

▸ **scale**(`r`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

`this`

#### Defined in

[core/src/types.ts:84](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L84)

___

### scaleX

▸ **scaleX**(`r`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

`this`

#### Defined in

[core/src/types.ts:85](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L85)

___

### scaleY

▸ **scaleY**(`r`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

`this`

#### Defined in

[core/src/types.ts:86](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L86)

___

### setAttributes

▸ **setAttributes**(`attr`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attr` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |

#### Returns

`this`

#### Defined in

[core/src/types.ts:95](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L95)

___

### toJson

▸ **toJson**(): [`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Returns

[`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Defined in

[core/src/types.ts:99](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L99)

___

### translate

▸ **translate**(`p`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

`this`

#### Defined in

[core/src/types.ts:94](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L94)

___

### updateAttributes

▸ **updateAttributes**(`attr`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attr` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |

#### Returns

`this`

#### Defined in

[core/src/types.ts:96](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L96)

___

### updateCommand

▸ **updateCommand**(`i`, `update`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |
| `update` | (`absoluteCommand`: [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>) => [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\> |

#### Returns

`this`

#### Defined in

[core/src/types.ts:88](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L88)

___

### updateCommands

▸ **updateCommands**(`commands`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `commands` | [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[] |

#### Returns

`this`

#### Defined in

[core/src/types.ts:92](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L92)
