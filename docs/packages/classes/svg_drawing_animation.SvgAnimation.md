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

[animation/src/animation.ts:30](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L30)

## Properties

### \_anim

• `Private` **\_anim**: ``null`` \| [`FrameAnimation`](../modules/svg_drawing_animation.md#frameanimation)

#### Defined in

[animation/src/animation.ts:21](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L21)

___

### \_framesNumber

• `Private` **\_framesNumber**: `undefined` \| `number`

#### Defined in

[animation/src/animation.ts:23](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L23)

___

### \_repeatCount

• `Private` **\_repeatCount**: `string`

Relation animate element

#### Defined in

[animation/src/animation.ts:29](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L29)

___

### \_restorePaths

• `Private` **\_restorePaths**: `Path`[]

#### Defined in

[animation/src/animation.ts:22](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L22)

___

### \_stopAnimation

• `Private` **\_stopAnimation**: ``null`` \| () => `void`

#### Defined in

[animation/src/animation.ts:20](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L20)

___

### \_stopId

• `Private` **\_stopId**: `number`

Private prorperty

#### Defined in

[animation/src/animation.ts:19](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L19)

___

### ms

• **ms**: `number`

Options

#### Defined in

[animation/src/animation.ts:17](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L17)

___

### renderer

• **renderer**: `Renderer`

#### Defined in

[animation/src/animation.ts:26](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L26)

___

### resizeHandler

• **resizeHandler**: `ResizeHandler`

#### Defined in

[animation/src/animation.ts:27](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L27)

___

### svg

• **svg**: `Svg`

Modules

#### Defined in

[animation/src/animation.ts:25](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L25)

## Methods

### \_getFramesNumber

▸ `Private` **_getFramesNumber**(): `number`

#### Returns

`number`

Default value is total of commands length.

#### Defined in

[animation/src/animation.ts:241](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L241)

___

### \_registerRestorePaths

▸ `Private` **_registerRestorePaths**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:247](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L247)

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

[animation/src/animation.ts:254](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L254)

___

### \_startAnimation

▸ `Private` **_startAnimation**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:102](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L102)

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

[animation/src/animation.ts:232](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L232)

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

[animation/src/animation.ts:87](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L87)

___

### restore

▸ **restore**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:82](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L82)

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

[animation/src/animation.ts:59](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L59)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:95](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L95)

___

### stop

▸ **stop**(): `boolean`

#### Returns

`boolean`

#### Defined in

[animation/src/animation.ts:73](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L73)

___

### toElement

▸ **toElement**(): `SVGSVGElement`

#### Returns

`SVGSVGElement`

#### Defined in

[animation/src/animation.ts:132](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L132)

___

### update

▸ **update**(): `void`

#### Returns

`void`

#### Defined in

[animation/src/animation.ts:128](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/animation/src/animation.ts#L128)
