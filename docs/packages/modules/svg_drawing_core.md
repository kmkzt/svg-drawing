# Module: @svg-drawing/core

## Classes

- [Animation](../classes/svg_drawing_core/Animation.md)
- [BaseHandler](../classes/svg_drawing_core/BaseHandler.md)
- [BasicDrawFactory](../classes/svg_drawing_core/BasicDrawFactory.md)
- [BezierCurve](../classes/svg_drawing_core/BezierCurve.md)
- [Close](../classes/svg_drawing_core/Close.md)
- [Curve](../classes/svg_drawing_core/Curve.md)
- [Download](../classes/svg_drawing_core/Download.md)
- [Drawing](../classes/svg_drawing_core/Drawing.md)
- [EditPath](../classes/svg_drawing_core/EditPath.md)
- [EditSvg](../classes/svg_drawing_core/EditSvg.md)
- [Editing](../classes/svg_drawing_core/Editing.md)
- [Line](../classes/svg_drawing_core/Line.md)
- [Move](../classes/svg_drawing_core/Move.md)
- [OtherCommand](../classes/svg_drawing_core/OtherCommand.md)
- [Path](../classes/svg_drawing_core/Path.md)
- [PenHandler](../classes/svg_drawing_core/PenHandler.md)
- [PencilHandler](../classes/svg_drawing_core/PencilHandler.md)
- [Point](../classes/svg_drawing_core/Point.md)
- [QuadraticCurve](../classes/svg_drawing_core/QuadraticCurve.md)
- [RelativeCurve](../classes/svg_drawing_core/RelativeCurve.md)
- [RelativeLine](../classes/svg_drawing_core/RelativeLine.md)
- [RelativeMove](../classes/svg_drawing_core/RelativeMove.md)
- [RelativeQuadraticCurve](../classes/svg_drawing_core/RelativeQuadraticCurve.md)
- [RelativeShortcutCurve](../classes/svg_drawing_core/RelativeShortcutCurve.md)
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

[core/src/types.ts:33](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L33)

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

[core/src/types.ts:299](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L299)

___

### AnimateObject

