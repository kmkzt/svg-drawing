# Class: Animation

[@svg-drawing/core](../../modules/svg_drawing_core.md).Animation

## Constructors

### constructor

• **new Animation**(`__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`AnimationOption`](../../modules/svg_drawing_core.md#animationoption) |

#### Defined in

[core/src/animation/animation.ts:31](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L31)

## Properties

### generator

• `Optional` **generator**: `Generator`<[`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[], `void`, `unknown`\>

#### Defined in

[core/src/animation/animation.ts:28](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L28)

___

### ms

• **ms**: `number`

#### Defined in

[core/src/animation/animation.ts:26](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L26)

___

### paths

• **paths**: [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

#### Defined in

[core/src/animation/animation.ts:27](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L27)

## Methods

### getFramePaths

▸ **getFramePaths**(`key`): [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `number` |

#### Returns

[`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

#### Defined in

[core/src/animation/animation.ts:55](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L55)

___

### initialize

▸ **initialize**(`paths`): [`Animation`](Animation.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `paths` | [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[] |

#### Returns

[`Animation`](Animation.md)

#### Defined in

[core/src/animation/animation.ts:84](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L84)

___

### restorePaths

▸ **restorePaths**(): [`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

#### Returns

[`PathClass`](../../interfaces/svg_drawing_core/PathClass.md)[]

#### Defined in

[core/src/animation/animation.ts:63](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L63)

___

### setup

▸ **setup**(`frame`, `opts?`): `void`

`frame` is the number of frames to animate `repeat` is related for
repeatCount of animate element attribute.

#### Parameters

| Name | Type |
| :------ | :------ |
| `frame` | [`FrameAnimation`](../../interfaces/svg_drawing_core/FrameAnimation.md) |
| `opts` | `Object` |
| `opts.ms?` | `number` |
| `opts.repeatCount?` | `number` |

#### Returns

`void`

#### Defined in

[core/src/animation/animation.ts:43](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L43)

___

### toJson

▸ **toJson**(): [`AnimationObject`](../../modules/svg_drawing_core.md#animationobject)

#### Returns

[`AnimationObject`](../../modules/svg_drawing_core.md#animationobject)

#### Defined in

[core/src/animation/animation.ts:90](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/animation/animation.ts#L90)
