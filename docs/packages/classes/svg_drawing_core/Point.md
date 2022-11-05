# Class: Point

[@svg-drawing/core](../../modules/svg_drawing_core.md).Point

## Implements

- [`PointClass`](../../interfaces/svg_drawing_core/PointClass.md)

## Constructors

### constructor

• **new Point**(`x`, `y`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[core/src/svg/point.ts:14](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L14)

## Accessors

### x

• `get` **x**(): `number`

#### Returns

`number`

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[x](../../interfaces/svg_drawing_core/PointClass.md#x)

#### Defined in

[core/src/svg/point.ts:19](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L19)

___

### y

• `get` **y**(): `number`

#### Returns

`number`

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[y](../../interfaces/svg_drawing_core/PointClass.md#y)

#### Defined in

[core/src/svg/point.ts:23](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L23)

## Methods

### add

▸ **add**(`p`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`Point`](Point.md)

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[add](../../interfaces/svg_drawing_core/PointClass.md#add)

#### Defined in

[core/src/svg/point.ts:39](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L39)

___

### clone

▸ **clone**(): [`Point`](Point.md)

#### Returns

[`Point`](Point.md)

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[clone](../../interfaces/svg_drawing_core/PointClass.md#clone)

#### Defined in

[core/src/svg/point.ts:47](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L47)

___

### scale

▸ **scale**(`r`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Point`](Point.md)

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[scale](../../interfaces/svg_drawing_core/PointClass.md#scale)

#### Defined in

[core/src/svg/point.ts:27](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L27)

___

### scaleX

▸ **scaleX**(`r`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Point`](Point.md)

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[scaleX](../../interfaces/svg_drawing_core/PointClass.md#scalex)

#### Defined in

[core/src/svg/point.ts:31](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L31)

___

### scaleY

▸ **scaleY**(`r`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Point`](Point.md)

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[scaleY](../../interfaces/svg_drawing_core/PointClass.md#scaley)

#### Defined in

[core/src/svg/point.ts:35](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L35)

___

### sub

▸ **sub**(`p`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`Point`](Point.md)

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[sub](../../interfaces/svg_drawing_core/PointClass.md#sub)

#### Defined in

[core/src/svg/point.ts:43](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L43)

___

### toJson

▸ **toJson**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Implementation of

[PointClass](../../interfaces/svg_drawing_core/PointClass.md).[toJson](../../interfaces/svg_drawing_core/PointClass.md#tojson)

#### Defined in

[core/src/svg/point.ts:51](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L51)

___

### fromVector

▸ `Static` **fromVector**(`__namedParameters`): [`Point`](Point.md)

### Calculate coordinate from vector.

```ts
const point = Point.fromVector({ value: 1, 0 })

console.log(point.x) // 0
console.log(point.y) // 1
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Readonly`<{ `angle`: `number` ; `value`: `number`  }\> |

#### Returns

[`Point`](Point.md)

#### Defined in

[core/src/svg/point.ts:68](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/point.ts#L68)