Ƭ **AnimateObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `attributes` | [`AnimateAttribute`](svg_drawing_core.md#animateattribute) |
| `type` | ``"animate"`` |

#### Defined in

[core/src/types.ts:307](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L307)

___

### AnimationObject

Ƭ **AnimationObject**: `Record`<`string`, [`AnimateObject`](svg_drawing_core.md#animateobject)[]\>

#### Defined in

[core/src/types.ts:312](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L312)

___

### AnimationOption

Ƭ **AnimationOption**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Defined in

[core/src/types.ts:290](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L290)

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

[core/src/types.ts:257](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L257)

___

### ClearListener

Ƭ **ClearListener**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[core/src/types.ts:203](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L203)

___

### CommandObject

Ƭ **CommandObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `type` | [`CommandType`](svg_drawing_core.md#commandtype) |
| `value` | `number`[] |

#### Defined in

[core/src/types.ts:50](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L50)

___

### CommandType

Ƭ **CommandType**: [`RelativeCommandType`](svg_drawing_core.md#relativecommandtype) \| [`AbsoluteCommandType`](svg_drawing_core.md#absolutecommandtype) \| [`OtherCommandType`](svg_drawing_core.md#othercommandtype)

#### Defined in

[core/src/types.ts:37](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L37)

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

[core/src/types.ts:288](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L288)

___

### DownloadOption

Ƭ **DownloadOption**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `extension` | ``"svg"`` \| ``"png"`` \| ``"jpg"`` |
| `filename?` | `string` |

#### Defined in

[core/src/types.ts:170](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L170)

___

### DrawEventName

Ƭ **DrawEventName**: ``"pointerdown"`` \| ``"pointermove"`` \| ``"pointerleave"`` \| ``"pointercancel"`` \| ``"pointerup"`` \| ``"touchstart"`` \| ``"touchmove"`` \| ``"touchend"`` \| ``"touchcancel"`` \| ``"mousedown"`` \| ``"mousemove"`` \| ``"mouseleave"`` \| ``"mouseout"`` \| ``"mouseup"``

#### Defined in

[core/src/types.ts:187](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L187)

___

### DrawListenerType

Ƭ **DrawListenerType**: ``"pointer"`` \| ``"touch"`` \| ``"mouse"``

#### Defined in

[core/src/types.ts:185](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L185)

___

### DrawingOption

Ƭ **DrawingOption**: [`RendererOption`](svg_drawing_core.md#rendereroption) & { `close?`: `boolean` ; `curve?`: `boolean` ; `delay?`: `number` ; `fill?`: `string` ; `penColor?`: `string` ; `penWidth?`: `number`  }

#### Defined in

[core/src/types.ts:161](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L161)

___

### EditPathObject

Ƭ **EditPathObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `path` | [`PathObject`](svg_drawing_core.md#pathobject) |
| `vertex` | [`EditVertex`](svg_drawing_core.md#editvertex)[] |

#### Defined in

[core/src/types.ts:270](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L270)

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

[core/src/types.ts:275](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L275)

___

### EditVertex

Ƭ **EditVertex**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `d` | `string` |
| `points` | { `index`: [`SelectPointIndex`](svg_drawing_core.md#selectpointindex) ; `selected`: `boolean` ; `value`: [`PointObject`](svg_drawing_core.md#pointobject)  }[] |

#### Defined in

[core/src/types.ts:248](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L248)

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

[core/src/types.ts:149](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L149)

___

### FixedType

Ƭ **FixedType**: ``"LeftTop"`` \| ``"RightTop"`` \| ``"RightBottom"`` \| ``"LeftBottom"``

#### Defined in

[core/src/types.ts:281](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L281)

___

### OtherCommandType

Ƭ **OtherCommandType**: ``"h"`` \| ``"v"`` \| ``"a"`` \| ``"H"`` \| ``"V"`` \| ``"A"`` \| ``"Z"`` \| ``"z"``

#### Defined in

[core/src/types.ts:35](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L35)

___

### PathAttributes

Ƭ **PathAttributes**: `Object`

#### Index signature

▪ [camelCase: `string`]: `string` \| `undefined`

#### Defined in

[core/src/types.ts:68](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L68)

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

[core/src/types.ts:72](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L72)

___

### PointObject

Ƭ **PointObject**: `Readonly`<{ `x`: `number` ; `y`: `number`  }\>

#### Defined in

[core/src/types.ts:1](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L1)

___

### RelativeCommandType

Ƭ **RelativeCommandType**: ``"m"`` \| ``"l"`` \| ``"c"`` \| ``"q"`` \| ``"s"``

#### Defined in

[core/src/types.ts:31](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L31)

___

### RendererOption

Ƭ **RendererOption**: `Pick`<[`SvgOption`](svg_drawing_core.md#svgoption), ``"background"``\>

#### Defined in

[core/src/types.ts:159](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L159)

___

### ResizeBoundingBoxBase

Ƭ **ResizeBoundingBoxBase**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fixedType` | [`FixedType`](svg_drawing_core.md#fixedtype) |
| `point` | [`PointObject`](svg_drawing_core.md#pointobject) |

#### Defined in

[core/src/types.ts:283](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L283)

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

[core/src/types.ts:175](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L175)

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

[core/src/types.ts:231](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L231)

___

### SelectIndex

Ƭ **SelectIndex**: [`SelectPathIndex`](svg_drawing_core.md#selectpathindex) \| [`SelectCommandIndex`](svg_drawing_core.md#selectcommandindex) \| [`SelectPointIndex`](svg_drawing_core.md#selectpointindex)

#### Defined in

[core/src/types.ts:243](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L243)

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

[core/src/types.ts:225](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L225)

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

[core/src/types.ts:237](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L237)

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

[core/src/types.ts:102](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L102)

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

[core/src/types.ts:109](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L109)

___

### VectorObject

Ƭ **VectorObject**: `Readonly`<{ `angle`: `number` ; `value`: `number`  }\>

#### Defined in

[core/src/types.ts:18](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/types.ts#L18)

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

[core/src/drawing/convert.ts:77](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/convert.ts#L77)

___

### createCommand

▸ **createCommand**(`type`, `values?`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | [`CommandType`](svg_drawing_core.md#commandtype) | `undefined` |
| `values` | `number`[] | `[]` |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>

#### Defined in

[core/src/svg/command.ts:696](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L696)

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

[core/src/drawing/convert.ts:12](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/drawing/convert.ts#L12)

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

[core/src/renderer.ts:30](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/renderer.ts#L30)

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

[core/src/renderer.ts:11](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/renderer.ts#L11)

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

[core/src/svg/command.ts:762](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L762)

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

[core/src/svg/command.ts:772](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L772)

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

[core/src/svg/command.ts:776](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L776)

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

[core/src/svg/command.ts:767](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L767)

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

[core/src/parser.ts:45](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/parser.ts#L45)

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

[core/src/parser.ts:27](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/parser.ts#L27)

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

[core/src/parser.ts:15](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/parser.ts#L15)

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

[core/src/parser.ts:7](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/parser.ts#L7)

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

[core/src/renderer.ts:46](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/renderer.ts#L46)

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

[core/src/edit/segment.ts:64](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/edit/segment.ts#L64)

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

[core/src/renderer.ts:60](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/renderer.ts#L60)

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

[core/src/svg/command.ts:811](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L811)

___

### toAbsoluteCommands

▸ **toAbsoluteCommands**(`commands`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `commands` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[] |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/svg/command.ts:869](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L869)

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

[core/src/svg/command.ts:781](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L781)

___

### toRelativeCommands

▸ **toRelativeCommands**(`commands`): [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `commands` | [`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[] |

#### Returns

[`CommandClass`](../interfaces/svg_drawing_core/CommandClass.md)<[`CommandType`](svg_drawing_core.md#commandtype)\>[]

#### Defined in

[core/src/svg/command.ts:841](https://github.com/kmkzt/svg-drawing/blob/6e54c2f/packages/core/src/svg/command.ts#L841)
