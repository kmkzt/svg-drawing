[Documentation](../README.md) / [Exports](../modules.md) / [@svg-drawing/core](../modules/svg_drawing_core.md) / ResizeHandler

# Class: ResizeHandler

[@svg-drawing/core](../modules/svg_drawing_core.md).ResizeHandler

## Constructors

### constructor

• **new ResizeHandler**(`_el`, `__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_el` | `HTMLElement` |
| `__namedParameters` | [`ResizeHandlerCallback`](../modules/svg_drawing_core.md#resizehandlercallback) |

#### Defined in

[core/src/handler.ts:183](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/core/src/handler.ts#L183)

## Properties

### \_clearEventList

• `Private` **\_clearEventList**: () => `void`[]

Remove EventList

#### Defined in

[core/src/handler.ts:181](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/core/src/handler.ts#L181)

___

### resize

• **resize**: (`rect`: `DOMRect` \| { `height`: `number` ; `left`: `number` ; `top`: `number` ; `width`: `number`  }) => `void`

#### Type declaration

▸ (`rect`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `rect` | `DOMRect` \| { `height`: `number` ; `left`: `number` ; `top`: `number` ; `width`: `number`  } |

##### Returns

`void`

#### Defined in

[core/src/handler.ts:182](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/core/src/handler.ts#L182)

## Methods

### \_setupListerner

▸ `Private` **_setupListerner**(): `void`

#### Returns

`void`

#### Defined in

[core/src/handler.ts:197](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/core/src/handler.ts#L197)

___

### off

▸ **off**(): `void`

#### Returns

`void`

#### Defined in

[core/src/handler.ts:188](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/core/src/handler.ts#L188)

___

### on

▸ **on**(): `void`

#### Returns

`void`

#### Defined in

[core/src/handler.ts:192](https://github.com/kmkzt/svg-drawing/blob/6dacb53/packages/core/src/handler.ts#L192)
