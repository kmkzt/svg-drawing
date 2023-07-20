# Module: @svg-drawing/core

## Classes

- [Animation](../classes/svg_drawing_core/Animation.md)
- [BaseHandler](../classes/svg_drawing_core/BaseHandler.md)
- [BasicDrawFactory](../classes/svg_drawing_core/BasicDrawFactory.md)
- [BezierCurve](../classes/svg_drawing_core/BezierCurve.md)
- [Download](../classes/svg_drawing_core/Download.md)
- [Drawing](../classes/svg_drawing_core/Drawing.md)
- [EditPath](../classes/svg_drawing_core/EditPath.md)
- [EditSvg](../classes/svg_drawing_core/EditSvg.md)
- [Editing](../classes/svg_drawing_core/Editing.md)
- [Path](../classes/svg_drawing_core/Path.md)
- [PenHandler](../classes/svg_drawing_core/PenHandler.md)
- [PencilHandler](../classes/svg_drawing_core/PencilHandler.md)
- [Point](../classes/svg_drawing_core/Point.md)
- [Renderer](../classes/svg_drawing_core/Renderer.md)
- [ResizeHandler](../classes/svg_drawing_core/ResizeHandler.md)
- [ResizePathHandler](../classes/svg_drawing_core/ResizePathHandler.md)
- [Svg](../classes/svg_drawing_core/Svg.md)
- [SvgAnimation](../classes/svg_drawing_core/SvgAnimation.md)
- [SvgDrawing](../classes/svg_drawing_core/SvgDrawing.md)
- [TranslatePathHandler](../classes/svg_drawing_core/TranslatePathHandler.md)
- [Vector](../classes/svg_drawing_core/Vector.md)

## Interfaces

- [BezierCurveOption](../interfaces/svg_drawing_core/BezierCurveOption.md)
- [CommandClass](../interfaces/svg_drawing_core/CommandClass.md)
- [DrawEventHandler](../interfaces/svg_drawing_core/DrawEventHandler.md)
- [DrawFactory](../interfaces/svg_drawing_core/DrawFactory.md)
- [DrawingClass](../interfaces/svg_drawing_core/DrawingClass.md)
- [FrameAnimation](../interfaces/svg_drawing_core/FrameAnimation.md)
- [PathClass](../interfaces/svg_drawing_core/PathClass.md)
- [PointClass](../interfaces/svg_drawing_core/PointClass.md)
- [ResizeEventHandler](../interfaces/svg_drawing_core/ResizeEventHandler.md)
- [SvgClass](../interfaces/svg_drawing_core/SvgClass.md)
- [VectorClass](../interfaces/svg_drawing_core/VectorClass.md)

## Type Aliases

### AbsoluteCommandType

Ƭ **AbsoluteCommandType**: ``"M"`` \| ``"L"`` \| ``"C"`` \| ``"Q"`` \| ``"S"``

#### Defined in

[core/src/types.ts:34](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L34)

___

### AnimateAttribute

