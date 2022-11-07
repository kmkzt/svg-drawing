# Class: BasicDrawFactory

[@svg-drawing/core](../../modules/svg_drawing_core.md).BasicDrawFactory

## Implements

- [`DrawFactory`](../../interfaces/svg_drawing_core/DrawFactory.md)

## Constructors

### constructor

• **new BasicDrawFactory**(`attrs`, `opts?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |
| `opts` | `Object` |
| `opts.close?` | `boolean` |
| `opts.curve?` | `boolean` |

#### Defined in

[core/src/drawing/factory.ts:11](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/factory.ts#L11)

## Accessors

### createCommand

• `get` **createCommand**(): [`CreateCommand`](../../modules/svg_drawing_core.md#createcommand)

#### Returns

[`CreateCommand`](../../modules/svg_drawing_core.md#createcommand)

#### Implementation of

[DrawFactory](../../interfaces/svg_drawing_core/DrawFactory.md).[createCommand](../../interfaces/svg_drawing_core/DrawFactory.md#createcommand)

#### Defined in

[core/src/drawing/factory.ts:29](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/factory.ts#L29)

___

### curveAttribute

• `get` **curveAttribute**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `strokeLinecap` | `string` |
| `strokeLinejoin` | `string` |

#### Defined in

[core/src/drawing/factory.ts:63](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/factory.ts#L63)

## Methods

### changeClose

▸ **changeClose**(`curve`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `curve` | `boolean` |

#### Returns

`void`

#### Defined in

[core/src/drawing/factory.ts:56](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/factory.ts#L56)

___

### changeCurve

▸ **changeCurve**(`curve`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `curve` | `boolean` |

#### Returns

`void`

#### Defined in

[core/src/drawing/factory.ts:49](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/factory.ts#L49)

___

### createPath

▸ **createPath**(): [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)

#### Returns

[`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)

#### Implementation of

[DrawFactory](../../interfaces/svg_drawing_core/DrawFactory.md).[createPath](../../interfaces/svg_drawing_core/DrawFactory.md#createpath)

#### Defined in

[core/src/drawing/factory.ts:22](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/factory.ts#L22)

___

### setPathAttributes

▸ **setPathAttributes**(`attrs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |

#### Returns

`void`

#### Defined in

[core/src/drawing/factory.ts:38](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/factory.ts#L38)

___

### updatePathAttributes

▸ **updatePathAttributes**(`attrs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |

#### Returns

`void`

#### Defined in

[core/src/drawing/factory.ts:42](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/factory.ts#L42)
