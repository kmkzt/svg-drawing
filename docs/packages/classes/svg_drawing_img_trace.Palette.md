[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/img-trace](../modules/svg_drawing_img_trace.md) / Palette

# Class: Palette

[@svg-drawing/img-trace](../modules/svg_drawing_img_trace.md).Palette

## Constructors

### constructor

• **new Palette**()

## Methods

### \_deterministic

▸ `Static` `Private` **_deterministic**(`imgd`, `numberOfColors`): [`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `imgd` | `ImageData` |
| `numberOfColors` | `number` |

#### Returns

[`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Defined in

[img-trace/src/palette.ts:92](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/palette.ts#L92)

___

### grey

▸ `Static` **grey**(`numberofcolors?`): [`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `numberofcolors` | `number` | `DEFAULT_NUMBER_OF_COLORS` |

#### Returns

[`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Defined in

[img-trace/src/palette.ts:152](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/palette.ts#L152)

___

### imageData

▸ `Static` **imageData**(`argimgd`, `__namedParameters?`): [`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `argimgd` | `ImageData` |
| `__namedParameters` | [`FromImageDataOptions`](../interfaces/svg_drawing_img_trace.FromImageDataOptions.md) |

#### Returns

[`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Defined in

[img-trace/src/palette.ts:17](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/palette.ts#L17)

___

### number

▸ `Static` **number**(`numberofcolors?`): [`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `numberofcolors` | `number` | `DEFAULT_NUMBER_OF_COLORS` |

#### Returns

[`Rgba`](../interfaces/svg_drawing_img_trace.Rgba.md)[]

#### Defined in

[img-trace/src/palette.ts:116](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/img-trace/src/palette.ts#L116)