Ƭ **AnimateAttribute**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attributeName` | `string` |
| `dur` | `string` |
| `keyTimes` | `string` |
| `repeatCount` | `string` |
| `values` | `string` |

#### Defined in

[core/src/types.ts:318](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L318)

___

### AnimateObject

Ƭ **AnimateObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attributes` | [`AnimateAttribute`](svg_drawing_core.md#animateattribute) |
| `type` | ``"animate"`` |

#### Defined in

[core/src/types.ts:326](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L326)

___

### AnimationObject

Ƭ **AnimationObject**: `Record`<`string`, [`AnimateObject`](svg_drawing_core.md#animateobject)[]\>

#### Defined in

[core/src/types.ts:331](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L331)

___

### AnimationOption

Ƭ **AnimationOption**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Defined in

[core/src/types.ts:309](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L309)

___

### BoundingBoxObject

Ƭ **BoundingBoxObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pathKeys` | `string`[] |
| `position` | { `x`: `number` ; `y`: `number`  } |
| `position.x` | `number` |
| `position.y` | `number` |
| `size` | { `height`: `number` ; `width`: `number`  } |
| `size.height` | `number` |
| `size.width` | `number` |
| `vertex` | `Record`<[`FixedType`](svg_drawing_core.md#fixedtype), [`PointObject`](svg_drawing_core.md#pointobject)\> |

#### Defined in

[core/src/types.ts:276](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L276)

___

### ClearListener

Ƭ **ClearListener**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[core/src/types.ts:222](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L222)

___

### CommandObject

Ƭ **CommandObject**<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CommandType`](svg_drawing_core.md#commandtype) = [`CommandType`](svg_drawing_core.md#commandtype) |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | `T` |
| `values` | `ValueLengthMap`<`T`\> |

#### Defined in

[core/src/types.ts:65](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L65)

___

### CommandType

Ƭ **CommandType**: [`RelativeCommandType`](svg_drawing_core.md#relativecommandtype) \| [`AbsoluteCommandType`](svg_drawing_core.md#absolutecommandtype) \| [`OtherCommandType`](svg_drawing_core.md#othercommandtype)

#### Defined in

[core/src/types.ts:38](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L38)

___

### CreateCommand

Ƭ **CreateCommand**: (`points`: [`EventPoint`](svg_drawing_core.md#eventpoint)[]) => [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)[]

#### Type declaration

▸ (`points`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)[]

##### Parameters

| Name | Type |
| :------ | :------ |
| `points` | [`EventPoint`](svg_drawing_core.md#eventpoint)[] |

##### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)[]

#### Defined in

[core/src/types.ts:307](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L307)

___

### DownloadOption

Ƭ **DownloadOption**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `extension` | ``"svg"`` \| ``"png"`` \| ``"jpg"`` |
| `filename?` | `string` |

#### Defined in

[core/src/types.ts:189](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L189)

___

### DrawEventName

Ƭ **DrawEventName**: ``"pointerdown"`` \| ``"pointermove"`` \| ``"pointerleave"`` \| ``"pointercancel"`` \| ``"pointerup"`` \| ``"touchstart"`` \| ``"touchmove"`` \| ``"touchend"`` \| ``"touchcancel"`` \| ``"mousedown"`` \| ``"mousemove"`` \| ``"mouseleave"`` \| ``"mouseout"`` \| ``"mouseup"``

#### Defined in

[core/src/types.ts:206](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L206)

___

### DrawListenerType

Ƭ **DrawListenerType**: ``"pointer"`` \| ``"touch"`` \| ``"mouse"``

#### Defined in

[core/src/types.ts:204](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L204)

___

### DrawingOption

Ƭ **DrawingOption**: [`RendererOption`](svg_drawing_core.md#rendereroption) & { `close?`: `boolean` ; `curve?`: `boolean` ; `delay?`: `number` ; `fill?`: `string` ; `penColor?`: `string` ; `penWidth?`: `number`  }

#### Defined in

[core/src/types.ts:180](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L180)

___

### EditPathObject

Ƭ **EditPathObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `path` | [`PathObject`](svg_drawing_core.md#pathobject) |
| `vertex` | [`EditVertex`](svg_drawing_core.md#editvertex)[] |

#### Defined in

[core/src/types.ts:289](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L289)

___

### EditSvgObject

Ƭ **EditSvgObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `boundingBox` | [`BoundingBoxObject`](svg_drawing_core.md#boundingboxobject) |
| `paths` | [`EditPathObject`](svg_drawing_core.md#editpathobject)[] |
| `selectedOnlyPaths` | `boolean` |

#### Defined in

[core/src/types.ts:294](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L294)

___

### EditVertex

Ƭ **EditVertex**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `d` | `string` |
| `points` | { `index`: [`SelectPointIndex`](svg_drawing_core.md#selectpointindex) ; `selected`: `boolean` ; `value`: [`PointObject`](svg_drawing_core.md#pointobject)  }[] |

#### Defined in

[core/src/types.ts:267](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L267)

___

### EventPoint

Ƭ **EventPoint**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `pressure?` | `number` |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[core/src/types.ts:168](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L168)

___

### FixedType

Ƭ **FixedType**: ``"LeftTop"`` \| ``"RightTop"`` \| ``"RightBottom"`` \| ``"LeftBottom"``

#### Defined in

[core/src/types.ts:300](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L300)

___

### OtherCommandType

Ƭ **OtherCommandType**: ``"h"`` \| ``"v"`` \| ``"a"`` \| ``"H"`` \| ``"V"`` \| ``"A"`` \| ``"Z"`` \| ``"z"``

#### Defined in

[core/src/types.ts:36](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L36)

___

### PathAttributes

Ƭ **PathAttributes**: `Object`

#### Index signature

▪ [camelCase: `string`]: `string` \| `undefined`

#### Defined in

[core/src/types.ts:83](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L83)

___

### PathObject

Ƭ **PathObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attributes` | [`PathAttributes`](svg_drawing_core.md#pathattributes) |
| `key` | `string` |
| `type` | keyof `SVGElementTagNameMap` |

#### Defined in

[core/src/types.ts:87](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L87)

___

### PointObject

Ƭ **PointObject**: `Readonly`<{ `x`: `number` ; `y`: `number`  }\>

#### Defined in

[core/src/types.ts:1](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L1)

___

### RelativeCommandType

Ƭ **RelativeCommandType**: ``"m"`` \| ``"l"`` \| ``"c"`` \| ``"q"`` \| ``"s"``

#### Defined in

[core/src/types.ts:32](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L32)

___

### RendererOption

Ƭ **RendererOption**: `Pick`<[`SvgOption`](svg_drawing_core.md#svgoption), ``"background"``\>

#### Defined in

[core/src/types.ts:178](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L178)

___

### ResizeBoundingBoxBase

Ƭ **ResizeBoundingBoxBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fixedType` | [`FixedType`](svg_drawing_core.md#fixedtype) |
| `point` | [`PointObject`](svg_drawing_core.md#pointobject) |

#### Defined in

[core/src/types.ts:302](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L302)

___

### ResizeCallback

Ƭ **ResizeCallback**: (`arg`: { `height`: `number` ; `width`: `number`  }) => `void`

#### Type declaration

▸ (`arg`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | `Object` |
| `arg.height` | `number` |
| `arg.width` | `number` |

##### Returns

`void`

#### Defined in

[core/src/types.ts:194](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L194)

___

### SelectCommandIndex

Ƭ **SelectCommandIndex**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `command` | `number` |
| `path` | [`PathObject`](svg_drawing_core.md#pathobject)[``"key"``] |
| `point?` | `undefined` |

#### Defined in

[core/src/types.ts:250](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L250)

___

### SelectIndex

Ƭ **SelectIndex**: [`SelectPathIndex`](svg_drawing_core.md#selectpathindex) \| [`SelectCommandIndex`](svg_drawing_core.md#selectcommandindex) \| [`SelectPointIndex`](svg_drawing_core.md#selectpointindex)

#### Defined in

[core/src/types.ts:262](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L262)

___

### SelectPathIndex

Ƭ **SelectPathIndex**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `command?` | `undefined` |
| `path` | [`PathObject`](svg_drawing_core.md#pathobject)[``"key"``] |
| `point?` | `undefined` |

#### Defined in

[core/src/types.ts:244](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L244)

___

### SelectPointIndex

Ƭ **SelectPointIndex**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `command` | `number` |
| `path` | [`PathObject`](svg_drawing_core.md#pathobject)[``"key"``] |
| `point` | `number` |

#### Defined in

[core/src/types.ts:256](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L256)

___

### SvgObject

Ƭ **SvgObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `background?` | `string` |
| `height` | `number` |
| `paths` | [`PathObject`](svg_drawing_core.md#pathobject)[] |
| `width` | `number` |

#### Defined in

[core/src/types.ts:121](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L121)

___

### SvgOption

Ƭ **SvgOption**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `background?` | `string` |
| `height` | `number` |
| `width` | `number` |

#### Defined in

[core/src/types.ts:128](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L128)

___

### VectorObject

Ƭ **VectorObject**: `Readonly`<{ `angle`: `number` ; `value`: `number`  }\>

#### Defined in

[core/src/types.ts:19](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/types.ts#L19)

## Functions

### closeCommands

▸ **closeCommands**(`commands`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `commands` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[] |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/drawing/convert.ts:84](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/convert.ts#L84)

___

### createCommand

▸ **createCommand**<`T`\>(`__namedParameters`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<`T`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CommandType`](svg_drawing_core.md#commandtype) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`CommandObject`](svg_drawing_core.md#commandobject)<`T`\> |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<`T`\>

#### Defined in

[core/src/svg/command.ts:702](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L702)

___

### createLineCommands

▸ **createLineCommands**(`points`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `points` | [`EventPoint`](svg_drawing_core.md#eventpoint)[] |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/drawing/convert.ts:12](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/drawing/convert.ts#L12)

___

### createSvgChildElement

▸ **createSvgChildElement**<`T`\>(`elName`, `attrs`): `SVGElementTagNameMap`[`T`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends keyof `SVGElementTagNameMap` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `elName` | `T` |
| `attrs` | `Attrs` |

#### Returns

`SVGElementTagNameMap`[`T`]

#### Defined in

[core/src/renderer.ts:30](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/renderer.ts#L30)

___

### createSvgElement

▸ **createSvgElement**(`attrs`, `childs`): `SVGSVGElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | `Attrs` |
| `childs` | `SVGElement`[] |

#### Returns

`SVGSVGElement`

#### Defined in

[core/src/renderer.ts:11](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/renderer.ts#L11)

___

### isAbsoluteCommand

▸ **isAbsoluteCommand**(`command`): command is CommandClass<AbsoluteCommandType\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\> |

#### Returns

command is CommandClass<AbsoluteCommandType\>

#### Defined in

[core/src/svg/command.ts:791](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L791)

___

### isCurveCommand

▸ **isCurveCommand**(`command`): command is CommandClass<"c" \| "C"\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\> |

#### Returns

command is CommandClass<"c" \| "C"\>

#### Defined in

[core/src/svg/command.ts:801](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L801)

___

### isOtherCommand

▸ **isOtherCommand**(`command`): command is CommandClass<OtherCommandType\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\> |

#### Returns

command is CommandClass<OtherCommandType\>

#### Defined in

[core/src/svg/command.ts:805](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L805)

___

### isRelativeCommand

▸ **isRelativeCommand**(`command`): command is CommandClass<RelativeCommandType\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\> |

#### Returns

command is CommandClass<RelativeCommandType\>

#### Defined in

[core/src/svg/command.ts:796](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L796)

___

### parseCommandString

▸ **parseCommandString**(`d`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `d` | `string` |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/parser.ts:45](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/parser.ts#L45)

___

### parsePathElement

▸ **parsePathElement**(`pathEl`): [`PathClass`](../interfaces/svg_drawing_core/PathClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `pathEl` | `SVGPathElement` |

#### Returns

[`PathClass`](../interfaces/svg_drawing_core/PathClass.md)

#### Defined in

[core/src/parser.ts:27](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/parser.ts#L27)

___

### parseSVGElement

▸ **parseSVGElement**(`svgEl`): [`SvgClass`](../interfaces/svg_drawing_core/SvgClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `svgEl` | `SVGSVGElement` |

#### Returns

[`SvgClass`](../interfaces/svg_drawing_core/SvgClass.md)

#### Defined in

[core/src/parser.ts:15](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/parser.ts#L15)

___

### parseSVGString

▸ **parseSVGString**(`svgStr`): [`SvgClass`](../interfaces/svg_drawing_core/SvgClass.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `svgStr` | `string` |

#### Returns

[`SvgClass`](../interfaces/svg_drawing_core/SvgClass.md)

#### Defined in

[core/src/parser.ts:7](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/parser.ts#L7)

___

### pathObjectToElement

▸ **pathObjectToElement**(`path`): `SVGPathElement`

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | [`PathAttributes`](svg_drawing_core.md#pathattributes) |

#### Returns

`SVGPathElement`

#### Defined in

[core/src/renderer.ts:46](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/renderer.ts#L46)

___

### segmentPoint

▸ **segmentPoint**(`bezierCurve`, `range?`): `Readonly`<{ `x`: `number` ; `y`: `number`  }\>[]

**`todo`** Compatible for Quadratic and shortcut curve.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `bezierCurve` | `BezierCurvePoint` | `undefined` |
| `range` | `number` | `10` |

#### Returns

`Readonly`<{ `x`: `number` ; `y`: `number`  }\>[]

#### Defined in

[core/src/edit/segment.ts:64](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/edit/segment.ts#L64)

___

### svgObjectToElement

▸ **svgObjectToElement**(`__namedParameters`): `SVGSVGElement`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`SvgObject`](svg_drawing_core.md#svgobject) |

#### Returns

`SVGSVGElement`

#### Defined in

[core/src/renderer.ts:60](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/renderer.ts#L60)

___

### toAbsoluteCommand

▸ **toAbsoluteCommand**(`command`, `basePoint`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`AbsoluteCommandType`](svg_drawing_core.md#absolutecommandtype)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`RelativeCommandType`](svg_drawing_core.md#relativecommandtype)\> |
| `basePoint` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`AbsoluteCommandType`](svg_drawing_core.md#absolutecommandtype)\>

#### Defined in

[core/src/svg/command.ts:840](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L840)

___

### toAbsoluteCommands

▸ **toAbsoluteCommands**(`commands`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `commands` | readonly [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[] |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/svg/command.ts:898](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L898)

___

### toRelativeCommand

▸ **toRelativeCommand**(`command`, `basePoint`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`RelativeCommandType`](svg_drawing_core.md#relativecommandtype)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`AbsoluteCommandType`](svg_drawing_core.md#absolutecommandtype)\> |
| `basePoint` | `Readonly`<{ `x`: `number` ; `y`: `number`  }\> |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`RelativeCommandType`](svg_drawing_core.md#relativecommandtype)\>

#### Defined in

[core/src/svg/command.ts:810](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L810)

___

### toRelativeCommands

▸ **toRelativeCommands**(`commands`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `commands` | readonly [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[] |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/svg/command.ts:870](https://github.com/kmkzt/svg-drawing/blob/ab85f6a/packages/core/src/svg/command.ts#L870)
