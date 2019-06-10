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
    loadScene(scene: Two.Group): void;
    loadSvgXml(svgXml: string | SVGSVGElement): void;
    private animationStart;
    initSvgXml(svgNode: SVGElement): void;
    strokeAnimation(): () => this;
    splitEnd(p: number): void;
}
