[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/img-trace](../modules/svg_drawing_img_trace.md) / ImgLoader

# Class: ImgLoader

[@svg-drawing/img-trace](../modules/svg_drawing_img_trace.md).ImgLoader

## Constructors

### constructor

• **new ImgLoader**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`ImgLoaderOption`\> |

#### Defined in

[img-trace/src/imgloader.ts:8](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/img-trace/src/imgloader.ts#L8)

## Properties

### corsenabled

• **corsenabled**: `boolean`

#### Defined in

[img-trace/src/imgloader.ts:6](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/img-trace/src/imgloader.ts#L6)

## Methods

### fromImageElement

▸ **fromImageElement**(`img`, `callback?`): `void` \| `Promise`<`ImageData`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `img` | `HTMLImageElement` |
| `callback?` | (`imgd`: `ImageData`) => `void` |

#### Returns

`void` \| `Promise`<`ImageData`\>

#### Defined in

[img-trace/src/imgloader.ts:65](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/img-trace/src/imgloader.ts#L65)

___

### fromUrl

▸ **fromUrl**(`url`, `callback?`): `void` \| `Promise`<`ImageData`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `callback?` | (`imgd`: `ImageData`) => `void` |

#### Returns

`void` \| `Promise`<`ImageData`\>

#### Defined in

[img-trace/src/imgloader.ts:14](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/img-trace/src/imgloader.ts#L14)
