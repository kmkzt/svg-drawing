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
var SvgDrawing = (function (_super) {
    __extends(SvgDrawing, _super);
    function SvgDrawing(params) {
        var _this = _super.call(this, params) || this;
        _this.drawingStart = _this.drawingStart.bind(_this);
        _this.clearListner = _this.clearListner.bind(_this);
        _this.toSvgXml = _this.toSvgXml.bind(_this);
        _this.toSvgBase64 = _this.toSvgBase64.bind(_this);
        _this.move = _this.move.bind(_this);
        _this.mouseUp = _this.mouseUp.bind(_this);
        _this.mouseMove = _this.mouseMove.bind(_this);
        _this.mouseDown = _this.mouseDown.bind(_this);
        _this.touchStart = _this.touchStart.bind(_this);
        _this.touchMove = _this.touchMove.bind(_this);
        _this.touchEnd = _this.touchEnd.bind(_this);
        _this.line = null;
        _this.current = new Two.Vector(0, 0);
        _this.penColor = params.penColor || '#333';
        _this.penWidth = params.penWidth || 10;
        _this.strokeCap = params.strokeCap || 'round';
        _this.strokeLineJoin = params.strokeLineJoin || 'round';
        _this.type = params.type || Two.Types.svg;
        _this.el = params.el;
        _this.width = _this.el.clientWidth;
        _this.height = _this.el.clientHeight;
        _this.drawingStart();
        return _this;
    }
    SvgDrawing.prototype.toSvgXml = function () {
        var domElement = this.renderer.domElement;
        if (!domElement)
            return null;
        return "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"" + this.width + "\" height=\"" + this.height + "\" viewBox=\"0 0 " + this.width + " " + this.height + "\">" + domElement.innerHTML + "</svg>";
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
    SvgDrawing.prototype.drawingStart = function () {
        this.appendTo(this.el);
        this.el.addEventListener('mousedown', this.mouseDown);
        this.el.addEventListener('touchstart', this.touchStart);
        return this;
    };
    SvgDrawing.prototype.move = function (_a) {
        var _this = this;
        var x = _a.x, y = _a.y;
        var rect = this.el.getBoundingClientRect();
        var makePoint = function (mx, my) {
            return new Two.Vector(mx - rect.left, my - rect.top);
        };
        this.current.set(x, y);
        if (this.line) {
            var v = makePoint(x, y);
            this.line.vertices.push(v);
            return;
        }
        var vprev = makePoint(this.current.x, this.current.y);
        var vnext = makePoint(x, y);
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
    SvgDrawing.prototype.mouseMove = function (e) {
        this.move({ x: e.clientX, y: e.clientY });
    };
    SvgDrawing.prototype.mouseUp = function (e) {
        this.el.removeEventListener('mousemove', this.mouseMove);
        this.el.removeEventListener('mouseup', this.mouseUp);
    };
    SvgDrawing.prototype.mouseDown = function (e) {
        this.current.set(e.clientX, e.clientY);
        this.line = null;
        this.el.addEventListener('mousemove', this.mouseMove);
        this.el.addEventListener('mouseup', this.mouseUp);
    };
    SvgDrawing.prototype.touchMove = function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        this.move({
            x: touch.pageX,
            y: touch.pageY
        });
        return false;
    };
    SvgDrawing.prototype.touchEnd = function (e) {
        e.preventDefault();
        this.el.removeEventListener('touchmove', this.touchMove);
        this.el.removeEventListener('touchend', this.touchEnd);
        return false;
    };
    SvgDrawing.prototype.touchStart = function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        this.current.set(touch.pageX, touch.pageY);
        this.line = null;
        this.el.addEventListener('touchmove', this.touchMove);
        this.el.addEventListener('touchend', this.touchEnd);
        return false;
    };
    return SvgDrawing;
}(Two));
export { SvgDrawing };
