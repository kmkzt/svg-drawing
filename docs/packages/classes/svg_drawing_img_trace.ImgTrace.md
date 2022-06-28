[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/img-trace](../modules/svg_drawing_img_trace.md) / ImgTrace

# Class: ImgTrace

[@svg-drawing/img-trace](../modules/svg_drawing_img_trace.md).ImgTrace

## Constructors

### constructor

• **new ImgTrace**(`opts?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`ImgTraceOption`](../interfaces/svg_drawing_img_trace.ImgTraceOption.md) |

#### Defined in

[img-trace/src/trace.ts:200](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L200)

## Properties

### commandOmit

• **commandOmit**: `number`

#### Defined in

[img-trace/src/trace.ts:193](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L193)

___

### ltres

• **ltres**: `number`

#### Defined in

[img-trace/src/trace.ts:188](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L188)

___

### palettes

• **palettes**: [`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Defined in

[img-trace/src/trace.ts:197](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L197)

___

### pathAttrs

• **pathAttrs**: `PathObject`

#### Defined in

[img-trace/src/trace.ts:195](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L195)

___

### pathOmit

• **pathOmit**: `number`

#### Defined in

[img-trace/src/trace.ts:192](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L192)

___

### qtres

• **qtres**: `number`

#### Defined in

[img-trace/src/trace.ts:189](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L189)

___

### rightangleenhance

• **rightangleenhance**: `boolean`

#### Defined in

[img-trace/src/trace.ts:190](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L190)

## Methods

### \_boundingboxincludes

▸ `Private` **_boundingboxincludes**(`parentbbox`, `childbbox`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentbbox` | `number`[] |
| `childbbox` | `number`[] |

#### Returns

`boolean`

#### Defined in

[img-trace/src/trace.ts:416](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L416)

___

### \_colorQuantization

▸ `Private` **_colorQuantization**(`imgd`): `ColorQuantization`

#### Parameters

| Name | Type |
| :------ | :------ |
| `imgd` | `ImageData` |

#### Returns

`ColorQuantization`

#### Defined in

[img-trace/src/trace.ts:235](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L235)

___

### \_complementCommand

▸ `Private` **_complementCommand**(`info`, `layerIndex`): `Command`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `info` | `PathInfo`[] |
| `layerIndex` | `number` |

#### Returns

`Command`[]

#### Defined in

[img-trace/src/trace.ts:721](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L721)

___

### \_createPaths

▸ `Private` **_createPaths**(`pathLayer`): `Path`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathLayer` | `PathInfo`[][] |

#### Returns

`Path`[]

#### Defined in

[img-trace/src/trace.ts:730](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L730)

___

### \_edgeDetection

▸ `Private` **_edgeDetection**(`cq`, `palId`): `EdgeLayer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cq` | `ColorQuantization` |
| `palId` | `number` |

#### Returns

`EdgeLayer`

#### Defined in

[img-trace/src/trace.ts:281](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L281)

___

### \_findPaletteIndex

▸ `Private` **_findPaletteIndex**(`color`): `number`

Find similar color from palette and return ID

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | [`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md) | Pixel color |

#### Returns

`number`

#### Defined in

[img-trace/src/trace.ts:265](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L265)

___

### \_fitseq

▸ `Private` **_fitseq**(`path`, `seqstart`, `seqend`, `isHolePath?`): `Command`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `PointInfo` |
| `seqstart` | `number` |
| `seqend` | `number` |
| `isHolePath?` | `boolean` |

#### Returns

`Command`[]

#### Defined in

[img-trace/src/trace.ts:607](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L607)

___

### \_getdirection

▸ `Private` **_getdirection**(`x1`, `y1`, `x2`, `y2`): `DirectionValue`

#### Parameters

| Name | Type |
| :------ | :------ |
| `x1` | `number` |
| `y1` | `number` |
| `x2` | `number` |
| `y2` | `number` |

#### Returns

`DirectionValue`

#### Defined in

[img-trace/src/trace.ts:519](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L519)

___

### \_interpolation

▸ `Private` **_interpolation**(`paths`): `PointInfo`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `paths` | `PointInfo`[] |

#### Returns

`PointInfo`[]

#### Defined in

[img-trace/src/trace.ts:427](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L427)

___

### \_pathScan

▸ `Private` **_pathScan**(`edge`): `PointInfo`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `edge` | `EdgeLayer` |

#### Returns

`PointInfo`[]

#### Defined in

[img-trace/src/trace.ts:318](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L318)

___

### \_pointpoly

▸ `Private` **_pointpoly**(`p`, `pa`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `p` | `Point` |
| `pa` | `Point`[] |

#### Returns

`boolean`

#### Defined in

[img-trace/src/trace.ts:302](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L302)

___

### \_testrightangle

▸ `Private` **_testrightangle**(`path`, `idx1`, `idx2`, `idx3`, `idx4`, `idx5`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `PointInfo` |
| `idx1` | `number` |
| `idx2` | `number` |
| `idx3` | `number` |
| `idx4` | `number` |
| `idx5` | `number` |

#### Returns

`boolean`

#### Defined in

[img-trace/src/trace.ts:499](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L499)

___

### \_tracePath

▸ `Private` **_tracePath**(`path`): `PathInfo`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `PointInfo` |

#### Returns

`PathInfo`

#### Defined in

[img-trace/src/trace.ts:553](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L553)

___

### load

▸ **load**(`argImgd`): `Svg`

#### Parameters

| Name | Type |
| :------ | :------ |
| `argImgd` | `ImageData` |

#### Returns

`Svg`

#### Defined in

[img-trace/src/trace.ts:217](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/trace.ts#L217)
