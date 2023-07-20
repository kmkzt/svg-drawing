# Class: EditSvg

[@svg-drawing/core](../../modules/svg_drawing_core.md).EditSvg

## Constructors

### constructor

• **new EditSvg**(`svg`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `svg` | [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md) |

#### Defined in

[core/src/edit/editSvg.ts:18](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L18)

## Properties

### svg

• **svg**: [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md)

## Accessors

### selected

• `get` **selected**(): `boolean`

Return true when some path selected.

#### Returns

`boolean`

#### Defined in

[core/src/edit/editSvg.ts:21](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L21)

## Methods

### cancel

▸ **cancel**(): `void`

Clear selected status.

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:40](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L40)

___

### changeAttributes

▸ **changeAttributes**(`attrs`): `void`

Change attributes of selected path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:45](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L45)

___

### delete

▸ **delete**(): `void`

Delete the selected path.

**`todo`** Implements to delete points.

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:97](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L97)

___

### preview

▸ **preview**(): [`EditSvg`](EditSvg.md)

Clone an EditSvg class object for preview.

#### Returns

[`EditSvg`](EditSvg.md)

#### Defined in

[core/src/edit/editSvg.ts:118](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L118)

___

### resizeBoundingBox

▸ **resizeBoundingBox**(`type`, `po`): `void`

Resize based on the bounding box vertices

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`FixedType`](../../modules/svg_drawing_core.md#fixedtype) |
| `po` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:86](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L86)

___

### scale

▸ **scale**(`r`): `void`

Scale the selected path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:59](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L59)

___

### scaleX

▸ **scaleX**(`r`): `void`

Scale the selected path horizontally.

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:68](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L68)

___

### scaleY

▸ **scaleY**(`r`): `void`

Scale the selected path vertically.

#### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `number` |

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:77](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L77)

___

### select

▸ **select**(`index`, `combined?`): `void`

Select path index.

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | [`SelectIndex`](../../modules/svg_drawing_core.md#selectindex) \| [`SelectIndex`](../../modules/svg_drawing_core.md#selectindex)[] |
| `combined?` | `boolean` |

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:34](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L34)

___

### toJson

▸ **toJson**(): ``null`` \| [`EditSvgObject`](../../modules/svg_drawing_core.md#editsvgobject)

Return data in json format.

#### Returns

``null`` \| [`EditSvgObject`](../../modules/svg_drawing_core.md#editsvgobject)

#### Defined in

[core/src/edit/editSvg.ts:125](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L125)

___

### translate

▸ **translate**(`move`): `void`

Translate position of selected path.

#### Parameters

| Name | Type |
| :------ | :------ |
| `move` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

`void`

#### Defined in

[core/src/edit/editSvg.ts:50](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editSvg.ts#L50)
