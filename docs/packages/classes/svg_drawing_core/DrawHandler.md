# Class: DrawHandler

[@svg-drawing/core](../../modules/svg_drawing_core.md).DrawHandler

## Constructors

### constructor

• **new DrawHandler**(`_el`, `__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_el` | `HTMLElement` |
| `__namedParameters` | [`DrawHandlerCallback`](../../modules/svg_drawing_core.md#drawhandlercallback) |

#### Defined in

[core/src/handler.ts:54](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/handler.ts#L54)

## Properties

### end

• **end**: () => `void`

#### Type declaration

▸ (): `void`

EventHandler

##### Returns

`void`

#### Defined in

[core/src/handler.ts:51](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/handler.ts#L51)

___

### move

• **move**: (`po`: [`PointObject`](../../modules/svg_drawing_core.md#pointobject)) => `void`

#### Type declaration

▸ (`po`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `po` | [`PointObject`](../../modules/svg_drawing_core.md#pointobject) |

##### Returns

`void`

#### Defined in

[core/src/handler.ts:53](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/handler.ts#L53)

___

### start

• **start**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[core/src/handler.ts:52](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/handler.ts#L52)

## Methods

### off

▸ **off**(): `void`

Exec removeEventListener

#### Returns

`void`

#### Defined in

[core/src/handler.ts:76](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/handler.ts#L76)

___

### on

▸ **on**(): `void`

Exec addEventListener

#### Returns

`void`

#### Defined in

[core/src/handler.ts:82](https://github.com/kmkzt/svg-drawing/blob/c168ec0/packages/core/src/handler.ts#L82)
