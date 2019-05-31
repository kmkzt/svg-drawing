var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Two from 'two.js';
import { svgFormatting } from './utils/svgFormatting';
import { getPassiveOptions } from './utils/getPassiveOptions';
var SvgDrawing = (function (_super) {
    __extends(SvgDrawing, _super);
    function SvgDrawing(params) {
        var _this = _super.call(this, params) || this;
        _this.clearListner = _this.clearListner.bind(_this);
        _this.toSvgXml = _this.toSvgXml.bind(_this);
        _this.toSvgBase64 = _this.toSvgBase64.bind(_this);
        _this.drawingStart = _this.drawingStart.bind(_this);
        _this.drawingMove = _this.drawingMove.bind(_this);
        _this.drawingEnd = _this.drawingEnd.bind(_this);
        _this.mouseUp = _this.mouseUp.bind(_this);
        _this.mouseMove = _this.mouseMove.bind(_this);
        _this.mouseDown = _this.mouseDown.bind(_this);
        _this.touchStart = _this.touchStart.bind(_this);
        _this.touchMove = _this.touchMove.bind(_this);
        _this.touchEnd = _this.touchEnd.bind(_this);
        _this.init.bind(_this);
        _this.line = null;
        _this.current = new Two.Vector(0, 0);
        _this.penColor = params.penColor || '#333';
        _this.penWidth = params.penWidth || 10;
        _this.strokeCap = params.strokeCap || 'round';
        _this.strokeLineJoin = params.strokeLineJoin || 'round';
        _this.type = params.type || Two.Types.svg;
        _this.el = params.el;
        _this.width = params.width || _this.el.clientWidth;
        _this.height = params.height || _this.el.clientHeight;
        _this.init();
        return _this;
    }
    SvgDrawing.prototype.toSvgXml = function () {
        var domElement = this.renderer.domElement;
        var svgElement = svgFormatting(domElement.outerHTML);
        if (!domElement)
            return null;
        return "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"" + this.width + "\" height=\"" + this.height + "\" viewBox=\"0 0 " + this.width + " " + this.height + "\">" + svgElement.innerHTML + "</svg>";
    };
    SvgDrawing.prototype.toSvgBase64 = function () {
        var svgXml = this.toSvgXml();
        if (!svgXml)
            return null;
        return "data:image/svg+xml;base64," + btoa(svgXml);
    };
    SvgDrawing.prototype.clearListner = function () {
        this.el.removeEventListener('mousedown', this.mouseDown);
        this.el.removeEventListener('touchstart', this.touchStart);
    };
    SvgDrawing.prototype.init = function () {
        this.appendTo(this.el);
        this.el.addEventListener('mousedown', this.mouseDown, getPassiveOptions(false));
        this.el.addEventListener('touchstart', this.touchStart, getPassiveOptions(false));
        return this;
    };
    SvgDrawing.prototype.drawingStart = function (_a) {
        var x = _a.x, y = _a.y;
        this.current.set(x, y);
    };
    SvgDrawing.prototype.drawingMove = function (_a) {
        var _this = this;
        var x = _a.x, y = _a.y;
        var rect = this.el.getBoundingClientRect();
        var makePoint = function (mx, my) {
            return new Two.Vector(mx - rect.left, my - rect.top);
        };
        if (this.line) {
            if (this.line.linewidth !== this.penWidth ||
                this.line.stroke !== this.penColor) {
                this.drawingEnd();
                return;
            }
            var v = makePoint(x, y);
            this.line.vertices.push(v);
            return;
        }
        var vprev = makePoint(this.current.x, this.current.y);
        var vnext = makePoint(x, y);
        this.current.set(x, y);
        this.line = this.makeCurve([vprev, vnext], true);
        this.line.noFill().stroke = this.penColor;
        this.line.linewidth = this.penWidth;
        this.line.cap = this.strokeCap;
        this.line.join = this.strokeLineJoin;
        this.line.vertices.map(function (v) {
            if (!_this.line)
                return;
            v.addSelf(_this.line.translation);
        });
        this.line.translation.clear();
    };
    SvgDrawing.prototype.drawingEnd = function () {
        this.line = null;
    };
    SvgDrawing.prototype.mouseDown = function (e) {
        e.preventDefault();
        this.drawingStart({ x: e.clientX, y: e.clientY });
        this.el.addEventListener('mousemove', this.mouseMove, getPassiveOptions(false));
        this.el.addEventListener('mouseup', this.mouseUp, getPassiveOptions(false));
    };
    SvgDrawing.prototype.mouseMove = function (e) {
        e.preventDefault();
        this.drawingMove({ x: e.clientX, y: e.clientY });
    };
    SvgDrawing.prototype.mouseUp = function (e) {
        e.preventDefault();
        this.el.removeEventListener('mousemove', this.mouseMove);
        this.el.removeEventListener('mouseup', this.mouseUp);
        this.drawingEnd();
    };
    SvgDrawing.prototype.touchStart = function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        this.drawingStart({ x: touch.clientX, y: touch.clientY });
        this.el.addEventListener('touchmove', this.touchMove, getPassiveOptions(false));
        this.el.addEventListener('touchend', this.touchEnd, getPassiveOptions(false));
    };
    SvgDrawing.prototype.touchMove = function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        this.drawingMove({
            x: touch.clientX,
            y: touch.clientY
        });
    };
    SvgDrawing.prototype.touchEnd = function (e) {
        e.preventDefault();
        this.el.removeEventListener('touchmove', this.touchMove);
        this.el.removeEventListener('touchend', this.touchEnd);
        this.drawingEnd();
    };
    return SvgDrawing;
}(Two));
export { SvgDrawing };
