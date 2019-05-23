import Two, { ConstructorParams } from 'two.js';
export interface AnimationOption extends ConstructorParams {
    el: SvgAnimation['el'];
    shakingRange?: SvgAnimation['shakingRange'];
}
export declare class SvgAnimation extends Two {
    shakingRange: number;
    private el;
    constructor(params: AnimationOption);
    shaking(): () => void;
    private animationStart;
    initSvgXml(svgNode: SVGElement): void;
    strokeAnimation(): () => this;
}
