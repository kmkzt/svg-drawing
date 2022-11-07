# Interface: PathClass

[@svg-drawing/core](../../modules/svg_drawing_core.md).PathClass

## Implemented by

- [`Path`](../../classes/svg_drawing_core/Path.md)

## Properties

### absoluteCommands

• `Readonly` **absoluteCommands**: [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/types.ts:97](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L97)

___

### attrs

• `Readonly` **attrs**: [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes)

#### Defined in

[core/src/types.ts:96](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L96)

___

### key

• **key**: `string`

Identification key. Use for update, delete. Return same key when PathClass cloned.

#### Defined in

[core/src/types.ts:95](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L95)

___

### relativeCommands

• `Readonly` **relativeCommands**: [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/types.ts:98](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L98)

## Methods

### addCommand

▸ **addCommand**(`params`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | readonly [`CommandObject`](../../modules/svg_drawing_core.md#commandobject)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[] \| `Readonly`<[`CommandObject`](../../modules/svg_drawing_core.md#commandobject)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>\> |

#### Returns

`this`

#### Defined in

[core/src/types.ts:109](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L109)

___

### clone

▸ **clone**(): [`PathClass`](PathClass.md)

#### Returns

[`PathClass`](PathClass.md)

#### Defined in

[core/src/types.ts:116](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L116)

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

[core/src/types.ts:112](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L112)

___

### getCommandString

▸ **getCommandString**(): `string`

#### Returns

`string`

#### Defined in

[core/src/types.ts:117](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L117)

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

[core/src/types.ts:99](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L99)

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

[core/src/types.ts:100](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L100)

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

[core/src/types.ts:101](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L101)

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

[core/src/types.ts:114](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L114)

___

### setCommands

▸ **setCommands**(`commands`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `commands` | readonly [`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[] \| `Readonly`<[`CommandClass`](CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>\> |

#### Returns

`this`

#### Defined in

[core/src/types.ts:102](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L102)

___

### toJson

▸ **toJson**(): [`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Returns

[`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Defined in

[core/src/types.ts:118](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L118)

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

[core/src/types.ts:113](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L113)

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

[core/src/types.ts:115](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L115)

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

[core/src/types.ts:105](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L105)
