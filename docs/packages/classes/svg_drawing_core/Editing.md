# Class: Editing

[@svg-drawing/core](../../modules/svg_drawing_core.md).Editing

## Constructors

### constructor

• **new Editing**(`editSvg`, `updater?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `editSvg` | [`EditSvg`](EditSvg.md) |
| `updater` | (`eSvg`: [`EditSvg`](EditSvg.md)) => `void` |

#### Defined in

[core/src/edit/editing.ts:10](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L10)

## Properties

### editSvg

• **editSvg**: [`EditSvg`](EditSvg.md)

___

### updater

• **updater**: (`eSvg`: [`EditSvg`](EditSvg.md)) => `void`

#### Type declaration

▸ (`eSvg`): `void`

Callback function that refreshes the screen.

##### Parameters

| Name | Type |
| :------ | :------ |
| `eSvg` | [`EditSvg`](EditSvg.md) |

##### Returns

`void`

## Methods

### cancel

▸ **cancel**(): `void`

Clear selected status and update screen.

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:28](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L28)

___

### changeAttributes

▸ **changeAttributes**(`attrs`): `void`

Change attributes and update screen.

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`PathAttributes`](../../modules/svg_drawing_core.md#pathattributes) |

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:46](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L46)

___

### deletePaths

▸ **deletePaths**(): `void`

Delete path and update screen.

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:40](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L40)

___

### resize

▸ **resize**(`fixedType`, `po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fixedType` | [`FixedType`](../../modules/svg_drawing_core.md#fixedtype) |
| `po` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:64](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L64)

___

### resizePreview

▸ **resizePreview**(`fixedType`, `po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fixedType` | [`FixedType`](../../modules/svg_drawing_core.md#fixedtype) |
| `po` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:68](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L68)

___

### select

▸ **select**(`index`, `combined?`): `void`

Select edit path and update screen.

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | [`SelectIndex`](../../modules/svg_drawing_core.md#selectindex) \| [`SelectIndex`](../../modules/svg_drawing_core.md#selectindex)[] |
| `combined?` | `boolean` |

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:34](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L34)

___

### setupUpdater

▸ **setupUpdater**(`upd`): `void`

Set the callback function to update the screen

#### Parameters

| Name | Type |
| :------ | :------ |
| `upd` | (`eSvg`: [`EditSvg`](EditSvg.md)) => `void` |

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:23](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L23)

___

### translate

▸ **translate**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:55](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L55)

___

### translatePreview

▸ **translatePreview**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

`void`

#### Defined in

[core/src/edit/editing.ts:51](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/editing.ts#L51)
