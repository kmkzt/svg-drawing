# Class: BezierCurve

[@svg-drawing/core](../../modules/svg_drawing_core.md).BezierCurve

## Implements

- `GenerateCommandsConverter`

## Constructors

### constructor

• **new BezierCurve**(`__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`BezierCurveOption`](../../interfaces/svg_drawing_core/BezierCurveOption.md) |

#### Defined in

[core/src/drawing/convert.ts:25](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/convert.ts#L25)

## Properties

### ratio

• **ratio**: `number`

#### Defined in

[core/src/drawing/convert.ts:24](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/convert.ts#L24)

## Methods

### create

▸ **create**(`p`): [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`EventPoint`](../../modules/svg_drawing_core.md#eventpoint)[] |

#### Returns

[`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>[]

#### Implementation of

GenerateCommandsConverter.create

#### Defined in

[core/src/drawing/convert.ts:61](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/convert.ts#L61)

___

### genCommand

▸ **genCommand**(`p1`, `p2`, `p3`, `p4`): [`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `p1` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |
| `p2` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |
| `p3` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |
| `p4` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`CommandClass`](../../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](../../modules/svg_drawing_core.md#commandtype)\>

#### Defined in

[core/src/drawing/convert.ts:30](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/convert.ts#L30)
