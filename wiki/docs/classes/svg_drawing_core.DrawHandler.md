[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/core](../modules/svg_drawing_core.md) / DrawHandler

# Class: DrawHandler

[@svg-drawing/core](../modules/svg_drawing_core.md).DrawHandler

## Constructors

### constructor

• **new DrawHandler**(`_el`, `__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_el` | `HTMLElement` |
| `__namedParameters` | [`DrawHandlerCallback`](../modules/svg_drawing_core.md#drawhandlercallback) |

#### Defined in

[core/src/handler.ts:54](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L54)

## Properties

### \_clearEventList

• `Private` **\_clearEventList**: () => `void`[]

Remove EventList

#### Defined in

[core/src/handler.ts:44](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L44)

___

### \_left

• `Private` **\_left**: `number`

Offset coordinates

#### Defined in

[core/src/handler.ts:48](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L48)

___

### \_listenerOption

• `Private` **\_listenerOption**: `boolean` \| { `passive`: `boolean`  }

AddEventListener Options

#### Defined in

[core/src/handler.ts:46](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L46)

___

### \_top

• `Private` **\_top**: `number`

#### Defined in

[core/src/handler.ts:49](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L49)

___

### end

• **end**: () => `void`

#### Type declaration

▸ (): `void`

EventHandler

##### Returns

`void`

#### Defined in

[core/src/handler.ts:51](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L51)

___

### move

• **move**: (`po`: [`PointObject`](../modules/svg_drawing_core.md#pointobject)) => `void`

#### Type declaration

▸ (`po`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `po` | [`PointObject`](../modules/svg_drawing_core.md#pointobject) |

##### Returns

`void`

#### Defined in

[core/src/handler.ts:53](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L53)

___

### start

• **start**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[core/src/handler.ts:52](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L52)

## Methods

### \_handleEnd

▸ `Private` **_handleEnd**(`ev`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ev` | `TouchEvent` \| `MouseEvent` \| `PointerEvent` |

#### Returns

`void`

#### Defined in

[core/src/handler.ts:104](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L104)

___

### \_handleMove

▸ `Private` **_handleMove**(`ev`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ev` | `TouchEvent` \| `MouseEvent` \| `PointerEvent` |

#### Returns

`void`

#### Defined in

[core/src/handler.ts:109](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L109)

___

### \_handleStart

▸ `Private` **_handleStart**(`ev`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ev` | `TouchEvent` \| `MouseEvent` \| `PointerEvent` |

#### Returns

`void`

#### Defined in

[core/src/handler.ts:99](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L99)

___

### \_setupCoordinatesListener

▸ `Private` **_setupCoordinatesListener**(): `void`

#### Returns

`void`

#### Defined in

[core/src/handler.ts:164](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L164)

___

### \_setupDrawListener

▸ `Private` **_setupDrawListener**(`type`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`DrawListenerType`](../modules/svg_drawing_core.md#drawlistenertype) |

#### Returns

`void`

#### Defined in

[core/src/handler.ts:138](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L138)

___

### off

▸ **off**(): `void`

Exec removeEventListener

#### Returns

`void`

#### Defined in

[core/src/handler.ts:76](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L76)

___

### on

▸ **on**(): `void`

Exec addEventListener

#### Returns

`void`

#### Defined in

[core/src/handler.ts:82](https://github.com/kmkzt/svg-drawing/blob/ed5bdad/packages/core/src/handler.ts#L82)
