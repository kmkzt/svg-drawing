# Class: ResizeHandler

[@svg-drawing/core](../../modules/svg_drawing_core.md).ResizeHandler

### Resize SVG to match element resizing

```ts
const svg = new Svg()
const resizeHandler = new ResizeHandler(
  document.getElementById('draw-area')
)

resizeHandler.setHandler(({ width, height }) =>
  svg.resize({ width, height })
)
resizeHandler.on()
```

## Implements

- [`ResizeEventHandler`](../../interfaces/svg_drawing_core/ResizeEventHandler.md)

## Constructors

### constructor

• **new ResizeHandler**(`el?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `el` | ``null`` \| `HTMLElement` | `null` |

#### Defined in

[core/src/resize.ts:27](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/resize.ts#L27)

## Accessors

### active

• `get` **active**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ResizeEventHandler](../../interfaces/svg_drawing_core/ResizeEventHandler.md).[active](../../interfaces/svg_drawing_core/ResizeEventHandler.md#active)

#### Defined in

[core/src/resize.ts:33](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/resize.ts#L33)

## Methods

### off

▸ **off**(): `void`

#### Returns

`void`

#### Implementation of

[ResizeEventHandler](../../interfaces/svg_drawing_core/ResizeEventHandler.md).[off](../../interfaces/svg_drawing_core/ResizeEventHandler.md#off)

#### Defined in

[core/src/resize.ts:37](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/resize.ts#L37)

___

### on

▸ **on**(): `void`

#### Returns

`void`

#### Implementation of

[ResizeEventHandler](../../interfaces/svg_drawing_core/ResizeEventHandler.md).[on](../../interfaces/svg_drawing_core/ResizeEventHandler.md#on)

#### Defined in

[core/src/resize.ts:42](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/resize.ts#L42)

___

### setElement

▸ **setElement**(`el`): [`ResizeHandler`](ResizeHandler.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `el` | `HTMLElement` |

#### Returns

[`ResizeHandler`](ResizeHandler.md)

#### Implementation of

[ResizeEventHandler](../../interfaces/svg_drawing_core/ResizeEventHandler.md).[setElement](../../interfaces/svg_drawing_core/ResizeEventHandler.md#setelement)

#### Defined in

[core/src/resize.ts:47](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/resize.ts#L47)

___

### setHandler

▸ **setHandler**(`resizeCallback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `resizeCallback` | [`ResizeCallback`](../../modules/svg_drawing_core.md#resizecallback) |

#### Returns

`void`

#### Implementation of

[ResizeEventHandler](../../interfaces/svg_drawing_core/ResizeEventHandler.md).[setHandler](../../interfaces/svg_drawing_core/ResizeEventHandler.md#sethandler)

#### Defined in

[core/src/resize.ts:53](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/resize.ts#L53)
