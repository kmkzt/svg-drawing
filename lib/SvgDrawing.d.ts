import Two, { ConstructorParams } from 'two.js';
export interface DrawingOption extends ConstructorParams {
    el: SvgDrawing['el'];
    penColor?: SvgDrawing['penColor'];
    penWidth?: SvgDrawing['penWidth'];
    strokeCap?: SvgDrawing['strokeCap'];
    strokeLineJoin?: SvgDrawing['strokeLineJoin'];
}
export declare class SvgDrawing extends Two {
    penColor: Two.Color;
    penWidth: number;
    strokeCap: string;
    strokeLineJoin: string;
    private line;
    private current;
    private el;
    constructor(params: DrawingOption);
    toSvgXml(): string | null;
    toSvgBase64(): string | null;
    clearListner(): void;
    private init;
    private drawingStart;
    private drawingMove;
    private drawingEnd;
    private mouseDown;
    private mouseMove;
    private mouseUp;
    private touchStart;
    private touchMove;
    private touchEnd;
}
