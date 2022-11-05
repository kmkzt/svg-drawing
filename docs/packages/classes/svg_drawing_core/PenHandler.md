# Class: PenHandler

[@svg-drawing/core](../../modules/svg_drawing_core.md).PenHandler

## Hierarchy

- [`BaseHandler`](BaseHandler.md)

  ↳ **`PenHandler`**

## Constructors

### constructor

• **new PenHandler**(`drawing`, `el?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `drawing` | [`DrawingClass`](../../interfaces/svg_drawing_core/DrawingClass.md) |
| `el?` | `HTMLElement` |

#### Overrides

[BaseHandler](BaseHandler.md).[constructor](BaseHandler.md#constructor)

#### Defined in

[core/src/drawing/eventHandler.ts:236](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/eventHandler.ts#L236)

## Properties

### drawing

• `Protected` **drawing**: [`DrawingClass`](../../interfaces/svg_drawing_core/DrawingClass.md)

#### Inherited from

[BaseHandler](BaseHandler.md).[drawing](BaseHandler.md#drawing)

___

### el

• `Protected` `Optional` **el**: `HTMLElement`

#### Inherited from

[BaseHandler](BaseHandler.md).[el](BaseHandler.md#el)

## Accessors

### active

• `get` **active**(): `boolean`

#### Returns

`boolean`

#### Inherited from

BaseHandler.active

#### Defined in

[core/src/drawing/eventHandler.ts:73](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/eventHandler.ts#L73)

## Methods

### getPointObjectFromDrawEvent

▸ **getPointObjectFromDrawEvent**(`ev`): [`EventPoint`](../../modules/svg_drawing_core.md#eventpoint)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ev` | `MouseEvent` \| `TouchEvent` \| `PointerEvent` |

#### Returns

[`EventPoint`](../../modules/svg_drawing_core.md#eventpoint)

#### Inherited from

[BaseHandler](BaseHandler.md).[getPointObjectFromDrawEvent](BaseHandler.md#getpointobjectfromdrawevent)

#### Defined in

[core/src/drawing/eventHandler.ts:103](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/eventHandler.ts#L103)

___

### off

▸ **off**(): `void`

#### Returns

`void`

#### Inherited from

[BaseHandler](BaseHandler.md).[off](BaseHandler.md#off)

#### Defined in

[core/src/drawing/eventHandler.ts:77](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/eventHandler.ts#L77)

___

### on

▸ **on**(): `void`

#### Returns

`void`

#### Inherited from

[BaseHandler](BaseHandler.md).[on](BaseHandler.md#on)

#### Defined in

[core/src/drawing/eventHandler.ts:82](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/eventHandler.ts#L82)

___

### setDrawing

▸ **setDrawing**(`drawing`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `drawing` | [`DrawingClass`](../../interfaces/svg_drawing_core/DrawingClass.md) |

#### Returns

`void`

#### Inherited from

[BaseHandler](BaseHandler.md).[setDrawing](BaseHandler.md#setdrawing)

#### Defined in

[core/src/drawing/eventHandler.ts:98](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/eventHandler.ts#L98)

___

### setElement

▸ **setElement**(`el`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `HTMLElement` |

#### Returns

`void`

#### Inherited from

[BaseHandler](BaseHandler.md).[setElement](BaseHandler.md#setelement)

#### Defined in

[core/src/drawing/eventHandler.ts:91](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/eventHandler.ts#L91)

___

### setupListener

▸ `Protected` **setupListener**(): [`ClearListener`](../../modules/svg_drawing_core.md#clearlistener)[]

#### Returns

[`ClearListener`](../../modules/svg_drawing_core.md#clearlistener)[]

#### Overrides

[BaseHandler](BaseHandler.md).[setupListener](BaseHandler.md#setuplistener)

#### Defined in

[core/src/drawing/eventHandler.ts:242](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/eventHandler.ts#L242)
