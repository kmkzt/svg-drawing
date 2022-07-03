[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/animation](../modules/svg_drawing_animation.md) / SvgAnimation

# Class: SvgAnimation

[@svg-drawing/animation](../modules/svg_drawing_animation.md).SvgAnimation

## Constructors

### constructor

• **new SvgAnimation**(`el`, `__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `HTMLElement` |
| `__namedParameters` | [`AnimationOption`](../modules/svg_drawing_animation.md#animationoption) |

#### Defined in

[animation/src/animation.ts:31](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L31)

## Properties

### \_anim

• `Private` **\_anim**: ``null`` \| [`FrameAnimation`](../modules/svg_drawing_animation.md#frameanimation)

#### Defined in

[animation/src/animation.ts:22](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L22)

___

### \_framesNumber

• `Private` **\_framesNumber**: `undefined` \| `number`

#### Defined in

[animation/src/animation.ts:24](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L24)

___

### \_repeatCount

• `Private` **\_repeatCount**: `string`

Relation animate element

#### Defined in

[animation/src/animation.ts:30](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L30)

___

### \_restorePaths

• `Private` **\_restorePaths**: `Path`[]

#### Defined in

[animation/src/animation.ts:23](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L23)

___

### \_stopAnimation

• `Private` **\_stopAnimation**: ``null`` \| () => `void`

#### Defined in

[animation/src/animation.ts:21](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L21)

___

### \_stopId

• `Private` **\_stopId**: `number`

Private prorperty

#### Defined in

[animation/src/animation.ts:20](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L20)

___

### ms

• **ms**: `number`

Options

#### Defined in

[animation/src/animation.ts:18](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L18)

___

### renderer

• **renderer**: `Renderer`

#### Defined in

[animation/src/animation.ts:27](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L27)

___

### resizeHandler

• **resizeHandler**: `ResizeHandler`

#### Defined in

[animation/src/animation.ts:28](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L28)

___

### svg

• **svg**: `Svg`

Modules

#### Defined in

[animation/src/animation.ts:26](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L26)

## Methods

### \_getFramesNumber

▸ `Private` **_getFramesNumber**(): `number`

#### Returns

`number`

Default value is total of commands length.

#### Defined in

[animation/src/animation.ts:242](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L242)

___

### \_registerRestorePaths

▸ `Private` **_registerRestorePaths**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:248](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L248)

___

### \_resize

▸ `Private` **_resize**(`__namedParameters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `DOMRect` \| { `height`: `number` ; `left`: `number` ; `top`: `number` ; `width`: `number`  } |

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:255](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L255)

___

### \_startAnimation

▸ `Private` **_startAnimation**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:103](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L103)

___

### download

▸ **download**(`filename?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename?` | `string` |

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:233](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L233)

___

### generateFrame

▸ **generateFrame**(`index?`): `Path`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `index?` | `number` |

#### Returns

`Path`[]

#### Defined in

[animation/src/animation.ts:88](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L88)

___

### restore

▸ **restore**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:83](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L83)

___

### setAnimation

▸ **setAnimation**(`fn`, `opts?`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fn` | [`FrameAnimation`](../modules/svg_drawing_animation.md#frameanimation) |  |
| `opts` | `Object` | `frame` is the number of   frames to animate `repeat` is related for repeatCount of animate element   attribute. |
| `opts.frames?` | `number` | - |
| `opts.ms?` | `number` | - |
| `opts.repeatCount?` | `string` \| `number` | - |

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:60](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L60)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:96](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L96)

___

### stop

▸ **stop**(): `boolean`

#### Returns

`boolean`

#### Defined in

[animation/src/animation.ts:74](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L74)

___

### toElement

▸ **toElement**(): `SVGSVGElement`

#### Returns

`SVGSVGElement`

#### Defined in

[animation/src/animation.ts:133](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L133)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:129](https://github.com/kmkzt/svg-drawing/blob/aa15570/packages/animation/src/animation.ts#L129)
