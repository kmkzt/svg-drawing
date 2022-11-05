# Class: Drawing

[@svg-drawing/core](../../modules/svg_drawing_core.md).Drawing

### Basic Drawing usage.

```ts
import {
  Svg,
  Drawing,
  PenHandler,
  Renderer,
  BasicDrawFactory,
} from '@svg-drawing/core'

const el = document.getElementById('draw')
const { width, height } = el.getBoundingClientRect()

new Drawing(
  new Svg({ width, height }),
  new BasicDrawFactory({ stroke: '#000' }),
  new PenHandler(el),
  new Renderer(el).update
)
```

## Implements

- [`DrawingClass`](../../interfaces/svg_drawing_core/DrawingClass.md)

## Constructors

### constructor

• **new Drawing**(`svg`, `pathFactory`, `update`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `svg` | [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md) |
| `pathFactory` | [`DrawFactory`](../../interfaces/svg_drawing_core/DrawFactory.md) |
| `update` | (`svg`: [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md)) => `void` |

#### Defined in

[core/src/drawing/drawing.ts:30](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/drawing.ts#L30)

## Properties

### pathFactory

• **pathFactory**: [`DrawFactory`](../../interfaces/svg_drawing_core/DrawFactory.md)

___

### svg

• **svg**: [`SvgClass`](../../interfaces/svg_drawing_core/SvgClass.md)

## Methods

### dot

▸ **dot**(`po`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `po` | [`EventPoint`](../../modules/svg_drawing_core.md#eventpoint) |

#### Returns

`void`

#### Implementation of

[DrawingClass](../../interfaces/svg_drawing_core/DrawingClass.md).[dot](../../interfaces/svg_drawing_core/DrawingClass.md#dot)

#### Defined in

[core/src/drawing/drawing.ts:51](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/drawing.ts#L51)

___

### end

▸ **end**(): `void`

#### Returns

`void`

#### Implementation of

[DrawingClass](../../interfaces/svg_drawing_core/DrawingClass.md).[end](../../interfaces/svg_drawing_core/DrawingClass.md#end)

#### Defined in

[core/src/drawing/drawing.ts:62](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/drawing.ts#L62)

___

### start

▸ **start**(): `void`

#### Returns

`void`

#### Implementation of

[DrawingClass](../../interfaces/svg_drawing_core/DrawingClass.md).[start](../../interfaces/svg_drawing_core/DrawingClass.md#start)

#### Defined in

[core/src/drawing/drawing.ts:45](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/drawing.ts#L45)
