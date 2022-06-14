[Documentation](../README.md) / [Exports](../modules.md) / @svg-drawing/react

# Module: @svg-drawing/react

## Type Aliases

### UseSvgDrawing

Ƭ **UseSvgDrawing**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ref` | `RefObject`<`SvgDrawing` \| ``null``\> |
| `changeClose` | (`penwidth`: `undefined` \| `boolean`) => `void` |
| `changeCurve` | (`penwidth`: `undefined` \| `boolean`) => `void` |
| `changeDelay` | (`penColor`: `undefined` \| `number`) => `void` |
| `changeFill` | (`penColor`: `undefined` \| `string`) => `void` |
| `changePenColor` | (`penColor`: `undefined` \| `string`) => `void` |
| `changePenWidth` | (`penwidth`: `undefined` \| `number`) => `void` |
| `clear` | () => `void` |
| `download` | (`opt`: `undefined` \| `DownloadOption`) => `void` |
| `getSvgXML` | () => ``null`` \| `string` |
| `undo` | () => `void` |

#### Defined in

[react/src/types.ts:7](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/react/src/types.ts#L7)

## Functions

### useSvgDrawing

▸ **useSvgDrawing**(`option?`): [`MutableRefObject`<``null`` \| `HTMLDivElement`\>, [`UseSvgDrawing`](svg_drawing_react.md#usesvgdrawing)]

#### Parameters

| Name | Type |
| :------ | :------ |
| `option?` | `Partial`<`DrawingOption`\> |

#### Returns

[`MutableRefObject`<``null`` \| `HTMLDivElement`\>, [`UseSvgDrawing`](svg_drawing_react.md#usesvgdrawing)]

#### Defined in

[react/src/useDrawing.ts:8](https://github.com/kmkzt/svg-drawing/blob/0c17b9c/packages/react/src/useDrawing.ts#L8)
