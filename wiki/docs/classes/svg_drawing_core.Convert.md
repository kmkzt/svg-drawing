[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/core](../modules/svg_drawing_core.md) / Convert

# Class: Convert

[@svg-drawing/core](../modules/svg_drawing_core.md).Convert

## Constructors

### constructor

• **new Convert**(`__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`ConvertOption`](../interfaces/svg_drawing_core.ConvertOption.md) |

#### Defined in

[core/src/convert.ts:6](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/convert.ts#L6)

## Properties

### ratio

• **ratio**: `number`

#### Defined in

[core/src/convert.ts:5](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/convert.ts#L5)

## Methods

### \_controlPoint

▸ `Private` **_controlPoint**(`pr`, `st`, `ne`): [`number`, `number`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pr` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |
| `st` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |
| `ne` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |

#### Returns

[`number`, `number`]

#### Defined in

[core/src/convert.ts:9](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/convert.ts#L9)

___

### bezierCurve

▸ **bezierCurve**(`p1`, `p2`, `p3`, `p4`): [`Command`](svg_drawing_core.Command.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `p1` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |
| `p2` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |
| `p3` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |
| `p4` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |

#### Returns

[`Command`](svg_drawing_core.Command.md)

#### Defined in

[core/src/convert.ts:22](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/convert.ts#L22)

___

### bezierCurveCommands

▸ **bezierCurveCommands**(`p`): [`Command`](svg_drawing_core.Command.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | [`PointObject`](../modules/svg_drawing_core.md#pointobject)[] |

#### Returns

[`Command`](svg_drawing_core.Command.md)[]

#### Defined in

[core/src/convert.ts:44](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/convert.ts#L44)

___

### lineCommands

▸ **lineCommands**(`points`): [`Command`](svg_drawing_core.Command.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `points` | [`PointObject`](../modules/svg_drawing_core.md#pointobject)[] |

#### Returns

[`Command`](svg_drawing_core.Command.md)[]

#### Defined in

[core/src/convert.ts:37](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/convert.ts#L37)
