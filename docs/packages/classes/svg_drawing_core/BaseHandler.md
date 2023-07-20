# Class: BaseHandler

[@svg-drawing/core](../../modules/svg_drawing_core.md).BaseHandler

## Hierarchy

- **`BaseHandler`**

  ↳ [`PenHandler`](PenHandler.md)

  ↳ [`PencilHandler`](PencilHandler.md)

## Implements

- [`DrawEventHandler`](../../interfaces/svg_drawing_core/DrawEventHandler.md)

## Constructors

### constructor

• **new BaseHandler**(`drawing`, `el?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `drawing` | [`DrawingClass`](../../interfaces/svg_drawing_core/DrawingClass.md) |
| `el?` | `HTMLElement` |

#### Defined in

[core/src/drawing/eventHandler.ts:59](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/eventHandler.ts#L59)

## Properties

### drawing

• `Protected` **drawing**: [`DrawingClass`](../../interfaces/svg_drawing_core/DrawingClass.md)

___

### el

• `Protected` `Optional` **el**: `HTMLElement`

## Accessors

### active

• `get` **active**(): `boolean`

Returns true when draw event listener is active.

#### Returns

`boolean`

#### Implementation of

[DrawEventHandler](../../interfaces/svg_drawing_core/DrawEventHandler.md).[active](../../interfaces/svg_drawing_core/DrawEventHandler.md#active)

#### Defined in

[core/src/drawing/eventHandler.ts:73](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/eventHandler.ts#L73)

## Methods

### getPointObjectFromDrawEvent

▸ **getPointObjectFromDrawEvent**(`ev`): [`EventPoint`](../../modules/svg_drawing_core.md#eventpoint)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ev` | `MouseEvent` \| `TouchEvent` \| `PointerEvent` |

#### Returns

[`EventPoint`](../../modules/svg_drawing_core.md#eventpoint)

#### Defined in

[core/src/drawing/eventHandler.ts:103](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/eventHandler.ts#L103)

___

### off

▸ **off**(): `void`

#### Returns

`void`

#### Implementation of

[DrawEventHandler](../../interfaces/svg_drawing_core/DrawEventHandler.md).[off](../../interfaces/svg_drawing_core/DrawEventHandler.md#off)

#### Defined in

[core/src/drawing/eventHandler.ts:77](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/eventHandler.ts#L77)

___

### on

▸ **on**(): `void`

#### Returns

`void`

#### Implementation of

[DrawEventHandler](../../interfaces/svg_drawing_core/DrawEventHandler.md).[on](../../interfaces/svg_drawing_core/DrawEventHandler.md#on)

#### Defined in

[core/src/drawing/eventHandler.ts:82](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/eventHandler.ts#L82)

___

### setDrawing

▸ **setDrawing**(`drawing`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `drawing` | [`DrawingClass`](../../interfaces/svg_drawing_core/DrawingClass.md) |

#### Returns

`void`

#### Implementation of

[DrawEventHandler](../../interfaces/svg_drawing_core/DrawEventHandler.md).[setDrawing](../../interfaces/svg_drawing_core/DrawEventHandler.md#setdrawing)

#### Defined in

[core/src/drawing/eventHandler.ts:98](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/eventHandler.ts#L98)

___

### setElement

▸ **setElement**(`el`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `HTMLElement` |

#### Returns

`void`

#### Implementation of

[DrawEventHandler](../../interfaces/svg_drawing_core/DrawEventHandler.md).[setElement](../../interfaces/svg_drawing_core/DrawEventHandler.md#setelement)

#### Defined in

[core/src/drawing/eventHandler.ts:91](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/eventHandler.ts#L91)

___

### setupListener

▸ `Protected` `Abstract` **setupListener**(): [`ClearListener`](../../modules/svg_drawing_core.md#clearlistener)[]

#### Returns

[`ClearListener`](../../modules/svg_drawing_core.md#clearlistener)[]

#### Defined in

[core/src/drawing/eventHandler.ts:115](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/eventHandler.ts#L115)
