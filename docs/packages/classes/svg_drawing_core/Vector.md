# Class: Vector

[@svg-drawing/core](../../modules/svg_drawing_core.md).Vector

## Implements

- [`VectorClass`](../../interfaces/svg_drawing_core/VectorClass.md)

## Constructors

### constructor

• **new Vector**(`value`, `angle`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |
| `angle` | `number` |

#### Defined in

[core/src/svg/vector.ts:4](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/vector.ts#L4)

## Properties

### angle

• `Readonly` **angle**: `number`

#### Implementation of

[VectorClass](../../interfaces/svg_drawing_core/VectorClass.md).[angle](../../interfaces/svg_drawing_core/VectorClass.md#angle)

___

### value

• `Readonly` **value**: `number`

#### Implementation of

[VectorClass](../../interfaces/svg_drawing_core/VectorClass.md).[value](../../interfaces/svg_drawing_core/VectorClass.md#value)

## Methods

### rotate

▸ **rotate**(`a`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `number` |

#### Returns

[`Vector`](Vector.md)

#### Implementation of

[VectorClass](../../interfaces/svg_drawing_core/VectorClass.md).[rotate](../../interfaces/svg_drawing_core/VectorClass.md#rotate)

#### Defined in

[core/src/svg/vector.ts:10](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/vector.ts#L10)

___

### scale

▸ **scale**(`r`): [`Vector`](Vector.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

[`Vector`](Vector.md)

#### Implementation of

[VectorClass](../../interfaces/svg_drawing_core/VectorClass.md).[scale](../../interfaces/svg_drawing_core/VectorClass.md#scale)

#### Defined in

[core/src/svg/vector.ts:6](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/vector.ts#L6)

___

### toJson

▸ **toJson**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `angle` | `number` |
| `value` | `number` |

#### Implementation of

[VectorClass](../../interfaces/svg_drawing_core/VectorClass.md).[toJson](../../interfaces/svg_drawing_core/VectorClass.md#tojson)

#### Defined in

[core/src/svg/vector.ts:14](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/vector.ts#L14)

___

### fromPoint

▸ `Static` **fromPoint**(`__namedParameters`): [`Vector`](Vector.md)

### Calculate angle and absolute value from origin of coordinates

```ts
const vector = Vector.fromPoint({ x: 1, y: 1 })

console.log(vector.angle) // 45
console.log(vector.value) // 1.4142135623730951
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`Vector`](Vector.md)

#### Defined in

[core/src/svg/vector.ts:31](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/vector.ts#L31)
