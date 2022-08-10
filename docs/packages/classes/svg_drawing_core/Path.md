# Class: Path

[@svg-drawing/core](../../modules/svg_drawing_core.md).Path

Cannot support commands that use `M` or` z` more than once `M 0 0 L 1 1 Z M 1
1 L 2 2 Z`

## Constructors

### constructor

• **new Path**(`__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`PathObject`](../../modules/svg_drawing_core.md#pathobject) |

#### Defined in

[core/src/svg.ts:153](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L153)

## Properties

### attrs

• **attrs**: [`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Defined in

[core/src/svg.ts:150](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L150)

___

### commands

• **commands**: [`Command`](Command.md)[]

#### Defined in

[core/src/svg.ts:151](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L151)

## Methods

### addCommand

▸ **addCommand**(`param`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `param` | [`Command`](Command.md) \| [`Command`](Command.md)[] |

#### Returns

[`Path`](Path.md)

#### Defined in

[core/src/svg.ts:165](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L165)

___

### clone

▸ **clone**(): [`Path`](Path.md)

#### Returns

[`Path`](Path.md)

#### Defined in

[core/src/svg.ts:236](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L236)

___

### getCommandString

▸ **getCommandString**(): `string`

#### Returns

`string`

#### Defined in

[core/src/svg.ts:173](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L173)

___

### parseCommandString

▸ **parseCommandString**(`d`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `d` | `string` |

#### Returns

`void`

#### Defined in

[core/src/svg.ts:182](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L182)

___

### parsePathElement

▸ **parsePathElement**(`pEl`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pEl` | `SVGPathElement` |

#### Returns

[`Path`](Path.md)

#### Defined in

[core/src/svg.ts:213](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L213)

___

### scale

▸ **scale**(`r`): [`Path`](Path.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Path`](Path.md)

#### Defined in

[core/src/svg.ts:159](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L159)

___

### toJson

▸ **toJson**(): [`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Returns

[`PathObject`](../../modules/svg_drawing_core.md#pathobject)

#### Defined in

[core/src/svg.ts:229](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/svg.ts#L229)
