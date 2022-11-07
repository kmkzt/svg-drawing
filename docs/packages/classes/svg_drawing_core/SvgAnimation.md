# Class: SvgAnimation

[@svg-drawing/core](../../modules/svg_drawing_core.md).SvgAnimation

## Constructors

### constructor

• **new SvgAnimation**(`svg`, `animation`, `update`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `svg` | [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md) |
| `animation` | [`Animation`](Animation.md) |
| `update` | (`svg`: [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md)) => `void` |

#### Defined in

[core/src/SvgAnimation.ts:18](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgAnimation.ts#L18)

## Properties

### animation

• **animation**: [`Animation`](Animation.md)

___

### svg

• **svg**: [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md)

## Methods

### resize

▸ **resize**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.height` | `number` |
| `__namedParameters.width` | `number` |

#### Returns

`void`

#### Defined in

[core/src/SvgAnimation.ts:110](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgAnimation.ts#L110)

___

### restore

▸ **restore**(): `void`

#### Returns

`void`

#### Defined in

[core/src/SvgAnimation.ts:33](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgAnimation.ts#L33)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[core/src/SvgAnimation.ts:38](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgAnimation.ts#L38)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[core/src/SvgAnimation.ts:26](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgAnimation.ts#L26)

___

### toElement

▸ **toElement**(): `SVGSVGElement`

#### Returns

`SVGSVGElement`

#### Defined in

[core/src/SvgAnimation.ts:78](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgAnimation.ts#L78)

___

### init

▸ `Static` **init**(`el`, `__namedParameters?`): [`SvgAnimation`](SvgAnimation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `HTMLElement` |
| `__namedParameters` | [`AnimationOption`](../../modules/svg_drawing_core.md#animationoption) & [`RendererOption`](../../modules/svg_drawing_core.md#rendereroption) |

#### Returns

[`SvgAnimation`](SvgAnimation.md)

#### Defined in

[core/src/SvgAnimation.ts:117](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/SvgAnimation.ts#L117)
