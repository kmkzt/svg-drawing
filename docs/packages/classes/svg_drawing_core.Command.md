[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/core](../modules/svg_drawing_core.md) / Command

# Class: Command

[@svg-drawing/core](../modules/svg_drawing_core.md).Command

## Constructors

### constructor

• **new Command**(`type`, `value?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | [`CommandType`](../modules/svg_drawing_core.md#commandtype) | `undefined` |
| `value` | `number`[] | `[]` |

#### Defined in

[core/src/svg.ts:62](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L62)

## Properties

### type

• **type**: [`CommandType`](../modules/svg_drawing_core.md#commandtype)

#### Defined in

[core/src/svg.ts:59](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L59)

___

### value

• **value**: `number`[]

#### Defined in

[core/src/svg.ts:60](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L60)

## Accessors

### cl

• `get` **cl**(): `undefined` \| [`Point`](svg_drawing_core.Point.md)

#### Returns

`undefined` \| [`Point`](svg_drawing_core.Point.md)

#### Defined in

[core/src/svg.ts:90](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L90)

• `set` **cl**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | `undefined` \| [`Point`](svg_drawing_core.Point.md) |

#### Returns

`void`

#### Defined in

[core/src/svg.ts:82](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L82)

___

### cr

• `get` **cr**(): `undefined` \| [`Point`](svg_drawing_core.Point.md)

#### Returns

`undefined` \| [`Point`](svg_drawing_core.Point.md)

#### Defined in

[core/src/svg.ts:75](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L75)

• `set` **cr**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | `undefined` \| [`Point`](svg_drawing_core.Point.md) |

#### Returns

`void`

#### Defined in

[core/src/svg.ts:67](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L67)

___

### point

• `get` **point**(): `undefined` \| [`Point`](svg_drawing_core.Point.md)

#### Returns

`undefined` \| [`Point`](svg_drawing_core.Point.md)

#### Defined in

[core/src/svg.ts:103](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L103)

• `set` **point**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | `undefined` \| [`Point`](svg_drawing_core.Point.md) |

#### Returns

`void`

#### Defined in

[core/src/svg.ts:98](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L98)

## Methods

### clone

▸ **clone**(): [`Command`](svg_drawing_core.Command.md)

#### Returns

[`Command`](svg_drawing_core.Command.md)

#### Defined in

[core/src/svg.ts:121](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L121)

___

### scale

▸ **scale**(`r`): [`Command`](svg_drawing_core.Command.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Command`](svg_drawing_core.Command.md)

#### Defined in

[core/src/svg.ts:113](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L113)

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

[core/src/svg.ts:108](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/core/src/svg.ts#L108)
